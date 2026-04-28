package com.aihealth.backend.dto;

import java.time.LocalDateTime;

public class JournalEntryResponse {

    private Long id;
    private Long userId;
    private String title;
    private String content;
    private String mood;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String aiResponse;

    public JournalEntryResponse(Long id,
                                Long userId,
                                String title,
                                String content,
                                String mood,
                                Boolean isPublic,
                                LocalDateTime createdAt,
                                LocalDateTime updatedAt,
                                String aiResponse) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.mood = mood;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.aiResponse = aiResponse;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getMood() {
        return mood;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getAiResponse() {
        return aiResponse;
    }
}