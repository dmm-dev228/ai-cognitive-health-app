package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "memory_profiles")
public class MemoryProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-one realtionship with User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "favorite_people", columnDefinition = "TEXT")
    private String favoritePeople;

    @Column(name = "favorite_places", columnDefinition = "TEXT")
    private String favoritePlaces;

    @Column(name = "calming_memories", columnDefinition = "TEXT")
    private String calmingMemories;

    @Column(name = "favorite_music", columnDefinition = "TEXT")
    private String favoriteMusic;

    @Column(name = "comforting_activities", columnDefinition = "TEXT")
    private String comfortingActivities;

    @Column(name = "triggers_to_avoid", columnDefinition = "TEXT")
    private String triggersToAvoid;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public MemoryProfile() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}