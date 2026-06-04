package com.aihealth.backend.controller;

import com.aihealth.backend.dto.DailyPromptResponse;
import com.aihealth.backend.service.DailyPromptService;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/daily-prompts")
public class DailyPromptController {

    private final DailyPromptService dailyPromptService;

    public DailyPromptController(DailyPromptService dailyPromptService) {
        this.dailyPromptService = dailyPromptService;
    }

    /*
     * Returns today's AI-generated journal prompt for the current user.
     *
     * If today's prompt already exists, it returns the saved prompt.
     * If not, it generates, saves, and returns a new one.
     */
    @GetMapping("/today")
    public DailyPromptResponse getTodayPrompt() {
        return dailyPromptService.getTodayPrompt();
    }
}