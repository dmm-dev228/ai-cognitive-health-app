package com.aihealth.backend.model;

/*
 * CommunityCommentStatus
 * ----------------------
 * Tracks whether a comment is visible or moderated.
 *
 * This gives us a foundation for future AI moderation.
 */
public enum CommunityCommentStatus {
    VISIBLE,
    HIDDEN,
    FLAGGED
}