package com.aihealth.backend.controller;

import com.aihealth.backend.dto.CommunityReactionRequest;
import com.aihealth.backend.dto.CommunityReactionResponse;
import com.aihealth.backend.service.CommunityReactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * CommunityReactionController
 * ---------------------------
 * REST endpoints for supportive community reactions.
 *
 * These endpoints support low-pressure, positive engagement only.
 */
@RestController
@RequestMapping("/api/community/{postId}/reactions")
public class CommunityReactionController {

    private final CommunityReactionService reactionService;

    public CommunityReactionController(CommunityReactionService reactionService) {
        this.reactionService = reactionService;
    }

    /*
     * Toggle the current user's reaction on a post.
     *
     * POST /api/community/{postId}/reactions
     */
    @PostMapping
    public List<CommunityReactionResponse> toggleReaction(
            @PathVariable Long postId,
            @RequestBody CommunityReactionRequest request
    ) {
        return reactionService.toggleReaction(
                postId,
                request.getReactionType()
        );
    }

    /*
     * Get reaction counts for a post.
     *
     * GET /api/community/{postId}/reactions
     */
    @GetMapping
    public List<CommunityReactionResponse> getReactionSummary(
            @PathVariable Long postId
    ) {
        return reactionService.getReactionSummary(postId);
    }
}