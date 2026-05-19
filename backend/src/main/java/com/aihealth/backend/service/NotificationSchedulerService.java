package com.aihealth.backend.service;

import com.aihealth.backend.model.Goal;
import com.aihealth.backend.model.MedicationReminder;
import com.aihealth.backend.repository.GoalRepository;
import com.aihealth.backend.repository.MedicationReminderRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.aihealth.backend.model.GoalLog;
import com.aihealth.backend.repository.GoalLogRepository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

/*
 * NotificationSchedulerService
 * ----------------------------
 * Background scheduler for automated reminder checks.
 *
 * Current behavior:
 * - Checks medication reminders every minute
 * - Supports multiple medication reminder times per day
 * - Sends medication reminder emails when enabled
 * - Uses cooldown protection to prevent duplicate medication emails
 * - Checks active goals and sends supportive goal reminder emails
 */
@Service
public class NotificationSchedulerService {

    private final MedicationReminderRepository medicationReminderRepository;
    private final GoalRepository goalRepository;
    private final EmailService emailService;
    private final GoalLogRepository goalLogRepository;

    public NotificationSchedulerService(
            MedicationReminderRepository medicationReminderRepository,
            GoalRepository goalRepository,
            EmailService emailService,
            GoalLogRepository goalLogRepository) {

        this.medicationReminderRepository = medicationReminderRepository;
        this.goalRepository = goalRepository;
        this.emailService = emailService;
        this.goalLogRepository = goalLogRepository;
    }

    /*
     * Runs every 60 seconds.
     *
     * @Transactional keeps the Hibernate session open while reading
     * reminderTimes, which is an ElementCollection.
     */
    @Transactional
    @Scheduled(fixedRate = 60000)
    public void checkReminders() {
        processMedicationReminders();
        processGoalReminders();
    }

    /*
     * Checks active medication reminders against the current local time.
     */
    private void processMedicationReminders() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime nowDateTime = LocalDateTime.now();

        List<MedicationReminder> reminders = medicationReminderRepository.findAll();

        for (MedicationReminder reminder : reminders) {
            if (!Boolean.TRUE.equals(reminder.getIsActive())) {
                continue;
            }

            if (reminder.getReminderTimes() == null
                    || reminder.getReminderTimes().isEmpty()) {
                continue;
            }

            for (LocalTime reminderTime : reminder.getReminderTimes()) {
                if (reminderTime == null) {
                    continue;
                }

                LocalTime scheduledTime = reminderTime.truncatedTo(ChronoUnit.MINUTES);

                if (now.equals(scheduledTime)) {
                    if (reminder.getLastTriggeredAt() != null
                            && reminder.getLastTriggeredAt()
                                    .isAfter(nowDateTime.minusMinutes(5))) {

                        System.out.println(
                                "[MEDICATION REMINDER SKIPPED] Cooldown active for "
                                        + reminder.getMedicationName());

                        continue;
                    }

                    System.out.println(
                            "[MEDICATION REMINDER] User "
                                    + reminder.getUser().getId()
                                    + " may need reminder for "
                                    + reminder.getMedicationName()
                                    + " at "
                                    + scheduledTime);

                    if (Boolean.TRUE.equals(reminder.getInAppReminderEnabled())) {
                        System.out.println("→ In-app reminder enabled");
                    }

                    if (Boolean.TRUE.equals(reminder.getEmailReminderEnabled())) {
                        System.out.println("→ Sending medication email reminder");

                        emailService.sendMedicationReminderEmail(
                                reminder.getUser().getEmail(),
                                reminder.getMedicationName());
                    }

                    if (Boolean.TRUE.equals(reminder.getSmsReminderEnabled())) {
                        System.out.println("→ SMS reminder enabled");
                    }

                    reminder.setLastTriggeredAt(nowDateTime);
                    medicationReminderRepository.save(reminder);

                    break;
                }
            }
        }
    }

/*
 * Sends supportive goal reminder emails using smart reminder rules.
 *
 * Reminder rules:
 * - Goal must be ACTIVE
 * - Email reminders must be enabled
 * - Do not remind the same goal more than once every 24 hours
 * - If no progress has ever been logged, remind after 24 hours from creation
 * - If progress exists, remind only after 48 hours without new progress
 *
 * This prevents annoying reminder spam.
 */
private void processGoalReminders() {

    LocalDateTime now = LocalDateTime.now();

    List<Goal> goals = goalRepository.findAll();

    for (Goal goal : goals) {

        if (!"ACTIVE".equalsIgnoreCase(goal.getStatus())) {
            continue;
        }

        if (!Boolean.TRUE.equals(goal.getEmailReminderEnabled())) {
            continue;
        }

        /*
         * Cooldown:
         * If we already reminded this goal in the last 24 hours,
         * skip it.
         */
        if (goal.getLastRemindedAt() != null
                && goal.getLastRemindedAt().isAfter(now.minusHours(24))) {
            continue;
        }

        Optional<GoalLog> latestLog =
                goalLogRepository.findTopByGoalIdOrderByLoggedAtDesc(goal.getId());

        boolean shouldRemind;

        if (latestLog.isEmpty()) {
            /*
             * No progress logged yet.
             * Remind only if goal was created more than 24 hours ago.
             */
            shouldRemind = goal.getCreatedAt() != null
                    && goal.getCreatedAt().isBefore(now.minusHours(24));
        } else {
            /*
             * Progress exists.
             * Remind only if the last progress log was more than 48 hours ago.
             */
            shouldRemind = latestLog.get()
                    .getLoggedAt()
                    .isBefore(now.minusHours(48));
        }

        if (!shouldRemind) {
            continue;
        }

        try {
            emailService.sendGoalReminderEmail(
                    goal.getUser().getEmail(),
                    goal.getTitle());

            goal.setLastRemindedAt(now);
            goalRepository.save(goal);

            System.out.println(
                    "[GOAL REMINDER] Email sent for goal: "
                            + goal.getTitle());

        } catch (Exception e) {
            System.out.println(
                    "[GOAL REMINDER ERROR] Failed for goal: "
                            + goal.getTitle());

            e.printStackTrace();
        }
    }
}
}