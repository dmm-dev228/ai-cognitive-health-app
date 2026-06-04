package com.aihealth.backend.dto;

/*
 * Request DTO for generating a Story Recall game.
 * Frontend sends the selected difficulty.
 */
public class StoryRecallRequest {

    private String difficulty;

    public StoryRecallRequest() {
    }

    public StoryRecallRequest(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}