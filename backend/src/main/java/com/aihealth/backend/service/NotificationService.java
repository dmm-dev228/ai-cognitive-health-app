package com.aihealth.backend.service;

import com.aihealth.backend.dto.NotificationResponse;
import com.aihealth.backend.model.MedicationReminder;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.repository.MedicationReminderRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/*
 * NotificationService
 * -------------------
 * Builds user-specific in-app notifications.
 * Current MVP notifications:
 * - Medication reminders due around the current time
 * - Gentle journaling prompt if user has not journaled today
 */
@Service
public class NotificationService {

    private final UserRepository userRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final MedicationReminderRepository medicationReminderRepository;

    public NotificationService(UserRepository userRepository,
            JournalEntryRepository journalEntryRepository,
            MedicationReminderRepository medicationReminderRepository) {
        this.userRepository = userRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.medicationReminderRepository = medicationReminderRepository;
    }

    // Get current notifications for the authenticated user.
    public List<NotificationResponse> getNotificationsForCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        List<NotificationResponse> notifications = new ArrayList<>();

        addJournalReminder(user, notifications);
        addMedicationReminders(user, notifications);

        return notifications;
    }

    // Add a gentle journaling reminder if the user has not journaled today.
    private void addJournalReminder(User user, List<NotificationResponse> notifications) {
        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        boolean hasJournaledToday = !journalEntryRepository
                .findByUserIdAndCreatedAtBetween(user.getId(), startOfDay, endOfDay)
                .isEmpty();

        if (!hasJournaledToday) {
            notifications.add(new NotificationResponse(
                    "JOURNAL",
                    "You haven’t journaled any thoughts today. Would you like to reflect for a moment?",
                    "/journal"));
        }
    }

    // Add medication reminders that are due at the current minute.
    private void addMedicationReminders(User user, List<NotificationResponse> notifications) {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);

        List<MedicationReminder> reminders = medicationReminderRepository.findByUserId(user.getId());

        for (MedicationReminder reminder : reminders) {
            if (!Boolean.TRUE.equals(reminder.getIsActive())) {
                continue;
            }

            if (!Boolean.TRUE.equals(reminder.getInAppReminderEnabled())) {
                continue;
            }

            if (reminder.getReminderTime() == null) {
                continue;
            }

            LocalTime reminderTime = reminder.getReminderTime().truncatedTo(ChronoUnit.MINUTES);

            if (now.equals(reminderTime)) {
                notifications.add(new NotificationResponse(
                        "MEDICATION",
                        "It may be time for your medication reminder: "
                                + reminder.getMedicationName()
                                + ". Please follow your prescribed care plan.",
                        "/medication"));
            }
        }
    }

    // Load current user from JWT security context.
    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}