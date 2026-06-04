package com.aihealth.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/*
 * JournalEntryRequest
 * -------------------
 * Incoming journal entry data from the frontend.
 *
 * Validation is important because journal content is later
 * processed by the AI reflection system.
 *
 * This protects against:
 * - empty submissions
 * - extremely large payloads
 * - malformed requests
 * - AI spam/abuse
 */
public class JournalEntryRequest {
    /*
     * Journal title.
     *
     * Required so entries are easier to organize
     * and display clearly in the journal shelf.
     */
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    /*
     * Main journal reflection content.
     *
     * Required because empty AI reflections
     * would create meaningless conversations.
     */
    @NotBlank(message = "Journal content is required")
    @Size(max = 5000, message = "Journal content cannot exceed 5000 characters")
    private String content;

    /*
     * Optional mood selected by the user.
     *
     * Example:
     * Calm
     * Reflective
     * Stressed
     * Hopeful
     */
    @Size(max = 30, message = "Mood cannot exceed 30 characters")
    private String mood;

    /*
     * Determines whether the journal entry
     * can appear on the future community page.
     */
    private Boolean isPublic;

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

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
}