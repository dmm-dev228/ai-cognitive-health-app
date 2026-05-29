package com.aihealth.backend.controller;

import com.aihealth.backend.dto.CommunityCommentRequest;
import com.aihealth.backend.dto.CommunityCommentResponse;
import com.aihealth.backend.service.CommunityCommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * CommunityCommentController
 * --------------------------
 * REST endpoints for supportive community comments.
 */
@RestController
@RequestMapping("/api/community/{postId}/comments")
public class CommunityCommentController {

    private final CommunityCommentService commentService;

    public CommunityCommentController(CommunityCommentService commentService) {
        this.commentService = commentService;
    }

    // Creates a new comment on a community post.
    @PostMapping
    public CommunityCommentResponse createComment(
            @PathVariable Long postId,
            @RequestBody CommunityCommentRequest request
    ) {
        return commentService.createComment(
                postId,
                request.getContent()
        );
    }

    // Gets all visible comments for a community post.
    @GetMapping
    public List<CommunityCommentResponse> getComments(
            @PathVariable Long postId
    ) {
        return commentService.getComments(postId);
    }
}