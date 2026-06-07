package com.aihealth.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

/*
 * EmailService
 * ------------
 * Sends simple email notifications for CogniHaven.
 *
 * Current email types:
 * - medication reminders
 * - email verification
 * - goal reminders
 */
@Service
public class EmailService {

        @Value("${app.frontend.url}")

        private String frontendUrl;

        private final JavaMailSender mailSender;
        @Value("${spring.mail.username:}")
        private String mailUsername;

        @Value("${spring.mail.password:}")
        private String mailPassword;

        public EmailService(JavaMailSender mailSender) {
                this.mailSender = mailSender;
        }

        /*
         * Sends a medication reminder email.
         * Message is intentionally supportive and non-medical.
         */
        public void sendMedicationReminderEmail(
                        String toEmail,
                        String medicationName) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setFrom("CogniHaven <dmmcmillan2018@gmail.com>");
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
        public void sendVerificationEmail(
                        String toEmail,
                        String verificationToken) {

                String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;

                SimpleMailMessage message = new SimpleMailMessage();

                message.setFrom("CogniHaven <dmmcmillan2018@gmail.com>");
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

        /*
         * Sends a gentle goal reminder email.
         *
         * This keeps goal reminders aligned with CogniHaven's
         * supportive, non-medical wellness positioning.
         */
        public void sendGoalReminderEmail(
                        String toEmail,
                        String goalTitle) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setFrom("CogniHaven <dmmcmillan2018@gmail.com>");
                message.setTo(toEmail);
                message.setSubject("CogniHaven Goal Reminder");

                message.setText(
                                "Hello,\n\n"
                                                + "This is a gentle reminder from CogniHaven.\n\n"
                                                + "You set a goal: "
                                                + goalTitle
                                                + "\n\n"
                                                + "Small steps can help you keep momentum. "
                                                + "Open CogniHaven to log your progress:\n"
                                                + frontendUrl
                                                + "/goals\n\n"
                                                + "— CogniHaven");

                mailSender.send(message);
        }

        /*
         * Sends password reset email.
         * The reset link expires for security purposes.
         */
        public void sendPasswordResetEmail(
                        String toEmail,
                        String resetToken) {

                String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

                SimpleMailMessage message = new SimpleMailMessage();

                message.setFrom("CogniHaven <dmmcmillan2018@gmail.com>");

                message.setTo(toEmail);

                message.setSubject("Reset Your CogniHaven Password");

                message.setText(
                                "Hello,\n\n"
                                                + "We received a request to reset your CogniHaven password.\n\n"
                                                + "Use the link below to create a new password:\n\n"
                                                + resetLink
                                                + "\n\n"
                                                + "This link will expire for security reasons.\n\n"
                                                + "If you did not request a password reset, you can safely ignore this email.\n\n"
                                                + "— CogniHaven");

                mailSender.send(message);
        }

        // Logs mail config without exposing the actual password.
        @PostConstruct
        public void verifyMailConfig() {
                System.out.println("MAIL USERNAME = " + mailUsername);

                if (mailPassword == null || mailPassword.isBlank()) {
                        System.out.println("MAIL PASSWORD IS MISSING");
                } else {
                        System.out.println("MAIL PASSWORD LENGTH = " + mailPassword.length());
                }
        }

}