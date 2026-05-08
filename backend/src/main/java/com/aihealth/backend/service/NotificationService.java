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
 *
 * Current MVP notifications:
 * - Medication reminders due around the current time
 * - Gentle journaling prompt if user has not journaled today
 *
 * Important:
 * Medication reminders now support MULTIPLE reminder times per day.
 */
@Service
public class NotificationService {

    private final UserRepository userRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final MedicationReminderRepository medicationReminderRepository;

    public NotificationService(
            UserRepository userRepository,
            JournalEntryRepository journalEntryRepository,
            MedicationReminderRepository medicationReminderRepository) {

        this.userRepository = userRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.medicationReminderRepository = medicationReminderRepository;
    }

    /*
     * Get current notifications for the authenticated user.
     * This endpoint is called by the frontend notification popup system.
     */
    public List<NotificationResponse> getNotificationsForCurrentUser() {

        User user = getCurrentAuthenticatedUser();

        List<NotificationResponse> notifications = new ArrayList<>();

        addJournalReminder(user, notifications);
        addMedicationReminders(user, notifications);

        return notifications;
    }

    // Add a gentle journaling reminder if the user has not journaled today.
    private void addJournalReminder(
            User user,
            List<NotificationResponse> notifications) {

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        boolean hasJournaledToday = !journalEntryRepository
                .findByUserIdAndCreatedAtBetween(
                        user.getId(),
                        startOfDay,
                        endOfDay)
                .isEmpty();

        if (!hasJournaledToday) {
            notifications.add(new NotificationResponse(
                    "JOURNAL",
                    "You haven’t journaled any thoughts today. Would you like to reflect for a moment?",
                    "/journal"));
        }
    }

    /*
     * Add medication reminders that are due at the current minute.
     *
     * Because medications can now have multiple reminder times per day,
     * we loop through reminder.getReminderTimes() instead of checking
     * a single reminderTime field.
     */
    private void addMedicationReminders(
            User user,
            List<NotificationResponse> notifications) {

        // Compare only hour/minute so seconds/nanoseconds do not block matches.
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);

        List<MedicationReminder> reminders = medicationReminderRepository.findByUserId(user.getId());

        for (MedicationReminder reminder : reminders) {

            // Skip inactive reminders.
            if (!Boolean.TRUE.equals(reminder.getIsActive())) {
                continue;
            }

            // Skip reminders where in-app notifications are disabled.
            if (!Boolean.TRUE.equals(reminder.getInAppReminderEnabled())) {
                continue;
            }

            // Skip reminders with no configured times.
            if (reminder.getReminderTimes() == null
                    || reminder.getReminderTimes().isEmpty()) {
                continue;
            }

            /*
             * Check every time attached to this medication.
             *
             * Example:
             * frequencyPerDay = 3
             * reminderTimes = [08:00, 14:00, 20:00]
             */
            for (LocalTime reminderTime : reminder.getReminderTimes()) {

                if (reminderTime == null) {
                    continue;
                }

                LocalTime scheduledTime = reminderTime.truncatedTo(ChronoUnit.MINUTES);

                if (now.equals(scheduledTime)) {
                    notifications.add(new NotificationResponse(
                            "MEDICATION",
                            "It may be time for your medication reminder: "
                                    + reminder.getMedicationName()
                                    + ". Please follow your prescribed care plan.",
                            "/medication"));

                    /*
                     * Stop after one match for this medication during this polling cycle.
                     * This prevents duplicate popups if duplicate times are accidentally saved.
                     */
                    break;
                }
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