package com.aihealth.backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/*
 * Goal
 * ----
 * Represents a personal wellness or routine goal.
 *
 * Examples:
 * - Journal 5 times this week
 * - Practice mindfulness daily
 * - Complete memory games 3 times weekly
 *
 * This is NOT medical treatment.
 * It is supportive wellness and habit tracking.
 */
@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Many goals belong to one user.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /*
     * Example:
     * JOURNALING
     * WELLNESS
     * FITNESS
     * MINDFULNESS
     */
    @Column(nullable = false, length = 50)
    private String category;

    /*
     * Goal completion target.
     *
     * Example:
     * 5 journal entries
     */
    @Column(name = "target_count", nullable = false)
    private Integer targetCount;

    /*
     * Current completed amount.
     */
    @Column(name = "current_progress", nullable = false)
    private Integer currentProgress = 0;

    /*
     * Example:
     * entries
     * walks
     * sessions
     */
    @Column(name = "unit_label", length = 50)
    private String unitLabel;

    /*
     * Goal deadline.
     */
    @Column(name = "target_date")
    private LocalDate targetDate;

    /*
     * AI-generated supportive goal plan.
     */
    @Column(name = "ai_plan", columnDefinition = "TEXT")
    private String aiPlan;

    /*
     * ACTIVE
     * COMPLETED
     * PAUSED
     */
    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @Column(name = "last_reminded_at")
private LocalDateTime lastRemindedAt;

    /*
     * Reminder channel settings.
     */
    private Boolean inAppReminderEnabled = true;
    private Boolean emailReminderEnabled = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Goal() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public Integer getCurrentProgress() {
        return currentProgress;
    }

    public void setCurrentProgress(Integer currentProgress) {
        this.currentProgress = currentProgress;
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

    public String getAiPlan() {
        return aiPlan;
    }

    public void setAiPlan(String aiPlan) {
        this.aiPlan = aiPlan;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
    public LocalDateTime getLastRemindedAt() {
    return lastRemindedAt;
}

public void setLastRemindedAt(LocalDateTime lastRemindedAt) {
    this.lastRemindedAt = lastRemindedAt;
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