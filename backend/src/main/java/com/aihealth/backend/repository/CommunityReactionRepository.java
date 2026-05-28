package com.aihealth.backend.repository;

import com.aihealth.backend.model.CommunityPost;
import com.aihealth.backend.model.CommunityReaction;
import com.aihealth.backend.model.CommunityReactionType;
import com.aihealth.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/*
 * CommunityReactionRepository
 * ---------------------------
 * Database access for supportive community reactions.
 */
public interface CommunityReactionRepository extends JpaRepository<CommunityReaction, Long> {

    /*
     * Finds whether the current user already reacted to this post.
     */
    Optional<CommunityReaction> findByUserAndPost(User user, CommunityPost post);

    /*
     * Gets all reactions for one post.
     */
    List<CommunityReaction> findByPost(CommunityPost post);

    /*
     * Counts a specific reaction type on a post.
     */
    long countByPostAndReactionType(CommunityPost post, CommunityReactionType reactionType);

    /*
     * Deletes a user's reaction from a post when they click the same reaction again.
     */
    void deleteByUserAndPost(User user, CommunityPost post);
}