package com.aihealth.backend.service;

import com.aihealth.backend.dto.JournalEntryRequest;
import com.aihealth.backend.dto.JournalEntryResponse;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.AIAnalysisRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;
    private final UserRepository userRepository;
    private final AIAnalysisRepository aiAnalysisRepository;

    public JournalEntryService(JournalEntryRepository journalEntryRepository,
            UserRepository userRepository,
            AIAnalysisRepository aiAnalysisRepository) {
        this.journalEntryRepository = journalEntryRepository;
        this.userRepository = userRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
    }

    /*
     * Creates a new journal entry for the currently authenticated user.
     * The user's email is extracted from the JWT security context.
     */
    public JournalEntryResponse createEntry(@NonNull JournalEntryRequest request) {
        User user = getCurrentAuthenticatedUser();

        JournalEntry entry = new JournalEntry();

        entry.setUser(user);
        entry.setTitle(request.getTitle());
        entry.setContent(request.getContent());
        entry.setMood(request.getMood());
        entry.setIsPublic(request.getIsPublic());
        entry.setCreatedAt(LocalDateTime.now());
        entry.setUpdatedAt(LocalDateTime.now());

        JournalEntry saved = journalEntryRepository.save(entry);

        return mapToResponse(saved);
    }

    /*
     * Retrieves all journal entries for the currently authenticated user.
     */
    public List<JournalEntryResponse> getEntriesByCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        return journalEntryRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /*
     * Loads the currently authenticated user from the JWT email stored in the
     * security context.
     */
    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    /*
     * Converts a JournalEntry entity into a response DTO.
     * Also attaches AI response if one exists for the entry.
     */
    private JournalEntryResponse mapToResponse(@NonNull JournalEntry entry) {
        String aiResponse = null;

        var aiAnalysisList = aiAnalysisRepository.findByJournalEntryId(entry.getId());

        if (!aiAnalysisList.isEmpty()) {
            aiResponse = aiAnalysisList.get(0).getSupportiveResponse();
        }

        return new JournalEntryResponse(
                entry.getId(),
                entry.getUser().getId(),
                entry.getTitle(),
                entry.getContent(),
                entry.getMood(),
                entry.getIsPublic(),
                entry.getCreatedAt(),
                entry.getUpdatedAt(),
                aiResponse);
    }
}