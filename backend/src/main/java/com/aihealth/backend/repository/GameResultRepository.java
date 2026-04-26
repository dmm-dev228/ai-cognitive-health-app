package com.aihealth.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aihealth.backend.model.GameResult;

public interface GameResultRepository extends JpaRepository<GameResult, Long> {

    List<GameResult> findByUserId(Long userId);
}