package com.aihealth.backend.dto;

import java.time.LocalDateTime;

/*
 * AchievementResponse
 * -------------------
 * Safe response returned to the frontend.
 *
 * Does not expose the full User entity.
 */
public class AchievementResponse {

    private Long id;
    private Long userId;
    private String achievementKey;
    private String title;
    private String description;
    private String badgeLabel;
    private LocalDateTime unlockedAt;

    public AchievementResponse(
            Long id,
            Long userId,
            String achievementKey,
            String title,
            String description,
            String badgeLabel,
            LocalDateTime unlockedAt) {

        this.id = id;
        this.userId = userId;
        this.achievementKey = achievementKey;
        this.title = title;
        this.description = description;
        this.badgeLabel = badgeLabel;
        this.unlockedAt = unlockedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getAchievementKey() {
        return achievementKey;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getBadgeLabel() {
        return badgeLabel;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }
}