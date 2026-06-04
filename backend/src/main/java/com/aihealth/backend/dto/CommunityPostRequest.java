package com.aihealth.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/*
 * CommunityPostRequest
 * --------------------
 * Incoming data from the frontend when a user creates a community post.
 *
 * This community space is for wellness support, reflection,
 * encouragement, and routine sharing — not medical advice.
 */
public class CommunityPostRequest {

    /*
     * Required title for the post.
     */
    @NotBlank(message = "Post title is required")
    @Size(max = 150, message = "Post title cannot exceed 150 characters")
    private String title;

    /*
     * Required post content.
     */
    @NotBlank(message = "Post content is required")
    @Size(max = 3000, message = "Post content cannot exceed 3000 characters")
    private String content;

    /*
     * Category helps organize posts in the community feed.
     *
     * Example:
     * REFLECTION
     * ROUTINE
     * ENCOURAGEMENT
     * WELLNESS_TIP
     */
    @NotBlank(message = "Post category is required")
    @Size(max = 50, message = "Category cannot exceed 50 characters")
    private String category;

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
}