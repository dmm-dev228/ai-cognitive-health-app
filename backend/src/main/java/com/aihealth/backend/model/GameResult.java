package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_results")
public class GameResult {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many game results → one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Game details
    @Column(name = "game_type", nullable = false, length = 50)
    private String gameType;

    @Column(nullable = false)
    private Integer score;

    // 🔁 Updated field name (matches your DB)
    @Column(name = "completion_time_seconds", nullable = false)
    private Integer completionTimeSeconds;

    @Column
    private Double accuracy;

    // Timestamp
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

    public Integer getCompletionTimeSeconds() {
        return completionTimeSeconds;
    }

    public void setCompletionTimeSeconds(Integer completionTimeSeconds) {
        this.completionTimeSeconds = completionTimeSeconds;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public LocalDateTime getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(LocalDateTime playedAt) {
        this.playedAt = playedAt;
    }
}