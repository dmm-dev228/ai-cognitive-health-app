package com.aihealth.backend.service;

import com.aihealth.backend.dto.CommunityCommentResponse;
import com.aihealth.backend.model.*;
import com.aihealth.backend.repository.CommunityCommentRepository;
import com.aihealth.backend.repository.CommunityPostRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * CommunityCommentService
 * -----------------------
 * Handles community comment creation and retrieval.
 *
 * Future responsibilities:
 * - AI moderation
 * - toxicity detection
 * - spam filtering
 * - encouragement suggestions
 */
@Service
public class CommunityCommentService {

    private final CommunityCommentRepository commentRepository;
    private final CommunityPostRepository postRepository;
    private final UserRepository userRepository;

    public CommunityCommentService(
            CommunityCommentRepository commentRepository,
            CommunityPostRepository postRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // Creates a new comment on a community post.
    public CommunityCommentResponse createComment(
            Long postId,
            String content
    ) {
        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found"));

        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        CommunityComment comment =
                new CommunityComment(user, post, content.trim());

        CommunityComment savedComment =
                commentRepository.save(comment);

        return mapToResponse(savedComment);
    }

    // Gets visible comments for a community post.
    public List<CommunityCommentResponse> getComments(Long postId) {

        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found"));

        return commentRepository
                .findByPostAndStatusOrderByCreatedAtAsc(
                        post,
                        CommunityCommentStatus.VISIBLE
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Maps entity -> DTO.
    private CommunityCommentResponse mapToResponse(
            CommunityComment comment
    ) {
        return new CommunityCommentResponse(
                comment.getId(),
                comment.getUser().getUsername(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}