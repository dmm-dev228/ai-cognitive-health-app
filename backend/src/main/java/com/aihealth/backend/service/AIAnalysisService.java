package com.aihealth.backend.service;

import com.aihealth.backend.dto.AIAnalysisResponse;
import com.aihealth.backend.model.AIAnalysis;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.repository.AIAnalysisRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AIAnalysisService {

    private final AIAnalysisRepository aiAnalysisRepository;
    private final JournalEntryRepository journalEntryRepository;

    public AIAnalysisService(AIAnalysisRepository aiAnalysisRepository,
            JournalEntryRepository journalEntryRepository) {
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.journalEntryRepository = journalEntryRepository;
    }

    public AIAnalysisResponse generateJournalReflection(Long journalEntryId) {
        JournalEntry journalEntry = journalEntryRepository.findById(journalEntryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));

        AIAnalysis analysis = new AIAnalysis();

        analysis.setUser(journalEntry.getUser());
        analysis.setJournalEntry(journalEntry);
        analysis.setAnalysisType("JOURNAL_REFLECTION");
        analysis.setSummary("This entry reflects a moment from your day.");
        analysis.setMood(journalEntry.getMood());
        analysis.setKeyThemes("daily reflection");
        analysis.setSupportiveResponse(
                "Thank you for sharing that. I’m here with you, and this reflection can help you stay connected to your thoughts and routines.");
        analysis.setCreatedAt(LocalDateTime.now());

        AIAnalysis saved = aiAnalysisRepository.save(analysis);

        return mapToResponse(saved);
    }

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