package com.aihealth.backend.service;

import com.aihealth.backend.dto.CommunityPostRequest;
import com.aihealth.backend.dto.CommunityPostResponse;
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
 * - Map entities to safe DTO responses
 */
@Service
public class CommunityPostService {

    private final CommunityPostRepository communityPostRepository;
    private final UserRepository userRepository;

    public CommunityPostService(
            CommunityPostRepository communityPostRepository,
            UserRepository userRepository) {

        this.communityPostRepository = communityPostRepository;
        this.userRepository = userRepository;
    }

    // Creates a new community post for the authenticated user.
    public CommunityPostResponse createPost(
            CommunityPostRequest request) {

        User user = getCurrentAuthenticatedUser();

        CommunityPost post = new CommunityPost();

        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
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

    // Converts entity -> safe frontend response DTO.
    private CommunityPostResponse mapToResponse(
            CommunityPost post) {

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

    //Loads currently authenticated user from JWT context.
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