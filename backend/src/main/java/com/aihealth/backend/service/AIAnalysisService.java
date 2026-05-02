package com.aihealth.backend.service;

import com.aihealth.backend.dto.AIAnalysisResponse;
import com.aihealth.backend.model.AIAnalysis;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.repository.AIAnalysisRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import org.springframework.stereotype.Service;

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

    public AIAnalysisService(AIAnalysisRepository aiAnalysisRepository,
            JournalEntryRepository journalEntryRepository,
            MemoryProfileService memoryProfileService,
            OpenAIService openAIService) {
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.memoryProfileService = memoryProfileService;
        this.openAIService = openAIService;
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
        JournalEntry journalEntry = journalEntryRepository.findById(journalEntryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));

        String memoryContext = buildMemoryContext(journalEntry.getUser().getId());

        String aiResponse = openAIService.generateSupportiveJournalResponse(
                journalEntry.getContent(),
                journalEntry.getMood(),
                memoryContext);

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
            var memoryProfile = memoryProfileService.getMemoryProfileByUserId(userId);

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
        return new AIAnalysisResponse(
                analysis.getId(),
                analysis.getUser().getId(),
                analysis.getJournalEntry().getId(),
                analysis.getAnalysisType(),
                analysis.getSummary(),
                analysis.getMood(),
                analysis.getKeyThemes(),
                analysis.getSupportiveResponse(),
                analysis.getCreatedAt());
    }
}