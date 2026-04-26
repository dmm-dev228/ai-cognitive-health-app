package com.aihealth.backend.dto;

import jakarta.validation.constraints.Size;

public class MemoryProfileRequest {

    @Size(max = 1000)
    private String favoritePeople;

    @Size(max = 1000)
    private String favoritePlaces;

    @Size(max = 2000)
    private String calmingMemories;

    @Size(max = 500)
    private String favoriteMusic;

    @Size(max = 1000)
    private String comfortingActivities;

    @Size(max = 1000)
    private String triggersToAvoid;

    public String getFavoritePeople() {
        return favoritePeople;
    }

    public void setFavoritePeople(String favoritePeople) {
        this.favoritePeople = favoritePeople;
    }

    public String getFavoritePlaces() {
        return favoritePlaces;
    }

    public void setFavoritePlaces(String favoritePlaces) {
        this.favoritePlaces = favoritePlaces;
    }

    public String getCalmingMemories() {
        return calmingMemories;
    }

    public void setCalmingMemories(String calmingMemories) {
        this.calmingMemories = calmingMemories;
    }

    public String getFavoriteMusic() {
        return favoriteMusic;
    }

    public void setFavoriteMusic(String favoriteMusic) {
        this.favoriteMusic = favoriteMusic;
    }

    public String getComfortingActivities() {
        return comfortingActivities;
    }

    public void setComfortingActivities(String comfortingActivities) {
        this.comfortingActivities = comfortingActivities;
    }

    public String getTriggersToAvoid() {
        return triggersToAvoid;
    }

    public void setTriggersToAvoid(String triggersToAvoid) {
        this.triggersToAvoid = triggersToAvoid;
    }
}