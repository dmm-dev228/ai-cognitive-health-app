package com.aihealth.backend.dto;

/*
 * UpdateCommunityNotificationRequest
 * ----------------------------------
 * Request body for enabling or disabling community notifications.
 */
public class UpdateCommunityNotificationRequest {

    private Boolean communityNotificationEnabled;

    public Boolean getCommunityNotificationEnabled() {
        return communityNotificationEnabled;
    }

    public void setCommunityNotificationEnabled(Boolean communityNotificationEnabled) {
        this.communityNotificationEnabled = communityNotificationEnabled;
    }
}