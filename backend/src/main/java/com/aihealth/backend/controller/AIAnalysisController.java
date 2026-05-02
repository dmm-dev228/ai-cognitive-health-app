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

    @PostMapping("/journal/{journalEntryId}")
    public ResponseEntity<AIAnalysisResponse> generateJournalReflection(
            @PathVariable Long journalEntryId) {

        AIAnalysisResponse response = aiAnalysisService.generateJournalReflection(journalEntryId);

        return ResponseEntity.ok(response);
    }
}