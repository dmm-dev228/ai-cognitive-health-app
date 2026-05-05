package com.aihealth.backend.dto;

import java.time.LocalDateTime;

public class DietaryProfileResponse {

    private Long id;
    private Long userId;
    private String favoriteFoods;
    private String foodsToAvoid;
    private String allergies;
    private String dietaryNotes;
    private String hydrationReminderPreference;
    private LocalDateTime createdAt;

    public DietaryProfileResponse(
            Long id,
            Long userId,
            String favoriteFoods,
            String foodsToAvoid,
            String allergies,
            String dietaryNotes,
            String hydrationReminderPreference,
            LocalDateTime createdAt) {

        this.id = id;
        this.userId = userId;
        this.favoriteFoods = favoriteFoods;
        this.foodsToAvoid = foodsToAvoid;
        this.allergies = allergies;
        this.dietaryNotes = dietaryNotes;
        this.hydrationReminderPreference = hydrationReminderPreference;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFavoriteFoods() {
        return favoriteFoods;
    }

    public String getFoodsToAvoid() {
        return foodsToAvoid;
    }

    public String getAllergies() {
        return allergies;
    }

    public String getDietaryNotes() {
        return dietaryNotes;
    }

    public String getHydrationReminderPreference() {
        return hydrationReminderPreference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}