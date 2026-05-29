package com.aihealth.backend.model;

// Result of checking community content before publishing.
public enum CommunityModerationResult {
    APPROVED,
    NEEDS_REVISION,
    CRISIS,
    BLOCKED
}