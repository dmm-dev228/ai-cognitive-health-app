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

    public GameResultService(
            GameResultRepository gameResultRepository,
            UserRepository userRepository) {

        this.gameResultRepository = gameResultRepository;
        this.userRepository = userRepository;
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