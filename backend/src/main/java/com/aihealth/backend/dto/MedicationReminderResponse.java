package com.aihealth.backend.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

/*
 * MedicationReminderResponse
 * --------------------------
 * Safe response returned to frontend.
 */
public class MedicationReminderResponse {

    private Long id;
    private Long userId;
    private String medicationName;
    private String dosage;
    private String pillShape;
    private String pillColor;
    private String pillSize;
    private LocalTime reminderTime;
    private String frequency;
    private String notes;
    private Boolean isActive;
    private Boolean inAppReminderEnabled;
    private Boolean emailReminderEnabled;
    private Boolean smsReminderEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MedicationReminderResponse(
            Long id,
            Long userId,
            String medicationName,
            String dosage,
            String pillShape,
            String pillColor,
            String pillSize,
            LocalTime reminderTime,
            String frequency,
            String notes,
            Boolean isActive,
            Boolean inAppReminderEnabled,
            Boolean emailReminderEnabled,
            Boolean smsReminderEnabled,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.userId = userId;
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.pillShape = pillShape;
        this.pillColor = pillColor;
        this.pillSize = pillSize;
        this.reminderTime = reminderTime;
        this.frequency = frequency;
        this.notes = notes;
        this.isActive = isActive;
        this.inAppReminderEnabled = inAppReminderEnabled;
        this.emailReminderEnabled = emailReminderEnabled;
        this.smsReminderEnabled = smsReminderEnabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public String getDosage() {
        return dosage;
    }

    public String getPillShape() {
        return pillShape;
    }

    public String getPillColor() {
        return pillColor;
    }

    public String getPillSize() {
        return pillSize;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getNotes() {
        return notes;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public Boolean getInAppReminderEnabled() {
        return inAppReminderEnabled;
    }

    public Boolean getEmailReminderEnabled() {
        return emailReminderEnabled;
    }

    public Boolean getSmsReminderEnabled() {
        return smsReminderEnabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}