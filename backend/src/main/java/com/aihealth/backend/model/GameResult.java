package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
 * GameResult
 * ----------
 * Stores a user's cognitive game performance.
 * Used later for analytics dashboards and AI performance context.
 */
@Entity
@Table(name = "game_results")
public class GameResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many game results belong to one authenticated user.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Example: PATTERN_RECALL, STORY_RECALL, CARD_MATCH, WORD_BLOOM
    @Column(name = "game_type", nullable = false, length = 50)
    private String gameType;

    // Overall score calculated by frontend/game logic.
    @Column(nullable = false)
    private Integer score;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers;

    @Column(name = "time_taken_seconds", nullable = false)
    private Integer timeTakenSeconds;

    // Example: EASY, MEDIUM, HARD
    @Column(length = 50)
    private String difficulty;

    @Column(name = "played_at")
    private LocalDateTime playedAt;

    public GameResult() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public LocalDateTime getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(LocalDateTime playedAt) {
        this.playedAt = playedAt;
    }
}