package com.aihealth.backend.repository;

import com.aihealth.backend.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {

        List<Achievement> findByUserId(Long userId);

        List<Achievement> findByUserIdOrderByUnlockedAtDesc(Long userId);

        Optional<Achievement> findByUserIdAndAchievementKey(
                        Long userId,
                        String achievementKey);

        boolean existsByUserIdAndAchievementKey(
                        Long userId,
                        String achievementKey);
}