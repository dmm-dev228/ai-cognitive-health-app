package com.aihealth.backend.service;

import com.aihealth.backend.dto.NotificationResponse;
import com.aihealth.backend.model.MedicationReminder;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.GoalRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.repository.MedicationReminderRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private JournalEntryRepository journalEntryRepository;
    @Mock
    private MedicationReminderRepository medicationReminderRepository;
    @Mock
    private GoalRepository goalRepository;

    @Test
    void getNotificationsShouldReturnEmptyListWhenAllPreferencesAreDisabled() {
        // Arrange
        // Mock the authenticated user's email from the JWT security context.
        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            user.setEmail("test@example.com");
            user.setJournalReminderEnabled(false);
            user.setMedicationReminderEnabled(false);
            user.setGoalReminderEnabled(false);

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            NotificationService notificationService = new NotificationService(
                    userRepository,
                    journalEntryRepository,
                    medicationReminderRepository,
                    goalRepository);

            // Act
            List<NotificationResponse> notifications = notificationService.getNotificationsForCurrentUser();

            // Assert
            // No notification categories should run when all preferences are disabled.
            assertTrue(notifications.isEmpty());

            verify(userRepository).findByEmail("test@example.com");
            verifyNoInteractions(journalEntryRepository);
            verifyNoInteractions(medicationReminderRepository);
            verifyNoInteractions(goalRepository);
        }
    }

    @Test
    void shouldCreateJournalReminderWhenUserHasNotJournaledToday() {

        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {

            // Arrange
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            user.setEmail("test@example.com");
            user.setJournalReminderEnabled(true);
            user.setMedicationReminderEnabled(false);
            user.setGoalReminderEnabled(false);

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            // Empty list means no journal entries today.
            when(journalEntryRepository.findByUserIdAndCreatedAtBetween(
                    isNull(),
                    any(),
                    any()))
                    .thenReturn(List.of());

            NotificationService notificationService = new NotificationService(
                    userRepository,
                    journalEntryRepository,
                    medicationReminderRepository,
                    goalRepository);

            // Act
            List<NotificationResponse> notifications = notificationService.getNotificationsForCurrentUser();

            // Assert
            assertEquals(1, notifications.size());

            NotificationResponse notification = notifications.get(0);

            assertEquals("JOURNAL", notification.getType());

            assertTrue(
                    notification.getMessage()
                            .contains("journaled"));

            assertEquals(
                    "/journal",
                    notification.getActionUrl());
        }
    }

    @Test
    void shouldNotCreateJournalReminderWhenUserAlreadyJournaledToday() {

        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {

            // Arrange
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            user.setEmail("test@example.com");
            user.setJournalReminderEnabled(true);
            user.setMedicationReminderEnabled(false);
            user.setGoalReminderEnabled(false);

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            // Non-empty list means the user already journaled today.
            when(journalEntryRepository.findByUserIdAndCreatedAtBetween(
                    isNull(),
                    any(),
                    any()))
                    .thenReturn(List.of(mock(com.aihealth.backend.model.JournalEntry.class)));

            NotificationService notificationService = new NotificationService(
                    userRepository,
                    journalEntryRepository,
                    medicationReminderRepository,
                    goalRepository);

            // Act
            List<NotificationResponse> notifications = notificationService.getNotificationsForCurrentUser();

            // Assert
            assertTrue(notifications.isEmpty());
        }
    }

    @Test
    void shouldCreateMedicationReminderWhenReminderTimeMatchesCurrentTime() {

        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {

            // Arrange
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            user.setEmail("test@example.com");
            user.setJournalReminderEnabled(false);
            user.setMedicationReminderEnabled(true);
            user.setGoalReminderEnabled(false);

            MedicationReminder reminder = new MedicationReminder();
            reminder.setMedicationName("Vitamin D");
            reminder.setIsActive(true);
            reminder.setInAppReminderEnabled(true);
            reminder.setReminderTimes(List.of(
                    LocalTime.now().truncatedTo(ChronoUnit.MINUTES)));

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            when(medicationReminderRepository.findByUserId(isNull()))
                    .thenReturn(List.of(reminder));

            NotificationService notificationService = new NotificationService(
                    userRepository,
                    journalEntryRepository,
                    medicationReminderRepository,
                    goalRepository);

            // Act
            List<NotificationResponse> notifications = notificationService.getNotificationsForCurrentUser();

            // Assert
            assertEquals(1, notifications.size());

            NotificationResponse notification = notifications.get(0);

            assertEquals("MEDICATION", notification.getType());
            assertTrue(notification.getMessage().contains("Vitamin D"));
            assertEquals("/medication", notification.getActionUrl());
        }
    }

    @Test
    void shouldNotCreateMedicationReminderWhenReminderIsInactive() {

        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {

            // Arrange
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            user.setEmail("test@example.com");
            user.setJournalReminderEnabled(false);
            user.setMedicationReminderEnabled(true);
            user.setGoalReminderEnabled(false);

            MedicationReminder reminder = new MedicationReminder();
            reminder.setMedicationName("Vitamin D");
            reminder.setIsActive(false);
            reminder.setInAppReminderEnabled(true);
            reminder.setReminderTimes(List.of(
                    LocalTime.now().truncatedTo(ChronoUnit.MINUTES)));

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            when(medicationReminderRepository.findByUserId(isNull()))
                    .thenReturn(List.of(reminder));

            NotificationService notificationService = new NotificationService(
                    userRepository,
                    journalEntryRepository,
                    medicationReminderRepository,
                    goalRepository);

            // Act
            List<NotificationResponse> notifications = notificationService.getNotificationsForCurrentUser();

            // Assert
            assertTrue(notifications.isEmpty());
        }
    }

    @Test
    void shouldNotCreateMedicationReminderWhenInAppNotificationsAreDisabled() {

        try (MockedStatic<SecurityUtils> securityUtils = mockStatic(SecurityUtils.class)) {

            // Arrange
            securityUtils.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@example.com");

            User user = new User();
            user.setEmail("test@example.com");
            user.setJournalReminderEnabled(false);
            user.setMedicationReminderEnabled(true);
            user.setGoalReminderEnabled(false);

            MedicationReminder reminder = new MedicationReminder();
            reminder.setMedicationName("Vitamin D");
            reminder.setIsActive(true);
            reminder.setInAppReminderEnabled(false);
            reminder.setReminderTimes(List.of(
                    LocalTime.now().truncatedTo(ChronoUnit.MINUTES)));

            when(userRepository.findByEmail("test@example.com"))
                    .thenReturn(Optional.of(user));

            when(medicationReminderRepository.findByUserId(isNull()))
                    .thenReturn(List.of(reminder));

            NotificationService notificationService = new NotificationService(
                    userRepository,
                    journalEntryRepository,
                    medicationReminderRepository,
                    goalRepository);

            // Act
            List<NotificationResponse> notifications = notificationService.getNotificationsForCurrentUser();

            // Assert
            assertTrue(notifications.isEmpty());
        }
    }
}