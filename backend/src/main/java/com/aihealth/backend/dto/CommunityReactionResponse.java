package com.aihealth.backend.dto;

import com.aihealth.backend.model.CommunityReactionType;

/*
 * CommunityReactionResponse
 * -------------------------
 * DTO returned to the frontend for reaction summaries.
 *
 * Includes whether the currently logged-in user selected this reaction.
 */
public class CommunityReactionResponse {

    private CommunityReactionType reactionType;
    private long count;
    private boolean selectedByCurrentUser;

    public CommunityReactionResponse() {
    }

    public CommunityReactionResponse(
            CommunityReactionType reactionType,
            long count,
            boolean selectedByCurrentUser
    ) {
        this.reactionType = reactionType;
        this.count = count;
        this.selectedByCurrentUser = selectedByCurrentUser;
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

    public boolean isSelectedByCurrentUser() {
        return selectedByCurrentUser;
    }

    public void setSelectedByCurrentUser(boolean selectedByCurrentUser) {
        this.selectedByCurrentUser = selectedByCurrentUser;
    }
}