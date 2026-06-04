package com.aihealth.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/*
 * GoalResponse
 * ------------
 * Safe response returned to the frontend.
 */
public class GoalResponse {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String category;
    private Integer targetCount;
    private Integer currentProgress;
    private String unitLabel;
    private LocalDate targetDate;
    private String aiPlan;
    private String status;
    private Boolean inAppReminderEnabled;
    private Boolean emailReminderEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GoalResponse(
            Long id,
            Long userId,
            String title,
            String description,
            String category,
            Integer targetCount,
            Integer currentProgress,
            String unitLabel,
            LocalDate targetDate,
            String aiPlan,
            String status,
            Boolean inAppReminderEnabled,
            Boolean emailReminderEnabled,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.targetCount = targetCount;
        this.currentProgress = currentProgress;
        this.unitLabel = unitLabel;
        this.targetDate = targetDate;
        this.aiPlan = aiPlan;
        this.status = status;
        this.inAppReminderEnabled = inAppReminderEnabled;
        this.emailReminderEnabled = emailReminderEnabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public Integer getTargetCount() {
        return targetCount;
    }

    public Integer getCurrentProgress() {
        return currentProgress;
    }

    public String getUnitLabel() {
        return unitLabel;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public String getAiPlan() {
        return aiPlan;
    }

    public String getStatus() {
        return status;
    }

    public Boolean getInAppReminderEnabled() {
        return inAppReminderEnabled;
    }

    public Boolean getEmailReminderEnabled() {
        return emailReminderEnabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}