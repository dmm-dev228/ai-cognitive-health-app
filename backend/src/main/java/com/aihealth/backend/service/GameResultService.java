package com.aihealth.backend.service;

import com.aihealth.backend.dto.GameResultRequest;
import com.aihealth.backend.dto.GameResultResponse;
import com.aihealth.backend.model.GameResult;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.GameResultRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/*
 * GameResultService
 * -----------------
 * Handles saving and retrieving cognitive game results.
 * Uses JWT authentication so results belong to the logged-in user.
 */
@Service
public class GameResultService {

    private final GameResultRepository gameResultRepository;
    private final UserRepository userRepository;
    private final AchievementService achievementService;

    public GameResultService(
            GameResultRepository gameResultRepository,
            UserRepository userRepository,
            AchievementService achievementService) {

        this.gameResultRepository = gameResultRepository;
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }

    // Save a completed game result for the authenticated user.
    public GameResultResponse saveGameResult(GameResultRequest request) {

        User user = getCurrentAuthenticatedUser();

        GameResult result = new GameResult();

        result.setUser(user);
        result.setGameType(request.getGameType());
        result.setScore(request.getScore());
        result.setTotalQuestions(request.getTotalQuestions());
        result.setCorrectAnswers(request.getCorrectAnswers());
        result.setTimeTakenSeconds(request.getTimeTakenSeconds());
        result.setDifficulty(request.getDifficulty());
        result.setPlayedAt(LocalDateTime.now());

        GameResult saved = gameResultRepository.save(result);
        /*
         * Achievement checks happen after the game result is saved.
         *
         * Achievements are system-generated, so the frontend does not
         * manually request badges.
         */
        achievementService.unlockAchievementIfMissing(
                user,
                "FIRST_GAME_PLAYED",
                "First Game Played",
                "You completed your first cognitive wellness game.",
                "Game Starter");

        // Any perfect score unlocks the general perfect game achievement.
        if (saved.getScore() != null && saved.getScore() == 100) {
            achievementService.unlockAchievementIfMissing(
                    user,
                    "PERFECT_GAME_SCORE",
                    "Perfect Game Score",
                    "You earned a perfect score on a cognitive wellness game.",
                    "Perfect Recall");
        }

        // Game-specific mastery badges.
        if ("PATTERN_RECALL".equalsIgnoreCase(saved.getGameType())
                && saved.getScore() != null
                && saved.getScore() == 100) {

            achievementService.unlockAchievementIfMissing(
                    user,
                    "PATTERN_RECALL_MASTER",
                    "Pattern Recall Master",
                    "You earned a perfect score on Pattern Recall.",
                    "Pattern Master");
        }

        if ("STORY_RECALL".equalsIgnoreCase(saved.getGameType())
                && saved.getScore() != null
                && saved.getScore() == 100) {

            achievementService.unlockAchievementIfMissing(
                    user,
                    "STORY_RECALL_MASTER",
                    "Story Recall Master",
                    "You remembered every item in Story Recall.",
                    "Story Master");
        }

        /*
         * Future game support:
         *
         * When Card Match is added, it can reuse the same GameResult model:
         * - gameType = CARD_MATCH
         * - score = percentage
         * - correctAnswers = matched pairs
         * - totalQuestions = total pairs
         * - timeTakenSeconds = completion time
         * - difficulty = EASY / MEDIUM / HARD
         */
        // if ("CARD_MATCH".equalsIgnoreCase(saved.getGameType())
        // && saved.getScore() != null
        // && saved.getScore() == 100) {
        //
        // achievementService.unlockAchievementIfMissing(
        // user,
        // "CARD_MATCH_MASTER",
        // "Card Match Master",
        // "You completed a perfect card matching round.",
        // "Card Master"
        // );
        // }

        return mapToResponse(saved);
    }

    /*
     * Get all game results for the authenticated user.
     * Returned newest first for dashboards and AI context.
     */
    public List<GameResultResponse> getGameResultsForCurrentUser() {

        User user = getCurrentAuthenticatedUser();

        return gameResultRepository.findByUserIdOrderByPlayedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Load current user from JWT security context.
    private User getCurrentAuthenticatedUser() {

        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // Convert entity into safe frontend response DTO.
    private GameResultResponse mapToResponse(GameResult result) {

        return new GameResultResponse(
                result.getId(),
                result.getUser().getId(),
                result.getGameType(),
                result.getScore(),
                result.getTotalQuestions(),
                result.getCorrectAnswers(),
                result.getTimeTakenSeconds(),
                result.getDifficulty(),
                result.getPlayedAt());
    }
}