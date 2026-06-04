package com.aihealth.backend.dto;

/*
 * Request DTO for generating a Word Bloom game.
 * Frontend sends selected difficulty.
 */
public class WordBloomRequest {

    private String difficulty;

    public WordBloomRequest() {
    }

    public WordBloomRequest(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}