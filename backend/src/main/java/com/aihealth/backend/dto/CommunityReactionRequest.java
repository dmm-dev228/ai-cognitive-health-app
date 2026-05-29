package com.aihealth.backend.dto;

import com.aihealth.backend.model.CommunityReactionType;

/*
 * CommunityReactionRequest
 * ------------------------
 * Request body sent by the frontend when a user clicks a reaction.
 *
 * Example:
 * {
 *   "reactionType": "SUPPORT"
 * }
 */
public class CommunityReactionRequest {

    private CommunityReactionType reactionType;

    public CommunityReactionRequest() {
    }

    public CommunityReactionType getReactionType() {
        return reactionType;
    }

    public void setReactionType(CommunityReactionType reactionType) {
        this.reactionType = reactionType;
    }
}