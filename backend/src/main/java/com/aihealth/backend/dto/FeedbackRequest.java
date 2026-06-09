package com.aihealth.backend.dto;

/*
 * FeedbackRequest
 * ---------------
 * Represents feedback submitted from the frontend.
 */
public class FeedbackRequest {

    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}