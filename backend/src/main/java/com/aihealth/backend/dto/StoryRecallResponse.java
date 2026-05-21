package com.aihealth.backend.dto;

import java.util.List;

/*
 * Response DTO returned to the frontend.
 * Contains:
 * - randomly generated target words
 * - AI-generated story
 */
public class StoryRecallResponse {

    private List<String> targetWords;
    private String story;

    public StoryRecallResponse() {
    }

    public StoryRecallResponse(List<String> targetWords, String story) {
        this.targetWords = targetWords;
        this.story = story;
    }

    public List<String> getTargetWords() {
        return targetWords;
    }

    public void setTargetWords(List<String> targetWords) {
        this.targetWords = targetWords;
    }

    public String getStory() {
        return story;
    }

    public void setStory(String story) {
        this.story = story;
    }
}