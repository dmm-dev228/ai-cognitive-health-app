package com.aihealth.backend.service;

import com.aihealth.backend.dto.CommunityPostRequest;
import com.aihealth.backend.dto.CommunityPostResponse;
import com.aihealth.backend.model.CommunityModerationResult;
import com.aihealth.backend.model.CommunityPost;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.CommunityPostRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/*
 * CommunityPostService
 * --------------------
 * Handles community feed business logic.
 *
 * Responsibilities:
 * - Create community posts
 * - Fetch community feed
 * - Moderate community posts before saving
 * - Map entities to safe DTO responses
 */
@Service
public class CommunityPostService {

    private final CommunityPostRepository communityPostRepository;
    private final UserRepository userRepository;
    private final CommunityModerationService moderationService;

    public CommunityPostService(
            CommunityPostRepository communityPostRepository,
            UserRepository userRepository,
            CommunityModerationService moderationService
    ) {
        this.communityPostRepository = communityPostRepository;
        this.userRepository = userRepository;
        this.moderationService = moderationService;
    }

    // Creates a new community post for the authenticated user.
    public CommunityPostResponse createPost(
            CommunityPostRequest request
    ) {
        User user = getCurrentAuthenticatedUser();

        validatePostRequest(request);

        String trimmedTitle = request.getTitle().trim();
        String trimmedContent = request.getContent().trim();

        String combinedContentForModeration =
                trimmedTitle + "\n\n" + trimmedContent;

        CommunityModerationResult moderationResult =
                moderationService.moderateContent(combinedContentForModeration);

        handleModerationResult(moderationResult);

        CommunityPost post = new CommunityPost();

        post.setUser(user);
        post.setTitle(trimmedTitle);
        post.setContent(trimmedContent);
        post.setCategory(request.getCategory());
        post.setCreatedAt(LocalDateTime.now());

        CommunityPost saved =
                communityPostRepository.save(post);

        return mapToResponse(saved);
    }

    // Returns all community posts newest first.
    public List<CommunityPostResponse> getAllPosts() {
        return communityPostRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Validates the post request before moderation and saving.
    private void validatePostRequest(
            CommunityPostRequest request
    ) {
        if (request == null) {
            throw new RuntimeException("Post request cannot be empty");
        }

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Post title is required");
        }

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Post content is required");
        }

        if (request.getCategory() == null) {
            throw new RuntimeException("Post category is required");
        }

        if (request.getTitle().trim().length() > 150) {
            throw new RuntimeException("Post title is too long");
        }

        if (request.getContent().trim().length() > 2000) {
            throw new RuntimeException("Post content is too long");
        }
    }

    // Converts AI moderation outcomes into user-safe post error messages.
    private void handleModerationResult(
            CommunityModerationResult moderationResult
    ) {
        if (moderationResult == CommunityModerationResult.APPROVED) {
            return;
        }

        if (moderationResult == CommunityModerationResult.NEEDS_REVISION) {
            throw new RuntimeException(
                    "This community is designed for supportive conversation. Please revise your post before sharing."
            );
        }

        if (moderationResult == CommunityModerationResult.CRISIS) {
            throw new RuntimeException(
                    "This sounds like a difficult moment. Please reach out to someone you trust or emergency support if you may be in immediate danger."
            );
        }

        throw new RuntimeException(
                "This post cannot be shared because it does not match the safety expectations of this community."
        );
    }

    // Converts entity -> safe frontend response DTO.
    private CommunityPostResponse mapToResponse(
            CommunityPost post
    ) {
        return new CommunityPostResponse(
                post.getId(),
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getTitle(),
                post.getContent(),
                post.getCategory(),
                post.getCreatedAt()
        );
    }

    // Loads currently authenticated user from JWT context.
    private User getCurrentAuthenticatedUser() {
        String email =
                SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));
    }
}