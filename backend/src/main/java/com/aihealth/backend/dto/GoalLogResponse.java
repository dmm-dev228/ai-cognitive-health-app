package com.aihealth.backend.dto;

import java.time.LocalDateTime;

/*
 * GoalLogResponse
 * ---------------
 * Safe response returned after progress is logged.
 */
public class GoalLogResponse {

    private Long id;
    private Long goalId;
    private Long userId;
    private Integer progressAmount;
    private String note;
    private LocalDateTime loggedAt;

    public GoalLogResponse(
            Long id,
            Long goalId,
            Long userId,
            Integer progressAmount,
            String note,
            LocalDateTime loggedAt) {

        this.id = id;
        this.goalId = goalId;
        this.userId = userId;
        this.progressAmount = progressAmount;
        this.note = note;
        this.loggedAt = loggedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getGoalId() {
        return goalId;
    }

    public Long getUserId() {
        return userId;
    }

    public Integer getProgressAmount() {
        return progressAmount;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }
}