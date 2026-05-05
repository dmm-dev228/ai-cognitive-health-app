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
    private LocalTime reminderTime;
    private String frequency;
    private String notes;
    private Boolean isActive;
    private String notificationMethod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MedicationReminderResponse(
            Long id,
            Long userId,
            String medicationName,
            String dosage,
            LocalTime reminderTime,
            String frequency,
            String notes,
            Boolean isActive,
            String notificationMethod,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.userId = userId;
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.reminderTime = reminderTime;
        this.frequency = frequency;
        this.notes = notes;
        this.isActive = isActive;
        this.notificationMethod = notificationMethod;
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

    public String getNotificationMethod() {
        return notificationMethod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}