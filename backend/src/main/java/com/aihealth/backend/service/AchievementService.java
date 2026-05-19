package com.aihealth.backend.service;

import com.aihealth.backend.dto.AchievementResponse;
import com.aihealth.backend.model.Achievement;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.AchievementRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/*
 * AchievementService
 * ------------------
 * Handles achievement unlocking and retrieval.
 * Achievements reward consistency and progress.
 * They should encourage users without creating pressure.
 */
@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public AchievementService(
            AchievementRepository achievementRepository,
            UserRepository userRepository) {

        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
    }

    // Returns achievements for the authenticated user.
    public List<AchievementResponse> getAchievementsForCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        return achievementRepository
                .findByUserIdOrderByUnlockedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /*
     * Unlocks an achievement only if the user has not already earned it.
     * This prevents duplicate badges.
     */
    public void unlockAchievementIfMissing(
            User user,
            String achievementKey,
            String title,
            String description,
            String badgeLabel) {

        boolean alreadyUnlocked =
                achievementRepository.existsByUserIdAndAchievementKey(
                        user.getId(),
                        achievementKey
                );

        if (alreadyUnlocked) {
            return;
        }

        Achievement achievement = new Achievement();

        achievement.setUser(user);
        achievement.setAchievementKey(achievementKey);
        achievement.setTitle(title);
        achievement.setDescription(description);
        achievement.setBadgeLabel(badgeLabel);
        achievement.setUnlockedAt(LocalDateTime.now());

        achievementRepository.save(achievement);
    }

    // Maps entity to response DTO.
    private AchievementResponse mapToResponse(Achievement achievement) {
        return new AchievementResponse(
                achievement.getId(),
                achievement.getUser().getId(),
                achievement.getAchievementKey(),
                achievement.getTitle(),
                achievement.getDescription(),
                achievement.getBadgeLabel(),
                achievement.getUnlockedAt()
        );
    }

    // Loads authenticated user from JWT.
    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));
    }
}