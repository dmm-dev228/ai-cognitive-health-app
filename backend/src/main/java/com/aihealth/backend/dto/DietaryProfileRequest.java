package com.aihealth.backend.dto;

public class DietaryProfileRequest {

    private String favoriteFoods;
    private String foodsToAvoid;
    private String allergies;
    private String dietaryNotes;
    private String hydrationReminderPreference;

    public String getFavoriteFoods() {
        return favoriteFoods;
    }

    public void setFavoriteFoods(String favoriteFoods) {
        this.favoriteFoods = favoriteFoods;
    }

    public String getFoodsToAvoid() {
        return foodsToAvoid;
    }

    public void setFoodsToAvoid(String foodsToAvoid) {
        this.foodsToAvoid = foodsToAvoid;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getDietaryNotes() {
        return dietaryNotes;
    }

    public void setDietaryNotes(String dietaryNotes) {
        this.dietaryNotes = dietaryNotes;
    }

    public String getHydrationReminderPreference() {
        return hydrationReminderPreference;
    }

    public void setHydrationReminderPreference(String hydrationReminderPreference) {
        this.hydrationReminderPreference = hydrationReminderPreference;
    }
}