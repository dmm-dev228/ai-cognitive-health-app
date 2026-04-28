package com.aihealth.backend.dto;

import java.time.LocalDateTime;

public class AIAnalysisResponse {

    private Long id;
    private Long userId;
    private Long journalEntryId;
    private String analysisType;
    private String summary;
    private String mood;
    private String keyThemes;
    private String supportiveResponse;
    private LocalDateTime createdAt;

    public AIAnalysisResponse(Long id,
            Long userId,
            Long journalEntryId,
            String analysisType,
            String summary,
            String mood,
            String keyThemes,
            String supportiveResponse,
            LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.journalEntryId = journalEntryId;
        this.analysisType = analysisType;
        this.summary = summary;
        this.mood = mood;
        this.keyThemes = keyThemes;
        this.supportiveResponse = supportiveResponse;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getJournalEntryId() {
        return journalEntryId;
    }

    public String getAnalysisType() {
        return analysisType;
    }

    public String getSummary() {
        return summary;
    }

    public String getMood() {
        return mood;
    }

    public String getKeyThemes() {
        return keyThemes;
    }

    public String getSupportiveResponse() {
        return supportiveResponse;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}