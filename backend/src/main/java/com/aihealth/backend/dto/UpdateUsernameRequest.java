package com.aihealth.backend.dto;

/*
 * UpdateUsernameRequest
 * ---------------------
 * Request body for securely updating username.
 * Current password is required to protect account changes.
 */
public class UpdateUsernameRequest {

    private String username;
    private String currentPassword;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
}