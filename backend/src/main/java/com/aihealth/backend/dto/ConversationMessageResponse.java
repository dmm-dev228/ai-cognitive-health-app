package com.aihealth.backend.dto;

import java.time.LocalDateTime;

public class ConversationMessageResponse {

    private Long id;
    private Long journalEntryId;
    private String senderType;
    private String message;
    private LocalDateTime createdAt;

    public ConversationMessageResponse(
            Long id,
            Long journalEntryId,
            String senderType,
            String message,
            LocalDateTime createdAt) {
        this.id = id;
        this.journalEntryId = journalEntryId;
        this.senderType = senderType;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getJournalEntryId() {
        return journalEntryId;
    }

    public String getSenderType() {
        return senderType;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}