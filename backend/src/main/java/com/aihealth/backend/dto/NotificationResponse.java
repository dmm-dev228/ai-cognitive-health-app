package com.aihealth.backend.dto;

/*
 * NotificationResponse
 * --------------------
 * Safe notification object returned to the frontend.
 */
public class NotificationResponse {

    private String type;
    private String message;
    private String actionUrl;

    public NotificationResponse(String type, String message, String actionUrl) {
        this.type = type;
        this.message = message;
        this.actionUrl = actionUrl;
    }

    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public String getActionUrl() {
        return actionUrl;
    }
}