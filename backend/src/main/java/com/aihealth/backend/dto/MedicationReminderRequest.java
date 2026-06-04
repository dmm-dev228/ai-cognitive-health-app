package com.aihealth.backend.dto;

import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/*
 * MedicationReminderRequest
 * -------------------------
 * Incoming data from frontend when creating/updating a medication reminder.
 *
 * Validation protects the backend from:
 * - empty medication names
 * - invalid reminder frequencies
 * - missing reminder times
 * - overly large text values
 */
public class MedicationReminderRequest {

    /*
     * Medication name is required because the reminder needs
     * a clear label for notifications and display.
     */
    @NotBlank(message = "Medication name is required")
    @Size(max = 150, message = "Medication name cannot exceed 150 characters")
    private String medicationName;

    @Size(max = 100, message = "Dosage cannot exceed 100 characters")
    private String dosage;

    @Size(max = 100, message = "Pill shape cannot exceed 100 characters")
    private String pillShape;

    @Size(max = 100, message = "Pill color cannot exceed 100 characters")
    private String pillColor;

    @Size(max = 100, message = "Pill size cannot exceed 100 characters")
    private String pillSize;

    /*
     * Number of times this medication should remind the user per day.
     *
     * MVP limit:
     * 1 to 4 times daily.
     */
    @NotNull(message = "Frequency per day is required")
    @Min(value = 1, message = "Frequency must be at least once per day")
    @Max(value = 4, message = "Frequency cannot exceed 4 times per day")
    private Integer frequencyPerDay;

    /*
     * List of reminder times.
     *
     * Example:
     * frequencyPerDay = 3
     * reminderTimes = [08:00, 14:00, 20:00]
     */
    @NotEmpty(message = "At least one reminder time is required")
    private List<LocalTime> reminderTimes;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    private Boolean isActive;
    private Boolean inAppReminderEnabled;
    private Boolean emailReminderEnabled;
    private Boolean smsReminderEnabled;

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

    public Integer getFrequencyPerDay() {
        return frequencyPerDay;
    }

    public void setFrequencyPerDay(Integer frequencyPerDay) {
        this.frequencyPerDay = frequencyPerDay;
    }

    public List<LocalTime> getReminderTimes() {
        return reminderTimes;
    }

    public void setReminderTimes(List<LocalTime> reminderTimes) {
        this.reminderTimes = reminderTimes;
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
}