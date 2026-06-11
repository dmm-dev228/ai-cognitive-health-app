package com.aihealth.backend.dto;

/*
 * UpdateUsernameRequest
 * ---------------------
 * Request body for updating the currently authenticated user's username.
 */
public class UpdateUsernameRequest {

    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}