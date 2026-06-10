package com.aihealth.backend.repository;

import com.aihealth.backend.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    // Fetch goals owned by the authenticated user, newest first.
    List<Goal> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Fetch goals owned by the authenticated user for account deletion cleanup.
    List<Goal> findByUserId(Long userId);
}