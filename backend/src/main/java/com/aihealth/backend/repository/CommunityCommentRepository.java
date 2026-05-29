package com.aihealth.backend.repository;

import com.aihealth.backend.model.CommunityComment;
import com.aihealth.backend.model.CommunityCommentStatus;
import com.aihealth.backend.model.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
 * CommunityCommentRepository
 * --------------------------
 * Database access for community comments.
 */
public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {

    /*
     * Gets visible comments for a post, oldest first.
     */
    List<CommunityComment> findByPostAndStatusOrderByCreatedAtAsc(
            CommunityPost post,
            CommunityCommentStatus status
    );

    /*
     * Counts visible comments for a post.
     */
    long countByPostAndStatus(
            CommunityPost post,
            CommunityCommentStatus status
    );
}