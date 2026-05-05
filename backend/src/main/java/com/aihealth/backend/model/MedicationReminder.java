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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many medication reminders belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "medication_name", nullable = false, length = 150)
    private String medicationName;

    @Column(length = 100)
    private String dosage;

    @Column(name = "pill_shape", length = 100)
    private String pillShape;

    @Column(name = "pill_color", length = 100)
    private String pillColor;

    @Column(name = "pill_size", length = 100)
    private String pillSize;

    @Column(name = "reminder_time", nullable = false)
    private LocalTime reminderTime;

    @Column(length = 50)
    private String frequency;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "in_app_reminder_enabled")
    private Boolean inAppReminderEnabled;

    @Column(name = "email_reminder_enabled")
    private Boolean emailReminderEnabled;

    @Column(name = "sms_reminder_enabled")
    private Boolean smsReminderEnabled;
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

    public String getPillShape() {
        return pillShape;
    }

    public void setPillShape(String pillShape) {
        this.pillShape = pillShape;
    }

    public String getPillColor() {
        return pillColor;
    }

    public void setPillColor(String pillColor) {
        this.pillColor = pillColor;
    }

    public String getPillSize() {
        return pillSize;
    }

    public void setPillSize(String pillSize) {
        this.pillSize = pillSize;
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

    public Boolean getInAppReminderEnabled() {
        return inAppReminderEnabled;
    }

    public void setInAppReminderEnabled(Boolean inAppReminderEnabled) {
        this.inAppReminderEnabled = inAppReminderEnabled;
    }

    public Boolean getEmailReminderEnabled() {
        return emailReminderEnabled;
    }

    public void setEmailReminderEnabled(Boolean emailReminderEnabled) {
        this.emailReminderEnabled = emailReminderEnabled;
    }

    public Boolean getSmsReminderEnabled() {
        return smsReminderEnabled;
    }

    public void setSmsReminderEnabled(Boolean smsReminderEnabled) {
        this.smsReminderEnabled = smsReminderEnabled;
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