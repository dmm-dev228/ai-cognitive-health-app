package com.aihealth.backend.service;

import com.aihealth.backend.dto.AIAnalysisResponse;
import com.aihealth.backend.model.AIAnalysis;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.repository.AIAnalysisRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.repository.GameResultRepository;
import org.springframework.stereotype.Service;
import com.aihealth.backend.model.GameResult;

import java.util.List;
import java.time.LocalDateTime;

/*
 * Service responsible for generating AI-based analyses for journal entries.
 * Integrates user context (memory profile + mood + journal content)
 * and produces a supportive, non-medical response using OpenAI.
 */
@Service
public class AIAnalysisService {

    private final AIAnalysisRepository aiAnalysisRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final MemoryProfileService memoryProfileService;
    private final OpenAIService openAIService;
    private final ConversationMessageService conversationMessageService;
    private final GameResultRepository gameResultRepository;

    public AIAnalysisService(
            AIAnalysisRepository aiAnalysisRepository,
            JournalEntryRepository journalEntryRepository,
            MemoryProfileService memoryProfileService,
            OpenAIService openAIService,
            ConversationMessageService conversationMessageService,
            GameResultRepository gameResultRepository) {
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.memoryProfileService = memoryProfileService;
        this.openAIService = openAIService;
        this.conversationMessageService = conversationMessageService;
        this.gameResultRepository = gameResultRepository;
    }

    /*
     * Generates an AI reflection for a given journal entry.
     * 
     * Flow:
     * 1. Fetch journal entry
     * 2. Build memory context for personalization
     * 3. Call OpenAI service to generate response
     * 4. Save AIAnalysis to database
     * 5. Return DTO for frontend
     */
    public AIAnalysisResponse generateJournalReflection(Long journalEntryId) {
        if (journalEntryId == null) {
            throw new IllegalArgumentException("JournalEntryId cannot be null");
        }
        JournalEntry journalEntry = journalEntryRepository.findById(journalEntryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));

        String memoryContext = buildMemoryContext(journalEntry.getUser().getId());
        // Builds recent game performance context for AI personalization.
        // This helps CogniHaven reference wellness engagement without making medical
        // claims.
        String gamePerformanceContext = buildGamePerformanceContext(journalEntry.getUser().getId());
        String aiResponse = openAIService.generateSupportiveJournalResponse(
                journalEntry.getContent(),
                journalEntry.getMood(),
                memoryContext,
                gamePerformanceContext);

        AIAnalysis analysis = new AIAnalysis();

        analysis.setUser(journalEntry.getUser());
        analysis.setJournalEntry(journalEntry);
        analysis.setAnalysisType("JOURNAL_REFLECTION");
        analysis.setSummary("AI-generated supportive journal reflection.");
        analysis.setMood(journalEntry.getMood());
        analysis.setKeyThemes("journal reflection");
        analysis.setSupportiveResponse(aiResponse);
        analysis.setCreatedAt(LocalDateTime.now());

        AIAnalysis saved = aiAnalysisRepository.save(analysis);
        // Save the AI reflection into the conversation thread.
        // This allows the journal to behave like a chat later.
        conversationMessageService.saveMessage(
                journalEntry,
                "AI",
                aiResponse);

        return mapToResponse(saved);
    }

    /*
     * Builds a structured memory context string from the user's memory profile.
     * This is passed to the AI model to make responses more personalized.
     * 
     * If no memory profile exists, a fallback message is used.
     */
    private String buildMemoryContext(Long userId) {
        // Structured context improves AI understanding compared to raw text
        try {
            var memoryProfile = memoryProfileService.getMemoryProfileEntityByUserId(userId);
            return """
                    Favorite people: %s
                    Favorite places: %s
                    Calming memories: %s
                    Favorite music: %s
                    Comforting activities: %s
                    Triggers to avoid: %s
                    """.formatted(
                    memoryProfile.getFavoritePeople(),
                    memoryProfile.getFavoritePlaces(),
                    memoryProfile.getCalmingMemories(),
                    memoryProfile.getFavoriteMusic(),
                    memoryProfile.getComfortingActivities(),
                    memoryProfile.getTriggersToAvoid());

        } catch (RuntimeException ex) {
            return "No memory profile available yet.";
        }
    }

    /*
     * Converts AIAnalysis entity into a safe response DTO.
     * Prevents exposing internal entity relationships to the frontend.
     */
    private AIAnalysisResponse mapToResponse(AIAnalysis analysis) {
        Long journalEntryId = analysis.getJournalEntry() != null
                ? analysis.getJournalEntry().getId()
                : null;

        Long gameResultId = analysis.getGameResult() != null
                ? analysis.getGameResult().getId()
                : null;
        return new AIAnalysisResponse(
                analysis.getId(),
                analysis.getUser().getId(),
                journalEntryId,
                gameResultId,
                analysis.getAnalysisType(),
                analysis.getSummary(),
                analysis.getMood(),
                analysis.getKeyThemes(),
                analysis.getSupportiveResponse(),
                analysis.getCreatedAt());
    }

    /*
     * Builds a short, structured summary of the user's recent game activity.
     * This gives the AI safe wellness context without making medical claims.
     * The goal is to support reflection around consistency, focus, and engagement.
     */
    private String buildGamePerformanceContext(Long userId) {
        List<GameResult> results = gameResultRepository.findByUserIdOrderByPlayedAtDesc(userId);

        if (results == null || results.isEmpty()) {
            return "No cognitive game activity available yet.";
        }

        StringBuilder context = new StringBuilder();

        context.append("Recent cognitive wellness game activity:\n");

        results.stream()
                .limit(5)
                .forEach(result -> {
                    context.append("- ")
                            .append(result.getGameType())
                            .append(": score ")
                            .append(result.getScore())
                            .append("%, correct ")
                            .append(result.getCorrectAnswers())
                            .append("/")
                            .append(result.getTotalQuestions())
                            .append(", difficulty ")
                            .append(result.getDifficulty())
                            .append(", time ")
                            .append(result.getTimeTakenSeconds())
                            .append(" seconds.\n");
                });

        context.append("Use this only as supportive wellness context, not as a diagnosis.");

        return context.toString();
    }

    /*
     * Generates a supportive AI reflection after a user completes a cognitive game.
     * This keeps game feedback inside the same AIAnalysis system as journal
     * reflections.
     * The response should stay wellness-focused and non-medical.
     */
    public AIAnalysisResponse generateGameReflection(Long gameResultId) {

        // Fetch the saved game result from the database.
        GameResult gameResult = gameResultRepository.findById(gameResultId)
                .orElseThrow(() -> new RuntimeException("Game result not found"));

        // Build memory context so the response can still feel personalized.
        String memoryContext = buildMemoryContext(gameResult.getUser().getId());

        // Build recent game context so the AI can reference progress and consistency.
        String gamePerformanceContext = buildGamePerformanceContext(gameResult.getUser().getId());

        /*
         * Ask OpenAI to generate a supportive game reflection.
         * We will create this OpenAIService method next.
         */
        String aiResponse = openAIService.generateGameReflectionResponse(
                gameResult.getGameType(),
                gameResult.getScore(),
                gameResult.getCorrectAnswers(),
                gameResult.getTotalQuestions(),
                gameResult.getTimeTakenSeconds(),
                gameResult.getDifficulty(),
                memoryContext,
                gamePerformanceContext);

        AIAnalysis analysis = new AIAnalysis();

        analysis.setUser(gameResult.getUser());
        analysis.setGameResult(gameResult);
        analysis.setAnalysisType("GAME_REFLECTION");
        analysis.setSummary("AI-generated supportive game reflection.");
        analysis.setMood("N/A");
        analysis.setKeyThemes("cognitive wellness game reflection");
        analysis.setSupportiveResponse(aiResponse);
        analysis.setCreatedAt(LocalDateTime.now());

        AIAnalysis saved = aiAnalysisRepository.save(analysis);

        return mapToResponse(saved);
    }
}