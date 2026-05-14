package com.aihealth.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ConversationMessageRequest {

    // The user's follow-up message inside an existing journal thread
    @NotBlank(message = "Message cannot be empty")
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}