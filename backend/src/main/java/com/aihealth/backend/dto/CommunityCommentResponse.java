package com.aihealth.backend.dto;

import java.time.LocalDateTime;

/*
 * CommunityCommentResponse
 * ------------------------
 * Sent back to the frontend when displaying comments.
 */
public class CommunityCommentResponse {

    private Long id;
    private String username;
    private String content;
    private LocalDateTime createdAt;

    public CommunityCommentResponse() {
    }

    public CommunityCommentResponse(
            Long id,
            String username,
            String content,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.username = username;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}