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

    // Returns all achievements for the authenticated user.
    public List<AchievementResponse> getAchievementsForCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        return achievementRepository
                .findByUserIdOrderByUnlockedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /*
     * Returns achievements whose notification popup
     * has not yet been acknowledged by the authenticated user.
     */
    public List<AchievementResponse> getUnseenAchievementsForCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        return achievementRepository
                .findByUserIdAndNotificationSeenAtIsNullOrderByUnlockedAtAsc(
                        user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /*
     * Marks a specific achievement notification as seen.
     *
     * The achievement must belong to the authenticated user.
     * This prevents one user from modifying another user's achievement.
     */
    public AchievementResponse markAchievementNotificationSeen(Long achievementId) {
        User user = getCurrentAuthenticatedUser();

        Achievement achievement = achievementRepository
                .findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));

        if (!achievement.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to update this achievement");
        }

        /*
         * Only set the timestamp the first time the notification is seen.
         * Calling this endpoint again will not overwrite the original time.
         */
        if (achievement.getNotificationSeenAt() == null) {
            achievement.setNotificationSeenAt(LocalDateTime.now());
            achievement = achievementRepository.save(achievement);
        }

        return mapToResponse(achievement);
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

        boolean alreadyUnlocked = achievementRepository.existsByUserIdAndAchievementKey(
                user.getId(),
                achievementKey);

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

        /*
         * Leave notificationSeenAt as null.
         *
         * A null value means the user has unlocked the achievement
         * but has not yet acknowledged its popup.
         */
        achievement.setNotificationSeenAt(null);

        achievementRepository.save(achievement);
    }

    // Maps Achievement entity data to the safe response DTO.
    private AchievementResponse mapToResponse(Achievement achievement) {
        return new AchievementResponse(
                achievement.getId(),
                achievement.getUser().getId(),
                achievement.getAchievementKey(),
                achievement.getTitle(),
                achievement.getDescription(),
                achievement.getBadgeLabel(),
                achievement.getUnlockedAt(),
                achievement.getNotificationSeenAt());
    }

    // Loads the authenticated user from the JWT security context.
    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}