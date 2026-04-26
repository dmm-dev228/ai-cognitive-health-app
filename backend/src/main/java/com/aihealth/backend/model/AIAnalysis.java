package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
public class AIAnalysis {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many AI analyses → one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optional link to a journal entry
    @ManyToOne
    @JoinColumn(name = "journal_entry_id")
    private JournalEntry journalEntry;

    // Optional link to a game result
    @ManyToOne
    @JoinColumn(name = "game_result_id")
    private GameResult gameResult;

    // AI analysis fields
    @Column(name = "analysis_type", nullable = false, length = 50)
    private String analysisType;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 30)
    private String tone;

    @Column(name = "patterns_detected", columnDefinition = "TEXT")
    private String patternsDetected;

    @Column(name = "follow_up_prompt", columnDefinition = "TEXT")
    private String followUpPrompt;

    @Column(name = "supportive_response", columnDefinition = "TEXT")
    private String supportiveResponse;

    @Column(length = 30)
    private String mood;

    @Column(name = "key_themes", columnDefinition = "TEXT")
    private String keyThemes;

    // Timestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public AIAnalysis() {
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

    public JournalEntry getJournalEntry() {
        return journalEntry;
    }

    public void setJournalEntry(JournalEntry journalEntry) {
        this.journalEntry = journalEntry;
    }

    public GameResult getGameResult() {
        return gameResult;
    }

    public void setGameResult(GameResult gameResult) {
        this.gameResult = gameResult;
    }

    public String getAnalysisType() {
        return analysisType;
    }

    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getPatternsDetected() {
        return patternsDetected;
    }

    public void setPatternsDetected(String patternsDetected) {
        this.patternsDetected = patternsDetected;
    }

    public String getFollowUpPrompt() {
        return followUpPrompt;
    }

    public void setFollowUpPrompt(String followUpPrompt) {
        this.followUpPrompt = followUpPrompt;
    }

    public String getSupportiveResponse() {
        return supportiveResponse;
    }

    public void setSupportiveResponse(String supportiveResponse) {
        this.supportiveResponse = supportiveResponse;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public String getKeyThemes() {
        return keyThemes;
    }

    public void setKeyThemes(String keyThemes) {
        this.keyThemes = keyThemes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}