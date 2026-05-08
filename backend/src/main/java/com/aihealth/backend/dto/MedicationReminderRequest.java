package com.aihealth.backend.dto;

import java.time.LocalTime;
import java.util.List;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

/*
 * MedicationReminderRequest
 * -------------------------
 * Incoming data from frontend when creating/updating a medication reminder.
 */
public class MedicationReminderRequest {

    private String medicationName;
    private String dosage;
    private String pillShape;
    private String pillColor;
    private String pillSize;
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

    @NotNull(message = "Frequency per day is required")
    private Integer frequencyPerDay;

    @NotEmpty(message = "At least one reminder time is required")
    private List<LocalTime> reminderTimes;
}