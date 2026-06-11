package com.aihealth.backend.dto;

/*
 * EmailChangeRequest
 * ------------------
 * Request body for starting a secure email change flow.
 */
public class EmailChangeRequest {

    private String newEmail;
    private String currentPassword;

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
}