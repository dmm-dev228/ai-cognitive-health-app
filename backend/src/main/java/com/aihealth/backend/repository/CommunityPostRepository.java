package com.aihealth.backend.repository;

import com.aihealth.backend.model.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    // Fetch community posts newest first for the community feed.
    List<CommunityPost> findAllByOrderByCreatedAtDesc();
}