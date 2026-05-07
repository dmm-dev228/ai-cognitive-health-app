package com.aihealth.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

/*
 * EmailService
 * ------------
 * Sends simple email notifications for CogniHaven.
 * Used by scheduled reminder systems such as medication reminders.
 */
@Service
public class EmailService {
    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /*
     * Sends a medication reminder email.
     * Message is intentionally supportive and non-medical.
     */
    public void sendMedicationReminderEmail(String toEmail, String medicationName) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("CogniHaven Medication Reminder");
        message.setText(
                "Hello,\n\n"
                        + "This is a supportive reminder from CogniHaven.\n\n"
                        + "It may be time for your medication reminder: "
                        + medicationName
                        + ". Please follow your prescribed care plan.\n\n"
                        + "Open CogniHaven to review your reminders:\n"
                        + frontendUrl
                        + "/medication\n\n"
                        + "— CogniHaven");

        mailSender.send(message);
    }
}