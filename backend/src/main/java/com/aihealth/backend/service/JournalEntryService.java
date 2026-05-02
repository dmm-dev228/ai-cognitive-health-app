package com.aihealth.backend.service;

import com.aihealth.backend.dto.JournalEntryRequest;
import com.aihealth.backend.dto.JournalEntryResponse;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.AIAnalysisRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.repository.UserRepository;
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

    // Create journal entry
    public JournalEntryResponse createEntry(Long userId, JournalEntryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    // Get all entries for a user
    public List<JournalEntryResponse> getEntriesByUser(Long userId) {
        return journalEntryRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private JournalEntryResponse mapToResponse(JournalEntry entry) {
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