package com.aihealth.backend.repository;

import com.aihealth.backend.dto.CommunityTrendResponse;
import com.aihealth.backend.model.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    // Fetch community posts newest first for the community feed.
    List<CommunityPost> findAllByOrderByCreatedAtDesc();

    // Returns community post categories ordered by activity.
    @Query("""
            SELECT new com.aihealth.backend.dto.CommunityTrendResponse(
                CAST(p.category AS string),
                COUNT(p)
            )
            FROM CommunityPost p
            GROUP BY p.category
            ORDER BY COUNT(p) DESC
            """)
    List<CommunityTrendResponse> findCommunityTrends();
}