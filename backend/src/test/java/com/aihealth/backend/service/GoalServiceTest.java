package com.aihealth.backend.service;

import com.aihealth.backend.dto.GoalLogRequest;
import com.aihealth.backend.dto.GoalRequest;
import com.aihealth.backend.dto.GoalResponse;
import com.aihealth.backend.model.Goal;
import com.aihealth.backend.model.GoalLog;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.GoalLogRepository;
import com.aihealth.backend.repository.GoalRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoalServiceTest {

    @Mock private GoalRepository goalRepository;
    @Mock private GoalLogRepository goalLogRepository;
    @Mock private UserRepository userRepository;
    @Mock private OpenAIService openAIService;
    @Mock private AchievementService achievementService;

    @Test
    void createGoalShouldCreateActiveGoalWithAiPlan() {
        try (MockedStatic<SecurityUtils> securityUtils =
                     mockStatic(SecurityUtils.class)) {

            // Arrange
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            setPrivateId(user, 1L);
            user.setEmail("test@example.com");
            user.setUsername("demarquis");

            GoalRequest request = new GoalRequest();
            request.setTitle("Journal 5 times this week");
            request.setDescription("Build a consistent reflection habit.");
            request.setCategory("JOURNALING");
            request.setTargetCount(5);
            request.setUnitLabel("entries");
            request.setTargetDate(LocalDate.now().plusDays(7));
            request.setInAppReminderEnabled(true);
            request.setEmailReminderEnabled(false);

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            when(openAIService.generateGoalPlan(
                    request.getTitle(),
                    request.getDescription(),
                    request.getCategory(),
                    request.getTargetCount(),
                    request.getUnitLabel()))
                    .thenReturn("AI-generated goal plan.");

            when(goalRepository.save(any(Goal.class)))
                    .thenAnswer(invocation -> {
                        Goal savedGoal = invocation.getArgument(0);
                        setPrivateId(savedGoal, 1L);
                        return savedGoal;
                    });

            GoalService goalService =
                    new GoalService(
                            goalRepository,
                            goalLogRepository,
                            userRepository,
                            openAIService,
                            achievementService);

            // Act
            GoalResponse response = goalService.createGoal(request);

            // Assert
            assertEquals("Journal 5 times this week", response.getTitle());
            assertEquals("JOURNALING", response.getCategory());
            assertEquals(5, response.getTargetCount());
            assertEquals(0, response.getCurrentProgress());
            assertEquals("ACTIVE", response.getStatus());
            assertEquals("AI-generated goal plan.", response.getAiPlan());
            assertTrue(response.getInAppReminderEnabled());
            assertFalse(response.getEmailReminderEnabled());

            verify(userRepository).findByEmail("test@example.com");
            verify(openAIService).generateGoalPlan(
                    request.getTitle(),
                    request.getDescription(),
                    request.getCategory(),
                    request.getTargetCount(),
                    request.getUnitLabel());

            verify(goalRepository).save(any(Goal.class));

            verify(achievementService).unlockAchievementIfMissing(
                    eq(user),
                    eq("FIRST_GOAL_CREATED"),
                    eq("First Goal Created"),
                    eq("You created your first wellness goal."),
                    eq("Goal Starter"));
        }
    }

    @Test
    void logProgressShouldCompleteGoalWhenTargetReached() {
        try (MockedStatic<SecurityUtils> securityUtils =
                     mockStatic(SecurityUtils.class)) {

            // Arrange
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            setPrivateId(user, 1L);
            user.setEmail("test@example.com");

            Goal goal = new Goal();
            setPrivateId(goal, 1L);
            goal.setUser(user);
            goal.setTitle("Journal 5 times");
            goal.setTargetCount(5);
            goal.setCurrentProgress(4);
            goal.setStatus("ACTIVE");

            GoalLogRequest request = new GoalLogRequest();
            request.setProgressAmount(1);
            request.setNote("Completed today's journal.");

            GoalLog savedLog = new GoalLog();
            setPrivateId(savedLog, 1L);
            savedLog.setGoal(goal);
            savedLog.setUser(user);
            savedLog.setProgressAmount(1);

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            when(goalRepository.findById(1L))
                    .thenReturn(Optional.of(goal));

            when(goalLogRepository.save(any(GoalLog.class)))
                    .thenReturn(savedLog);

            GoalService goalService =
                    new GoalService(
                            goalRepository,
                            goalLogRepository,
                            userRepository,
                            openAIService,
                            achievementService);

            // Act
            goalService.logProgress(1L, request);

            // Assert
            assertEquals(5, goal.getCurrentProgress());
            assertEquals("COMPLETED", goal.getStatus());

            verify(goalRepository).save(goal);

            verify(achievementService).unlockAchievementIfMissing(
                    eq(user),
                    eq("FIRST_GOAL_COMPLETED"),
                    eq("First Goal Completed"),
                    eq("You completed your first wellness goal."),
                    eq("Goal Finisher"));
        }
    }

    private void setPrivateId(Object target, Long id) {
        try {
            java.lang.reflect.Field idField =
                    target.getClass().getDeclaredField("id");

            idField.setAccessible(true);
            idField.set(target, id);
        } catch (Exception exception) {
            throw new RuntimeException("Failed to set test id", exception);
        }
    }
    @Test
void logProgressShouldKeepGoalActiveWhenTargetNotReached() {

    try (MockedStatic<SecurityUtils> securityUtils =
                 mockStatic(SecurityUtils.class)) {

        // Arrange
        securityUtils.when(SecurityUtils::getCurrentUserEmail)
                .thenReturn("test@example.com");

        User user = new User();
        setPrivateId(user, 1L);
        user.setEmail("test@example.com");

        Goal goal = new Goal();
        setPrivateId(goal, 1L);
        goal.setUser(user);
        goal.setTargetCount(10);
        goal.setCurrentProgress(4);
        goal.setStatus("ACTIVE");

        GoalLogRequest request = new GoalLogRequest();
        request.setProgressAmount(2);

        GoalLog savedLog = new GoalLog();
        savedLog.setGoal(goal);
        savedLog.setUser(user);

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(goalRepository.findById(1L))
                .thenReturn(Optional.of(goal));

        when(goalLogRepository.save(any(GoalLog.class)))
                .thenReturn(savedLog);

        GoalService goalService =
                new GoalService(
                        goalRepository,
                        goalLogRepository,
                        userRepository,
                        openAIService,
                        achievementService);

        // Act
        goalService.logProgress(1L, request);

        // Assert
        assertEquals(6, goal.getCurrentProgress());
        assertEquals("ACTIVE", goal.getStatus());

        verify(goalRepository).save(goal);

        verify(achievementService, never())
                .unlockAchievementIfMissing(
                        eq(user),
                        eq("FIRST_GOAL_COMPLETED"),
                        anyString(),
                        anyString(),
                        anyString());
    }
}
@Test
void logProgressShouldFailWhenUserDoesNotOwnGoal() {

    try (MockedStatic<SecurityUtils> securityUtils =
                 mockStatic(SecurityUtils.class)) {

        // Arrange
        securityUtils.when(SecurityUtils::getCurrentUserEmail)
                .thenReturn("user1@example.com");

        User authenticatedUser = new User();
        setPrivateId(authenticatedUser, 1L);
        authenticatedUser.setEmail("user1@example.com");

        User goalOwner = new User();
        setPrivateId(goalOwner, 2L);
        goalOwner.setEmail("user2@example.com");

        Goal goal = new Goal();
        setPrivateId(goal, 1L);
        goal.setUser(goalOwner);

        GoalLogRequest request = new GoalLogRequest();
        request.setProgressAmount(1);

        when(userRepository.findByEmail("user1@example.com"))
                .thenReturn(Optional.of(authenticatedUser));

        when(goalRepository.findById(1L))
                .thenReturn(Optional.of(goal));

        GoalService goalService =
                new GoalService(
                        goalRepository,
                        goalLogRepository,
                        userRepository,
                        openAIService,
                        achievementService);

        // Act + Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> goalService.logProgress(1L, request));

        assertEquals(
                "You do not own this goal",
                exception.getMessage());

        verify(goalLogRepository, never())
                .save(any());

        verify(goalRepository, never())
                .save(any());
    }
}
}