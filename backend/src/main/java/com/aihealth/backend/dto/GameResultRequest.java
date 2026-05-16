package com.aihealth.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/*
 * GameResultRequest
 * -----------------
 * Incoming data from frontend after a user completes a game.
 *
 * Validation rules help protect backend integrity by ensuring:
 * - required fields exist
 * - impossible values are rejected
 * - analytics data stays consistent
 *
 * Important:
 * Frontend validation improves UX,
 * but backend validation is the real security layer.
 */
public class GameResultRequest {

    /*
     * Type of cognitive game played.
     *
     * Example:
     * PATTERN_RECALL
     */
    @NotBlank(message = "Game type is required")
    private String gameType;

    /*
     * Final score percentage.
     *
     * Must stay between 0 and 100.
     */
    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score cannot be below 0")
    @Max(value = 100, message = "Score cannot exceed 100")
    private Integer score;

    /*
     * Total number of pattern positions/questions.
     *
     * Example:
     * Pattern 1234 = 4 total questions.
     */
    @NotNull(message = "Total questions is required")
    @Min(value = 1, message = "Total questions must be at least 1")
    private Integer totalQuestions;

    /*
     * Number of correctly remembered positions.
     */
    @NotNull(message = "Correct answers is required")
    @Min(value = 0, message = "Correct answers cannot be negative")
    private Integer correctAnswers;

    /*
     * Time required to complete the game.
     *
     * Stored in seconds.
     */
    @NotNull(message = "Time taken is required")
    @Min(value = 1, message = "Time taken must be at least 1 second")
    private Integer timeTakenSeconds;

    /*
     * Difficulty level selected by the user.
     *
     * Example:
     * EASY
     * MEDIUM
     * HARD
     */
    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}