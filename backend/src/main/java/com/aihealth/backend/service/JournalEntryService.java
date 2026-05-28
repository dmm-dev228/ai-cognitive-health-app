package com.aihealth.backend.service;

import com.aihealth.backend.dto.JournalEntryRequest;
import com.aihealth.backend.dto.JournalEntryResponse;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.AIAnalysisRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;
import com.aihealth.backend.dto.ConversationAnalysis;

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
    private final ConversationMessageService conversationMessageService;
    private final AchievementService achievementService;
    private final OpenAIService openAIService;
    private final ConversationAnalysisService conversationAnalysisService;

    public JournalEntryService(
            JournalEntryRepository journalEntryRepository,
            UserRepository userRepository,
            AIAnalysisRepository aiAnalysisRepository,
            ConversationMessageService conversationMessageService,
            AchievementService achievementService,
            OpenAIService openAIService,
            ConversationAnalysisService conversationAnalysisService) {

        this.journalEntryRepository = journalEntryRepository;
        this.userRepository = userRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.conversationMessageService = conversationMessageService;
        this.achievementService = achievementService;
        this.openAIService = openAIService;
        this.conversationAnalysisService = conversationAnalysisService;
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

        // Save journal first so it gets an ID
        JournalEntry saved = journalEntryRepository.save(entry);

        // Save the user's journal content as the first conversation message
        conversationMessageService.saveMessage(
                saved,
                "USER",
                saved.getContent());

        /*
         * Build recent conversation context so the AI
         * understands ongoing conversation flow.
         */
        String recentConversationContext = buildRecentConversationContext(saved);

        /*
         * Analyze the user's newest message before AI generation.
         * This helps detect:
         * - emotional tone
         * - direct questions
         * - emotional disclosure
         * - conversational intent
         */
        ConversationAnalysis analysis = conversationAnalysisService.analyze(
                saved.getContent(),
                recentConversationContext);

        /*
         * Generate a more natural companion-style AI response.
         */
        String aiResponse = openAIService.generateSupportiveJournalResponse(
                saved.getTitle(),
                saved.getContent(),
                saved.getMood(),
                "",
                "",
                recentConversationContext +
                        "\n\nDetected Intent: " + analysis.getIntent() +
                        "\nDetected Emotional Tone: " + analysis.getEmotionalTone());

        /*
         * Save the AI response into the conversation history
         * so future messages continue naturally.
         */
        conversationMessageService.saveMessage(
                saved,
                "AI",
                aiResponse);

        achievementService.unlockAchievementIfMissing(
                user,
                "FIRST_JOURNAL_ENTRY",
                "First Journal Entry",
                "You wrote your first reflection in CogniHaven.",
                "Reflection Starter");

        long journalCount = journalEntryRepository.countByUserId(user.getId());

        if (journalCount >= 5) {
            achievementService.unlockAchievementIfMissing(
                    user,
                    "FIVE_JOURNAL_ENTRIES",
                    "Five Journal Entries",
                    "You have written five reflections in CogniHaven.",
                    "Reflection Builder");
        }

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

    /*
     * Builds lightweight recent conversation context
     * so the AI can continue conversations naturally.
     */
    private String buildRecentConversationContext(JournalEntry entry) {

        var messages = conversationMessageService.getConversationMessages(entry.getId());

        if (messages == null || messages.isEmpty()) {
            return "";
        }

        return messages.stream()
                .skip(Math.max(0, messages.size() - 6))
                .map(message -> message.getSenderType() + ": " + message.getMessage())
                .collect(Collectors.joining("\n"));
    }
}