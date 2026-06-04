package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
 * Achievement
 * -----------
 * Represents a badge or milestone unlocked by a user.
 *
 * Examples:
 * - FIRST_GOAL_CREATED
 * - FIRST_GOAL_COMPLETED
 * - FIRST_GAME_PLAYED
 * - PERFECT_GAME_SCORE
 */
@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many achievements belong to one user.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "achievement_key", nullable = false, length = 100)
    private String achievementKey;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "badge_label", length = 100)
    private String badgeLabel;

    @Column(name = "unlocked_at")
    private LocalDateTime unlockedAt;

    public Achievement() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAchievementKey() {
        return achievementKey;
    }

    public void setAchievementKey(String achievementKey) {
        this.achievementKey = achievementKey;
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

    public String getBadgeLabel() {
        return badgeLabel;
    }

    public void setBadgeLabel(String badgeLabel) {
        this.badgeLabel = badgeLabel;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(LocalDateTime unlockedAt) {
        this.unlockedAt = unlockedAt;
    }
}