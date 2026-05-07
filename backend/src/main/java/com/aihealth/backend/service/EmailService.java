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

    /*
     * Sends email verification link to newly registered users.
     */
    public void sendVerificationEmail(String toEmail, String verificationToken) {

        String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject("Verify Your CogniHaven Email");

        message.setText(
                "Welcome to CogniHaven.\n\n"
                        + "Please verify your email by clicking the link below:\n\n"
                        + verificationLink
                        + "\n\n"
                        + "If you did not create this account, you can ignore this email.\n\n"
                        + "— CogniHaven");

        mailSender.send(message);
    }
}