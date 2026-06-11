package com.aihealth.backend.dto;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String role;
    private String profileImageUrl;

    private Boolean journalReminderEnabled;
    private Boolean goalReminderEnabled;
    private Boolean medicationReminderEnabled;
    private Boolean communityNotificationEnabled;

    private LocalDateTime createdAt;

    public UserResponse(
            Long id,
            String username,
            String email,
            String role,
            String profileImageUrl,
            Boolean journalReminderEnabled,
            Boolean goalReminderEnabled,
            Boolean medicationReminderEnabled,
            Boolean communityNotificationEnabled,
            LocalDateTime createdAt) {

        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.profileImageUrl = profileImageUrl;
        this.journalReminderEnabled = journalReminderEnabled;
        this.goalReminderEnabled = goalReminderEnabled;
        this.medicationReminderEnabled = medicationReminderEnabled;
        this.communityNotificationEnabled = communityNotificationEnabled;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public Boolean getJournalReminderEnabled() {
        return journalReminderEnabled;
    }

    public Boolean getGoalReminderEnabled() {
        return goalReminderEnabled;
    }
public Boolean getMedicationReminderEnabled() {
    return medicationReminderEnabled;
}
public Boolean getCommunityNotificationEnabled() {
    return communityNotificationEnabled;
}
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}