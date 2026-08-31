package com.aihealth.backend.controller;

import com.aihealth.backend.dto.AchievementResponse;
import com.aihealth.backend.service.AchievementService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * AchievementController
 * ---------------------
 * REST endpoints for unlocked user achievements.
 *
 * Achievements are system-generated.
 * Users do not manually create them.
 */
@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:5173")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(
            AchievementService achievementService) {

        this.achievementService = achievementService;
    }

    // Gets all achievements unlocked by the authenticated user.
    @GetMapping
    public ResponseEntity<List<AchievementResponse>> getAchievements() {
        return ResponseEntity.ok(
                achievementService.getAchievementsForCurrentUser());
    }

    /*
     * Gets achievements whose notification popup
     * has not yet been acknowledged.
     */
    @GetMapping("/unseen")
    public ResponseEntity<List<AchievementResponse>> getUnseenAchievements() {
        return ResponseEntity.ok(
                achievementService.getUnseenAchievementsForCurrentUser());
    }

    /*
     * Marks one achievement notification as seen.
     *
     * The service verifies that the achievement belongs
     * to the authenticated user before updating it.
     */
    @PatchMapping("/{achievementId}/seen")
    public ResponseEntity<AchievementResponse> markAchievementSeen(
            @PathVariable Long achievementId) {

        return ResponseEntity.ok(
                achievementService.markAchievementNotificationSeen(
                        achievementId));
    }
}