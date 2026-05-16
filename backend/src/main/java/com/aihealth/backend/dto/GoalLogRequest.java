package com.aihealth.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/*
 * GoalLogRequest
 * --------------
 * Incoming data when a user logs progress toward a goal.
 */
public class GoalLogRequest {

    /*
     * Amount of progress to add.
     *
     * Example:
     * +1 journal entry
     * +1 walk
     * +2 glasses of water
     */
    @NotNull(message = "Progress amount is required")
    @Min(value = 1, message = "Progress amount must be at least 1")
    private Integer progressAmount;

    @Size(max = 1000, message = "Progress note cannot exceed 1000 characters")
    private String note;

    public Integer getProgressAmount() {
        return progressAmount;
    }

    public void setProgressAmount(Integer progressAmount) {
        this.progressAmount = progressAmount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}