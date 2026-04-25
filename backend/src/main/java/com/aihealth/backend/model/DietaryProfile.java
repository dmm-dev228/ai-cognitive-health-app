package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dietary_profiles")
public class DietaryProfile {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-one relationship with User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Dietary preference fields
    @Column(name = "favorite_foods", columnDefinition = "TEXT")
    private String favoriteFoods;

    @Column(name = "foods_to_avoid", columnDefinition = "TEXT")
    private String foodsToAvoid;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "dietary_notes", columnDefinition = "TEXT")
    private String dietaryNotes;

    @Column(name = "hydration_reminder_preference", length = 100)
    private String hydrationReminderPreference;

    // Timestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public DietaryProfile() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}