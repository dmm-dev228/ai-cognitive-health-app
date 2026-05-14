package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversation_messages")
public class ConversationMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Each message belongs to a journal entry (thread)
    @ManyToOne
    @JoinColumn(name = "journal_entry_id", nullable = false)
    private JournalEntry journalEntry;

    // Who sent the message (USER or AI)
    @Column(nullable = false)
    private String senderType;

    // The actual message content
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    // Timestamp
    private LocalDateTime createdAt;

    // Set timestamp automatically before saving
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }

    public JournalEntry getJournalEntry() { return journalEntry; }
    public void setJournalEntry(JournalEntry journalEntry) {
        this.journalEntry = journalEntry;
    }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
}