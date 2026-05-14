package com.aihealth.backend.dto;

import java.time.LocalDateTime;

/*
 * GameResultResponse
 * ------------------
 * Safe response returned to frontend.
 * Does not expose the full User entity.
 */
public class GameResultResponse {

    private Long id;
    private Long userId;
    private String gameType;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer timeTakenSeconds;
    private String difficulty;
    private LocalDateTime playedAt;

    public GameResultResponse(
            Long id,
            Long userId,
            String gameType,
            Integer score,
            Integer totalQuestions,
            Integer correctAnswers,
            Integer timeTakenSeconds,
            String difficulty,
            LocalDateTime playedAt) {

        this.id = id;
        this.userId = userId;
        this.gameType = gameType;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.timeTakenSeconds = timeTakenSeconds;
        this.difficulty = difficulty;
        this.playedAt = playedAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getGameType() { return gameType; }
    public Integer getScore() { return score; }
    public Integer getTotalQuestions() { return totalQuestions; }
    public Integer getCorrectAnswers() { return correctAnswers; }
    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public String getDifficulty() { return difficulty; }
    public LocalDateTime getPlayedAt() { return playedAt; }
}