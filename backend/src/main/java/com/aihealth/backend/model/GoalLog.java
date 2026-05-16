package com.aihealth.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/*
 * GoalLog
 * -------
 * Represents one progress update toward a goal.
 *
 * Example:
 * Goal: Journal 5 times this week
 * Log: +1 progress, note = "Journaled after work today."
 */
@Entity
@Table(name = "goal_logs")
public class GoalLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Many logs belong to one goal.
     */
    @ManyToOne
    @JoinColumn(name = "goal_id", nullable = false)
    private Goal goal;

    /*
     * Stored directly for easier user-specific queries
     * and ownership validation.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /*
     * Amount of progress added in this log.
     *
     * Example:
     * +1 journal entry
     * +2 glasses of water
     */
    @Column(name = "progress_amount", nullable = false)
    private Integer progressAmount;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt;

    public GoalLog() {}

    public Long getId() {
        return id;
    }

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }
}
