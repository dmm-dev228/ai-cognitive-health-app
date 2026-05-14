package com.aihealth.backend.service;

import com.aihealth.backend.model.MedicationReminder;
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
 * Background scheduler that checks medication reminders.
 *
 * MVP behavior:
 * - Runs every minute
 * - Finds active reminders
 * - Checks ALL reminder times for each medication
 * - Logs reminders when the current time matches one of the reminder times
 * - Sends email reminders when email reminders are enabled
 * - Uses cooldown protection to prevent duplicate reminder spam
 *
 * Important:
 * Medication reminders now support multiple reminder times per day.
 */
@Service
public class NotificationSchedulerService {

    private final MedicationReminderRepository medicationReminderRepository;
    private final EmailService emailService;

    public NotificationSchedulerService(
            MedicationReminderRepository medicationReminderRepository,
            EmailService emailService) {

        this.medicationReminderRepository = medicationReminderRepository;
        this.emailService = emailService;
    }

    /*
     * Runs every 60 seconds.
     * Checks active medication reminders against the current local time.
     *
     * @Transactional keeps the Hibernate session open while reading
     * reminderTimes, which is an ElementCollection.
     */
    @Transactional
    @Scheduled(fixedRate = 60000)
    public void checkMedicationReminders() {

        // Truncate seconds/nanoseconds so 08:00:25 still compares as 08:00.
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);

        // Used for cooldown comparison and saving lastTriggeredAt.
        LocalDateTime nowDateTime = LocalDateTime.now();

        List<MedicationReminder> reminders = medicationReminderRepository.findAll();

        for (MedicationReminder reminder : reminders) {

            // Skip reminders that are turned off.
            if (!Boolean.TRUE.equals(reminder.getIsActive())) {
                continue;
            }

            // Skip reminders with no configured reminder times.
            if (reminder.getReminderTimes() == null
                    || reminder.getReminderTimes().isEmpty()) {
                continue;
            }

            /*
             * Each medication can now have multiple reminder times.
             *
             * Example:
             * Medication: Vitamin D
             * frequencyPerDay: 2
             * reminderTimes: [08:00, 20:00]
             */
            for (LocalTime reminderTime : reminder.getReminderTimes()) {

                if (reminderTime == null) {
                    continue;
                }

                LocalTime scheduledTime =
                        reminderTime.truncatedTo(ChronoUnit.MINUTES);

                if (now.equals(scheduledTime)) {

                    /*
                     * Cooldown protection:
                     * If this medication reminder was triggered within
                     * the last 5 minutes, skip it.
                     *
                     * This prevents duplicate emails/logs/popups from
                     * repeated scheduler runs or accidental duplicate times.
                     */
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
                        System.out.println("→ Email reminder enabled");
                        System.out.println("→ Sending email reminder");

                        emailService.sendMedicationReminderEmail(
                                reminder.getUser().getEmail(),
                                reminder.getMedicationName());
                    }

                    if (Boolean.TRUE.equals(reminder.getSmsReminderEnabled())) {
                        System.out.println("→ SMS reminder enabled");
                    }

                    /*
                     * Save the last trigger timestamp after the reminder fires.
                     * This allows the next scheduler run to know this reminder
                     * already triggered recently.
                     */
                    reminder.setLastTriggeredAt(nowDateTime);
                    medicationReminderRepository.save(reminder);

                    /*
                     * Stop checking this medication after one matching time.
                     * This prevents duplicate notifications if duplicate times
                     * are accidentally saved for the same medication.
                     */
                    break;
                }
            }
        }
    }
}