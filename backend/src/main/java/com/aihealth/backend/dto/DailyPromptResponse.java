package com.aihealth.backend.dto;

import java.time.LocalDate;

public class DailyPromptResponse {

    private Long id;
    private String prompt;
    private LocalDate promptDate;

    public DailyPromptResponse(Long id, String prompt, LocalDate promptDate) {
        this.id = id;
        this.prompt = prompt;
        this.promptDate = promptDate;
    }

    public Long getId() {
        return id;
    }

    public String getPrompt() {
        return prompt;
    }

    public LocalDate getPromptDate() {
        return promptDate;
    }
}