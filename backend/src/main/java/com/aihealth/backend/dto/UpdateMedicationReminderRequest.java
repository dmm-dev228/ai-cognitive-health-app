package com.aihealth.backend.dto;

/*
 * UpdateMedicationReminderRequest
 * -------------------------------
 * Request body for enabling or disabling medication reminders globally.
 */
public class UpdateMedicationReminderRequest {

    private Boolean medicationReminderEnabled;

    public Boolean getMedicationReminderEnabled() {
        return medicationReminderEnabled;
    }

    public void setMedicationReminderEnabled(Boolean medicationReminderEnabled) {
        this.medicationReminderEnabled = medicationReminderEnabled;
    }
}