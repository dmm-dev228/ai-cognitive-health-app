package com.aihealth.backend.service;

import com.aihealth.backend.dto.CommunityReactionResponse;
import com.aihealth.backend.model.CommunityPost;
import com.aihealth.backend.model.CommunityReaction;
import com.aihealth.backend.model.CommunityReactionType;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.CommunityPostRepository;
import com.aihealth.backend.repository.CommunityReactionRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/*
 * CommunityReactionService
 * ------------------------
 * Handles supportive reaction logic for community posts.
 *
 * Behavior:
 * - No reaction exists: create reaction
 * - Same reaction clicked again: remove reaction
 * - Different reaction clicked: update existing reaction
 */
@Service
public class CommunityReactionService {

    private final CommunityReactionRepository reactionRepository;
    private final CommunityPostRepository postRepository;
    private final UserRepository userRepository;

    public CommunityReactionService(
            CommunityReactionRepository reactionRepository,
            CommunityPostRepository postRepository,
            UserRepository userRepository) {
        this.reactionRepository = reactionRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<CommunityReactionResponse> toggleReaction(
            Long postId,
            CommunityReactionType reactionType) {
        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found"));

        reactionRepository.findByUserAndPost(user, post)
                .ifPresentOrElse(existingReaction -> {
                    if (existingReaction.getReactionType() == reactionType) {
                        reactionRepository.delete(existingReaction);
                    } else {
                        existingReaction.setReactionType(reactionType);
                        reactionRepository.save(existingReaction);
                    }
                }, () -> {
                    CommunityReaction newReaction = new CommunityReaction(user, post, reactionType);

                    reactionRepository.save(newReaction);
                });

        return getReactionSummary(postId);
    }

    public List<CommunityReactionResponse> getReactionSummary(Long postId) {
        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found"));

        CommunityReactionType selectedType = reactionRepository
                .findByUserAndPost(user, post)
                .map(CommunityReaction::getReactionType)
                .orElse(null);

        return Arrays.stream(CommunityReactionType.values())
                .map(type -> new CommunityReactionResponse(
                        type,
                        reactionRepository.countByPostAndReactionType(post, type),
                        type == selectedType))
                .toList();
    }
}