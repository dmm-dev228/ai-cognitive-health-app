package com.aihealth.backend.dto;

import java.time.LocalDateTime;

public class MemoryProfileResponse {

    private Long id;
    private Long userId;
    private String favoritePeople;
    private String favoritePlaces;
    private String calmingMemories;
    private String favoriteMusic;
    private String comfortingActivities;
    private String triggersToAvoid;
    private LocalDateTime createdAt;

    public MemoryProfileResponse(Long id,
                                 Long userId,
                                 String favoritePeople,
                                 String favoritePlaces,
                                 String calmingMemories,
                                 String favoriteMusic,
                                 String comfortingActivities,
                                 String triggersToAvoid,
                                 LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.favoritePeople = favoritePeople;
        this.favoritePlaces = favoritePlaces;
        this.calmingMemories = calmingMemories;
        this.favoriteMusic = favoriteMusic;
        this.comfortingActivities = comfortingActivities;
        this.triggersToAvoid = triggersToAvoid;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFavoritePeople() {
        return favoritePeople;
    }

    public String getFavoritePlaces() {
        return favoritePlaces;
    }

    public String getCalmingMemories() {
        return calmingMemories;
    }

    public String getFavoriteMusic() {
        return favoriteMusic;
    }

    public String getComfortingActivities() {
        return comfortingActivities;
    }

    public String getTriggersToAvoid() {
        return triggersToAvoid;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}