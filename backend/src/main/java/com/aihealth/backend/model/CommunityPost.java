package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
 * CommunityPost
 * -------------
 * Represents a supportive community post.
 *
 * Public positioning:
 * This is NOT a medical forum.
 * It is a wellness space for reflections, routines,
 * encouragement, and supportive experiences.
 */
@Entity
@Table(name = "community_posts")
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many community posts belong to one authenticated user.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /*
     * Example categories:
     * REFLECTION
     * ROUTINE
     * ENCOURAGEMENT
     * WELLNESS_TIP
     */
    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public CommunityPost() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}