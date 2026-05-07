package com.aihealth.backend.service;

import com.aihealth.backend.model.MedicationReminder;
import com.aihealth.backend.repository.MedicationReminderRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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
 * - Logs reminders when the current time matches the reminder time
 *
 * Future behavior:
 * - Send in-app notifications
 * - Send email reminders
 * - Send SMS reminders
 */
@Service
public class NotificationSchedulerService {

    private final MedicationReminderRepository medicationReminderRepository;
    private final EmailService emailService;

    public NotificationSchedulerService(MedicationReminderRepository medicationReminderRepository,
            EmailService emailService) {
        this.medicationReminderRepository = medicationReminderRepository;
        this.emailService = emailService;
    }

    /*
     * Runs every 60 seconds.
     * Checks active medication reminders against the current local time.
     */
    @Scheduled(fixedRate = 60000)
    public void checkMedicationReminders() {
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);

        List<MedicationReminder> reminders = medicationReminderRepository.findAll();

        for (MedicationReminder reminder : reminders) {
            if (!Boolean.TRUE.equals(reminder.getIsActive())) {
                continue;
            }

            if (reminder.getReminderTime() == null) {
                continue;
            }

            LocalTime reminderTime = reminder.getReminderTime().truncatedTo(ChronoUnit.MINUTES);

            if (now.equals(reminderTime)) {
                System.out.println(
                        "[MEDICATION REMINDER] User "
                                + reminder.getUser().getId()
                                + " may need reminder for "
                                + reminder.getMedicationName()
                                + " at "
                                + reminder.getReminderTime());

                if (Boolean.TRUE.equals(reminder.getInAppReminderEnabled())) {
                    System.out.println("→ In-app reminder enabled");
                }

                if (Boolean.TRUE.equals(reminder.getEmailReminderEnabled())) {
                    System.out.println("→ Email reminder enabled");
                }

                if (Boolean.TRUE.equals(reminder.getSmsReminderEnabled())) {
                    System.out.println("→ SMS reminder enabled");
                }
                if (Boolean.TRUE.equals(reminder.getEmailReminderEnabled())) {
                    System.out.println("→ Sending email reminder");

                    emailService.sendMedicationReminderEmail(
                            reminder.getUser().getEmail(),
                            reminder.getMedicationName());
                }
            }
        }
    }
}