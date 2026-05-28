package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class DailyPrompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Daily prompts belong to one authenticated user.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /*
     * The AI-generated journal prompt shown for this specific day.
     */
    @Column(nullable = false, length = 1000)
    private String prompt;

    /*
     * The calendar date this prompt belongs to.
     * One user should only receive one prompt per day.
     */
    @Column(nullable = false)
    private LocalDate promptDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public DailyPrompt() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getPrompt() {
        return prompt;
    }

    public LocalDate getPromptDate() {
        return promptDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public void setPromptDate(LocalDate promptDate) {
        this.promptDate = promptDate;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}