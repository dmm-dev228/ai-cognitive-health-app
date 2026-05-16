package com.aihealth.backend.dto;

import java.time.LocalDateTime;

/*
 * CommunityPostResponse
 * ---------------------
 * Safe response returned to the frontend.
 * Does not expose the full User entity.
 */
public class CommunityPostResponse {

    private Long id;
    private Long userId;
    private String username;
    private String title;
    private String content;
    private String category;
    private LocalDateTime createdAt;

    public CommunityPostResponse(
            Long id,
            Long userId,
            String username,
            String title,
            String content,
            String category,
            LocalDateTime createdAt) {

        this.id = id;
        this.userId = userId;
        this.username = username;
        this.title = title;
        this.content = content;
        this.category = category;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getCategory() {
        return category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}