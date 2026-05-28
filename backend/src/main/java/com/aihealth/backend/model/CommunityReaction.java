package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
 * CommunityReaction
 * -----------------
 * Represents one supportive reaction from one user on one community post.
 *
 * Important design rule:
 * A user should only have one active reaction per post.
 * That rule will be enforced in the service/repository layer.
 */
@Entity
@Table(
        name = "community_reactions",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "post_id"})
        }
)
public class CommunityReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * The user who reacted.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /*
     * The community post being reacted to.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    /*
     * Supportive reaction type only.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunityReactionType reactionType;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public CommunityReaction() {
    }

    public CommunityReaction(User user, CommunityPost post, CommunityReactionType reactionType) {
        this.user = user;
        this.post = post;
        this.reactionType = reactionType;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public CommunityPost getPost() {
        return post;
    }

    public CommunityReactionType getReactionType() {
        return reactionType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setReactionType(CommunityReactionType reactionType) {
        this.reactionType = reactionType;
    }
}