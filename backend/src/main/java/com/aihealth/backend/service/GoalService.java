package com.aihealth.backend.service;

import com.aihealth.backend.dto.*;
import com.aihealth.backend.model.Goal;
import com.aihealth.backend.model.GoalLog;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.GoalLogRepository;
import com.aihealth.backend.repository.GoalRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/*
 * GoalService
 * -----------
 * Handles:
 * - goal creation
 * - progress logging
 * - AI goal planning
 * - goal completion tracking
 */
@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final GoalLogRepository goalLogRepository;
    private final UserRepository userRepository;
    private final OpenAIService openAIService;

    public GoalService(
            GoalRepository goalRepository,
            GoalLogRepository goalLogRepository,
            UserRepository userRepository,
            OpenAIService openAIService) {

        this.goalRepository = goalRepository;
        this.goalLogRepository = goalLogRepository;
        this.userRepository = userRepository;
        this.openAIService = openAIService;
    }

    // Creates a new wellness goal.
    public GoalResponse createGoal(
            GoalRequest request) {

        User user = getCurrentAuthenticatedUser();

        Goal goal = new Goal();

        goal.setUser(user);
        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setCategory(request.getCategory());
        goal.setTargetCount(request.getTargetCount());
        goal.setCurrentProgress(0);
        goal.setUnitLabel(request.getUnitLabel());
        goal.setTargetDate(request.getTargetDate());

        goal.setInAppReminderEnabled(
                request.getInAppReminderEnabled() != null
                        ? request.getInAppReminderEnabled()
                        : true);

        goal.setEmailReminderEnabled(
                request.getEmailReminderEnabled() != null
                        ? request.getEmailReminderEnabled()
                        : false);

        goal.setStatus("ACTIVE");

        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        // Generate supportive AI goal plan.
        String aiPlan = openAIService.generateGoalPlan(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getTargetCount(),
                request.getUnitLabel());

        goal.setAiPlan(aiPlan);

        Goal saved = goalRepository.save(goal);

        return mapToGoalResponse(saved);
    }

    // Returns authenticated user's goals.
    public List<GoalResponse> getGoals() {

        User user = getCurrentAuthenticatedUser();

        return goalRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToGoalResponse)
                .toList();
    }

    // Logs progress toward a goal.
    public GoalLogResponse logProgress(
            Long goalId,
            GoalLogRequest request) {

        User user = getCurrentAuthenticatedUser();

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        /*
         * Security check:
         * Prevent users from logging progress
         * on another user's goal.
         */
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You do not own this goal");
        }

        GoalLog log = new GoalLog();

        log.setGoal(goal);
        log.setUser(user);
        log.setProgressAmount(
                request.getProgressAmount());
        log.setNote(request.getNote());
        log.setLoggedAt(LocalDateTime.now());

        GoalLog savedLog = goalLogRepository.save(log);

        // Update total goal progress.
        int updatedProgress = goal.getCurrentProgress()
                + request.getProgressAmount();

        goal.setCurrentProgress(updatedProgress);

        // Auto-complete goal when target reached.
        if (updatedProgress >= goal.getTargetCount()) {
            goal.setStatus("COMPLETED");
        }

        goal.setUpdatedAt(LocalDateTime.now());

        goalRepository.save(goal);

        return mapToGoalLogResponse(savedLog);
    }

    // Maps Goal entity -> safe response DTO.
    private GoalResponse mapToGoalResponse(
            Goal goal) {

        return new GoalResponse(
                goal.getId(),
                goal.getUser().getId(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getCategory(),
                goal.getTargetCount(),
                goal.getCurrentProgress(),
                goal.getUnitLabel(),
                goal.getTargetDate(),
                goal.getAiPlan(),
                goal.getStatus(),
                goal.getInAppReminderEnabled(),
                goal.getEmailReminderEnabled(),
                goal.getCreatedAt(),
                goal.getUpdatedAt());
    }

    // Maps GoalLog entity -> safe response DTO.
    private GoalLogResponse mapToGoalLogResponse(
            GoalLog log) {

        return new GoalLogResponse(
                log.getId(),
                log.getGoal().getId(),
                log.getUser().getId(),
                log.getProgressAmount(),
                log.getNote(),
                log.getLoggedAt());
    }

    // Loads authenticated user from JWT.
    private User getCurrentAuthenticatedUser() {

        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Authenticated user not found"));
    }
}