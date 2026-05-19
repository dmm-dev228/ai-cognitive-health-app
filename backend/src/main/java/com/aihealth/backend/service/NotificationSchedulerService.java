package com.aihealth.backend.service;

import com.aihealth.backend.model.Goal;
import com.aihealth.backend.model.MedicationReminder;
import com.aihealth.backend.repository.GoalRepository;
import com.aihealth.backend.repository.MedicationReminderRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

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

    public NotificationSchedulerService(
            MedicationReminderRepository medicationReminderRepository,
            GoalRepository goalRepository,
            EmailService emailService) {

        this.medicationReminderRepository = medicationReminderRepository;
        this.goalRepository = goalRepository;
        this.emailService = emailService;
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
     * Sends supportive goal reminder emails.
     *
     * MVP behavior:
     * This currently runs every minute with the scheduler.
     *
     * Later improvement:
     * Add goal-specific cooldown or reminder frequency so users
     * do not receive too many emails.
     */
    private void processGoalReminders() {
        List<Goal> goals = goalRepository.findAll();

        for (Goal goal : goals) {
            if (!"ACTIVE".equalsIgnoreCase(goal.getStatus())) {
                continue;
            }

            if (!Boolean.TRUE.equals(goal.getEmailReminderEnabled())) {
                continue;
            }

            try {
                emailService.sendGoalReminderEmail(
                        goal.getUser().getEmail(),
                        goal.getTitle());

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