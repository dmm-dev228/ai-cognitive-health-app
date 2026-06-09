package com.aihealth.backend.repository;

import com.aihealth.backend.model.DailyPrompt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyPromptRepository extends JpaRepository<DailyPrompt, Long> {

    List<DailyPrompt> findByUserId(Long userId);

    // Finds today's prompt for a specific user
    Optional<DailyPrompt> findByUserIdAndPromptDate(Long userId, LocalDate promptDate);

    // Gets recent prompts so OpenAI can avoid repeating previous ones.
    List<DailyPrompt> findTop30ByUserIdOrderByPromptDateDesc(Long userId);
}