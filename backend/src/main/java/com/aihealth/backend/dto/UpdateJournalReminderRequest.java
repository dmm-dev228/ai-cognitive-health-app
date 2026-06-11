package com.aihealth.backend.dto;

/*
 * UpdateJournalReminderRequest
 * ----------------------------
 * Request body for enabling or disabling journal reminders.
 */
public class UpdateJournalReminderRequest {

    private Boolean journalReminderEnabled;

    public Boolean getJournalReminderEnabled() {
        return journalReminderEnabled;
    }

    public void setJournalReminderEnabled(Boolean journalReminderEnabled) {
        this.journalReminderEnabled = journalReminderEnabled;
    }
}