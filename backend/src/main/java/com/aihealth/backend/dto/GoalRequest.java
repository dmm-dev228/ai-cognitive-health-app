package com.aihealth.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/*
 * GoalRequest
 * -----------
 * Incoming data from the frontend when creating a goal.
 */
public class GoalRequest {

    @NotBlank(message = "Goal title is required")
    @Size(max = 150, message = "Goal title cannot exceed 150 characters")
    private String title;

    @Size(max = 2000, message = "Goal description cannot exceed 2000 characters")
    private String description;

    @NotBlank(message = "Goal category is required")
    @Size(max = 50, message = "Goal category cannot exceed 50 characters")
    private String category;

    @NotNull(message = "Target count is required")
    @Min(value = 1, message = "Target count must be at least 1")
    private Integer targetCount;

    @Size(max = 50, message = "Unit label cannot exceed 50 characters")
    private String unitLabel;

    @FutureOrPresent(message = "Target date cannot be in the past")
    private LocalDate targetDate;

    private Boolean inAppReminderEnabled;
    private Boolean emailReminderEnabled;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(Integer targetCount) {
        this.targetCount = targetCount;
    }

    public String getUnitLabel() {
        return unitLabel;
    }

    public void setUnitLabel(String unitLabel) {
        this.unitLabel = unitLabel;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
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
}