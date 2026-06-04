package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
 * CommunityComment
 * ----------------
 * Represents a supportive comment on a community post.
 *
 * Comments are designed for encouragement, shared experience,
 * and calm conversation — not debate or arguments.
 */
@Entity
@Table(name = "community_comments")
public class CommunityComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * The user who wrote the comment.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /*
     * The community post this comment belongs to.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @Column(nullable = false, length = 1000)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunityCommentStatus status = CommunityCommentStatus.VISIBLE;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public CommunityComment() {
    }

    public CommunityComment(User user, CommunityPost post, String content) {
        this.user = user;
        this.post = post;
        this.content = content;
        this.status = CommunityCommentStatus.VISIBLE;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null) {
            status = CommunityCommentStatus.VISIBLE;
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

    public String getContent() {
        return content;
    }

    public CommunityCommentStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setStatus(CommunityCommentStatus status) {
        this.status = status;
    }
}