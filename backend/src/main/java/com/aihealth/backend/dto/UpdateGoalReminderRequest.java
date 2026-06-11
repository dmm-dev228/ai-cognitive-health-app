package com.aihealth.backend.dto;

/*
 * UpdateGoalReminderRequest
 * -------------------------
 * Request body for enabling or disabling goal reminders.
 */
public class UpdateGoalReminderRequest {

    private Boolean goalReminderEnabled;

    public Boolean getGoalReminderEnabled() {
        return goalReminderEnabled;
    }

    public void setGoalReminderEnabled(Boolean goalReminderEnabled) {
        this.goalReminderEnabled = goalReminderEnabled;
    }
}