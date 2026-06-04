package com.aihealth.backend.service;

import com.aihealth.backend.dto.CommunityCommentResponse;
import com.aihealth.backend.model.CommunityComment;
import com.aihealth.backend.model.CommunityCommentStatus;
import com.aihealth.backend.model.CommunityModerationResult;
import com.aihealth.backend.model.CommunityPost;
import com.aihealth.backend.model.User;
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
 * - AI moderation improvements
 * - spam filtering
 * - encouragement suggestions
 */
@Service
public class CommunityCommentService {

    private final CommunityCommentRepository commentRepository;
    private final CommunityPostRepository postRepository;
    private final UserRepository userRepository;
    private final CommunityModerationService moderationService;

    public CommunityCommentService(
            CommunityCommentRepository commentRepository,
            CommunityPostRepository postRepository,
            UserRepository userRepository,
            CommunityModerationService moderationService
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.moderationService = moderationService;
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

        String trimmedContent = content.trim();

        CommunityModerationResult moderationResult =
                moderationService.moderateContent(trimmedContent);

        handleModerationResult(moderationResult);

        CommunityComment comment =
                new CommunityComment(user, post, trimmedContent);

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

    // Converts AI moderation outcomes into user-safe error messages.
    private void handleModerationResult(
            CommunityModerationResult moderationResult
    ) {
        if (moderationResult == CommunityModerationResult.APPROVED) {
            return;
        }

        if (moderationResult == CommunityModerationResult.NEEDS_REVISION) {
            throw new RuntimeException(
                    "This community is designed for supportive conversation. Please revise your comment before posting."
            );
        }

        if (moderationResult == CommunityModerationResult.CRISIS) {
            throw new RuntimeException(
                    "This sounds like a difficult moment. Please reach out to someone you trust or emergency support if you may be in immediate danger."
            );
        }

        throw new RuntimeException(
                "This comment cannot be posted because it does not match the safety expectations of this community."
        );
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