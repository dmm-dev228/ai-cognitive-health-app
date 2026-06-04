package com.aihealth.backend.service;

import com.aihealth.backend.dto.AIAnalysisResponse;
import com.aihealth.backend.dto.ConversationAnalysis;
import com.aihealth.backend.model.AIAnalysis;
import com.aihealth.backend.model.GameResult;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.AIAnalysisRepository;
import com.aihealth.backend.repository.GameResultRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/*
 * Service responsible for generating AI-based analyses for journal entries,
 * cognitive games, and analytics.
 *
 * Journal AI now uses:
 * - memory profile context
 * - recent game performance context
 * - recent conversation history
 * - conversation analysis
 *
 * This helps CogniHaven respond like a companion instead of generating
 * disconnected one-off reflections.
 */
@Service
public class AIAnalysisService {

        private final AIAnalysisRepository aiAnalysisRepository;
        private final JournalEntryRepository journalEntryRepository;
        private final MemoryProfileService memoryProfileService;
        private final OpenAIService openAIService;
        private final ConversationMessageService conversationMessageService;
        private final ConversationAnalysisService conversationAnalysisService;
        private final GameResultRepository gameResultRepository;
        private final UserRepository userRepository;

        public AIAnalysisService(
                        AIAnalysisRepository aiAnalysisRepository,
                        JournalEntryRepository journalEntryRepository,
                        MemoryProfileService memoryProfileService,
                        OpenAIService openAIService,
                        ConversationMessageService conversationMessageService,
                        ConversationAnalysisService conversationAnalysisService,
                        GameResultRepository gameResultRepository,
                        UserRepository userRepository) {
                this.aiAnalysisRepository = aiAnalysisRepository;
                this.journalEntryRepository = journalEntryRepository;
                this.memoryProfileService = memoryProfileService;
                this.openAIService = openAIService;
                this.conversationMessageService = conversationMessageService;
                this.conversationAnalysisService = conversationAnalysisService;
                this.gameResultRepository = gameResultRepository;
                this.userRepository = userRepository;
        }

        /*
         * Generates an AI reflection for a given journal entry.
         *
         * Flow:
         * 1. Fetch journal entry
         * 2. Build memory context
         * 3. Build recent game performance context
         * 4. Build recent conversation context
         * 5. Analyze latest user message
         * 6. Generate conversation-aware AI response
         * 7. Save AIAnalysis
         * 8. Save AI response into conversation thread
         */
        public AIAnalysisResponse generateJournalReflection(Long journalEntryId) {
                if (journalEntryId == null) {
                        throw new IllegalArgumentException("JournalEntryId cannot be null");
                }

                JournalEntry journalEntry = journalEntryRepository.findById(journalEntryId)
                                .orElseThrow(() -> new RuntimeException("Journal entry not found"));

                String memoryContext = buildMemoryContext(journalEntry.getUser().getId());
                String gamePerformanceContext = buildGamePerformanceContext(journalEntry.getUser().getId());
                String recentConversationContext = buildRecentConversationContext(journalEntryId);

                /*
                 * Analyze the latest journal message so the AI can respond based on
                 * intent and emotional tone instead of repeating generic support language.
                 */
                String latestUserMessage = getLatestUserMessage(journalEntryId);

                if (latestUserMessage == null || latestUserMessage.isBlank()) {
                        latestUserMessage = journalEntry.getContent();
                }

                ConversationAnalysis analysis = conversationAnalysisService.analyze(
                                latestUserMessage,
                                recentConversationContext);

                String enrichedConversationContext = recentConversationContext
                                + "\n\nConversation analysis:"
                                + "\nIntent: " + analysis.getIntent()
                                + "\nEmotional tone: " + analysis.getEmotionalTone()
                                + "\nDirect question: " + analysis.isDirectQuestion()
                                + "\nActive disclosure: " + analysis.isActiveDisclosure()
                                + "\nContinue conversation: " + analysis.isContinueConversation()
                                + "\nUrgent safety concern: " + analysis.isUrgentSafetyConcern();

                String aiResponse = openAIService.generateSupportiveJournalResponse(
                                journalEntry.getTitle(),
                                latestUserMessage,
                                journalEntry.getMood(),
                                memoryContext,
                                gamePerformanceContext,
                                enrichedConversationContext);

                AIAnalysis analysisEntity = new AIAnalysis();

                analysisEntity.setUser(journalEntry.getUser());
                analysisEntity.setJournalEntry(journalEntry);
                analysisEntity.setAnalysisType("JOURNAL_REFLECTION");
                analysisEntity.setSummary("AI-generated supportive journal reflection.");
                analysisEntity.setMood(journalEntry.getMood());
                analysisEntity.setKeyThemes("journal reflection");
                analysisEntity.setSupportiveResponse(aiResponse);
                analysisEntity.setCreatedAt(LocalDateTime.now());

                AIAnalysis saved = aiAnalysisRepository.save(analysisEntity);

                /*
                 * Save the AI response into the conversation thread.
                 * This gives future follow-up messages access to what CogniHaven already said.
                 */
                conversationMessageService.saveMessage(
                                journalEntry,
                                "AI",
                                aiResponse);

                return mapToResponse(saved);
        }

        /*
         * Builds a structured memory context string from the user's memory profile.
         *
         * Memory should help personalization, but OpenAIService is instructed not
         * to overuse it unless it naturally fits the user's latest message.
         */
        private String buildMemoryContext(Long userId) {
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
         * Builds lightweight recent conversation context for journal AI.
         *
         * Only the most recent messages are included to keep the prompt focused.
         */
        private String buildRecentConversationContext(Long journalEntryId) {
                var messages = conversationMessageService.getConversationMessages(journalEntryId);

                if (messages == null || messages.isEmpty()) {
                        return "No recent conversation history available.";
                }

                return messages.stream()
                                .skip(Math.max(0, messages.size() - 8))
                                .map(message -> message.getSenderType() + ": " + message.getMessage())
                                .collect(Collectors.joining("\n"));
        }

        /*
         * Loads the currently authenticated user from the JWT security context.
         * Used when generating user-specific AI summaries that are not tied
         * directly to a journal entry.
         */
        private User getCurrentAuthenticatedUser() {
                String email = SecurityUtils.getCurrentUserEmail();

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
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
         *
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
         *
         * This keeps game feedback inside the same AIAnalysis system as journal
         * reflections. The response should stay wellness-focused and non-medical.
         */
        public AIAnalysisResponse generateGameReflection(Long gameResultId) {
                GameResult gameResult = gameResultRepository.findById(gameResultId)
                                .orElseThrow(() -> new RuntimeException("Game result not found"));

                String memoryContext = buildMemoryContext(gameResult.getUser().getId());
                String gamePerformanceContext = buildGamePerformanceContext(gameResult.getUser().getId());

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

        /*
         * Builds structured analytics context from recent game activity.
         *
         * This gives the AI summarized wellness engagement data
         * instead of raw database entities.
         */
        private String buildAnalyticsContext(List<GameResult> results) {
                if (results == null || results.isEmpty()) {
                        return "No cognitive wellness game activity available.";
                }

                double averageScore = results.stream()
                                .mapToInt(GameResult::getScore)
                                .average()
                                .orElse(0);

                double averageTime = results.stream()
                                .mapToInt(GameResult::getTimeTakenSeconds)
                                .average()
                                .orElse(0);

                long easyGames = results.stream()
                                .filter(r -> "EASY".equalsIgnoreCase(r.getDifficulty()))
                                .count();

                long mediumGames = results.stream()
                                .filter(r -> "MEDIUM".equalsIgnoreCase(r.getDifficulty()))
                                .count();

                long hardGames = results.stream()
                                .filter(r -> "HARD".equalsIgnoreCase(r.getDifficulty()))
                                .count();

                return """
                                Recent Cognitive Wellness Analytics:

                                Total games played: %s
                                Average score: %.0f%%
                                Average completion time: %.0f seconds

                                Difficulty breakdown:
                                - Easy games: %s
                                - Medium games: %s
                                - Hard games: %s

                                Use this only as supportive wellness engagement context.
                                """
                                .formatted(
                                                results.size(),
                                                averageScore,
                                                averageTime,
                                                easyGames,
                                                mediumGames,
                                                hardGames);
        }

        /*
         * Generates an AI-powered analytics summary based on recent
         * cognitive wellness game activity.
         *
         * This provides supportive insights and engagement observations
         * without making medical claims.
         */
        public AIAnalysisResponse generateAnalyticsSummary() {
                User user = getCurrentAuthenticatedUser();

                List<GameResult> results = gameResultRepository.findByUserIdOrderByPlayedAtDesc(user.getId());

                String analyticsContext = buildAnalyticsContext(results);

                String aiResponse = openAIService.generateAnalyticsSummaryResponse(
                                analyticsContext);

                AIAnalysis analysis = new AIAnalysis();

                analysis.setUser(user);
                analysis.setAnalysisType("ANALYTICS_SUMMARY");
                analysis.setSummary("AI-generated cognitive wellness analytics summary.");
                analysis.setMood("N/A");
                analysis.setKeyThemes("analytics, wellness engagement, game trends");
                analysis.setSupportiveResponse(aiResponse);
                analysis.setCreatedAt(LocalDateTime.now());

                AIAnalysis saved = aiAnalysisRepository.save(analysis);

                return mapToResponse(saved);
        }

        /*
         * Finds the latest USER message in the journal conversation thread.
         *
         * This is critical for follow-up conversations because the original
         * JournalEntry content does not change when the user sends new messages.
         */
        private String getLatestUserMessage(Long journalEntryId) {
                var messages = conversationMessageService.getConversationMessages(journalEntryId);

                if (messages == null || messages.isEmpty()) {
                        return "";
                }

                return messages.stream()
                                .filter(message -> "USER".equalsIgnoreCase(message.getSenderType()))
                                .reduce((first, second) -> second)
                                .map(message -> message.getMessage())
                                .orElse("");
        }
}