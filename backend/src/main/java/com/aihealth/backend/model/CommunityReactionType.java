package com.aihealth.backend.model;
/*
 * CommunityReactionType
 * ---------------------
 * Defines the only allowed supportive reactions in the community.
 *
 * No dislikes, angry reactions, or negative reactions are allowed because
 * CogniHaven is designed around emotional safety and encouragement.
 */
public enum CommunityReactionType {
    SUPPORT,
    GROWTH,
    ENCOURAGING,
    RELATABLE,
    PROUD_OF_YOU,
    THOUGHTFUL
}