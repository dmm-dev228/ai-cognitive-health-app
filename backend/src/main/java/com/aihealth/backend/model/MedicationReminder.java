package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

/*
 * MedicationReminder
 * ------------------
 * Stores medication reminder information for a user.
 * Each reminder belongs to one authenticated user and can be enabled/disabled.
 */
@Entity
@Table(name = "medication_reminders")
public class MedicationReminder {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many medication reminders belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Medication details
    @Column(name = "medication_name", nullable = false, length = 150)
    private String medicationName;

    @Column(length = 100)
    private String dosage;

    @Column(name = "reminder_time", nullable = false)
    private LocalTime reminderTime;

    @Column(length = 50)
    private String frequency;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Allows user to disable a reminder without deleting it
    @Column(name = "is_active")
    private Boolean isActive;

    // Future notification preference: IN_APP, EMAIL, SMS
    @Column(name = "notification_method", length = 50)
    private String notificationMethod;

    // Timestamps
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public MedicationReminder() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getNotificationMethod() {
        return notificationMethod;
    }

    public void setNotificationMethod(String notificationMethod) {
        this.notificationMethod = notificationMethod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}