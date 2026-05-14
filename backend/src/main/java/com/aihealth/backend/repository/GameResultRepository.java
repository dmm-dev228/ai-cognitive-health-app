package com.aihealth.backend.repository;

import com.aihealth.backend.model.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameResultRepository extends JpaRepository<GameResult, Long> {

    // Fetch current user's game results newest first.
    List<GameResult> findByUserIdOrderByPlayedAtDesc(Long userId);
}