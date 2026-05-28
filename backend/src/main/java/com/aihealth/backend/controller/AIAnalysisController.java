package com.aihealth.backend.controller;

import com.aihealth.backend.dto.AIAnalysisResponse;
import com.aihealth.backend.service.AIAnalysisService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/ai-analysis")
public class AIAnalysisController {

    private final AIAnalysisService aiAnalysisService;

    public AIAnalysisController(AIAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    /*
     * Generates a supportive AI reflection for a journal conversation.
     *
     * Example:
     * POST /api/ai-analysis/journal/5
     */
    @PostMapping("/journal/{journalEntryId}")
    public ResponseEntity<AIAnalysisResponse> generateJournalReflection(
            @PathVariable Long journalEntryId) {

        AIAnalysisResponse response = aiAnalysisService.generateJournalReflection(journalEntryId);

        return ResponseEntity.ok(response);
    }

    /*
     * Generates a supportive AI reflection for a completed cognitive wellness game.
     *
     * Example:
     * POST /api/ai-analysis/game/5
     */
    @PostMapping("/game/{gameResultId}")
    public AIAnalysisResponse generateGameReflection(
            @PathVariable Long gameResultId) {

        return aiAnalysisService.generateGameReflection(gameResultId);
    }

    /*
     * Generates an AI-powered summary of the user's game analytics.
     *
     * Example:
     * POST /api/ai-analysis/analytics-summary
     */
    @PostMapping("/analytics-summary")
    public AIAnalysisResponse generateAnalyticsSummary() {
        return aiAnalysisService.generateAnalyticsSummary();
    }
}