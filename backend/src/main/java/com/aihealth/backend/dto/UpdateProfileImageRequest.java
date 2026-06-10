package com.aihealth.backend.dto;

/*
 * UpdateProfileImageRequest
 * -------------------------
 * Request body for updating the currently authenticated user's
 * profile image URL.
 */
public class UpdateProfileImageRequest {

    private String profileImageUrl;

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}