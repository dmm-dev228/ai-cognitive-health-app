package com.aihealth.backend.dto;

import com.aihealth.backend.model.CommunityReactionType;

/*
 * CommunityReactionResponse
 * -------------------------
 * Simple DTO returned to the frontend for reaction summaries.
 *
 * Example:
 * {
 *   "reactionType": "SUPPORT",
 *   "count": 12
 * }
 */
public class CommunityReactionResponse {

    private CommunityReactionType reactionType;
    private long count;

    public CommunityReactionResponse() {
    }

    public CommunityReactionResponse(
            CommunityReactionType reactionType,
            long count
    ) {
        this.reactionType = reactionType;
        this.count = count;
    }

    public CommunityReactionType getReactionType() {
        return reactionType;
    }

    public void setReactionType(CommunityReactionType reactionType) {
        this.reactionType = reactionType;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}