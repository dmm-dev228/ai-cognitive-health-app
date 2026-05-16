package com.aihealth.backend.repository;

import com.aihealth.backend.model.GoalLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalLogRepository extends JpaRepository<GoalLog, Long> {

    // Fetch progress logs for a specific goal, newest first.
    List<GoalLog> findByGoalIdOrderByLoggedAtDesc(Long goalId);

    // Fetch all logs for a user if we need future analytics.
    List<GoalLog> findByUserIdOrderByLoggedAtDesc(Long userId);
}