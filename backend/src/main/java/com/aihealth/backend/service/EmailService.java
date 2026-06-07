package com.aihealth.backend.service;

import com.resend.Resend;
import com.resend.services.emails.model.SendEmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/*
 * EmailService
 * ------------
 * Sends email notifications for CogniHaven.
 *
 * Production note:
 * Uses Resend API instead of SMTP because Render Free blocks outbound SMTP ports.
 */
@Service
public class EmailService {

        @Value("${app.frontend.url}")
        private String frontendUrl;

        @Value("${resend.api.key}")
        private String resendApiKey;

        @Value("${resend.from.email:onboarding@resend.dev}")
        private String fromEmail;

        // Sends a medication reminder email.
        public void sendMedicationReminderEmail(
                        String toEmail,
                        String medicationName) {

                sendEmail(
                                toEmail,
                                "CogniHaven Medication Reminder",
                                "Hello,\n\n"
                                                + "This is a supportive reminder from CogniHaven.\n\n"
                                                + "It may be time for your medication reminder: "
                                                + medicationName
                                                + ". Please follow your prescribed care plan.\n\n"
                                                + "Open CogniHaven to review your reminders:\n"
                                                + frontendUrl
                                                + "/medication\n\n"
                                                + "— CogniHaven");
        }

        // Sends email verification link to newly registered users.
        public void sendVerificationEmail(
                        String toEmail,
                        String verificationToken) {

                String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;

                sendEmail(
                                toEmail,
                                "Verify Your CogniHaven Email",
                                "Welcome to CogniHaven.\n\n"
                                                + "Please verify your email by clicking the link below:\n\n"
                                                + verificationLink
                                                + "\n\n"
                                                + "If you did not create this account, you can ignore this email.\n\n"
                                                + "— CogniHaven");
        }

        // Sends a gentle goal reminder email.
        public void sendGoalReminderEmail(
                        String toEmail,
                        String goalTitle) {

                sendEmail(
                                toEmail,
                                "CogniHaven Goal Reminder",
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
        }

        // Sends password reset email.
        public void sendPasswordResetEmail(
                        String toEmail,
                        String resetToken) {

                String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

                sendEmail(
                                toEmail,
                                "Reset Your CogniHaven Password",
                                "Hello,\n\n"
                                                + "We received a request to reset your CogniHaven password.\n\n"
                                                + "Use the link below to create a new password:\n\n"
                                                + resetLink
                                                + "\n\n"
                                                + "This link will expire for security reasons.\n\n"
                                                + "If you did not request a password reset, you can safely ignore this email.\n\n"
                                                + "— CogniHaven");
        }

        // Sends email through Resend HTTPS API.
        private void sendEmail(String toEmail, String subject, String text) {
                Resend resend = new Resend(resendApiKey);

                SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                                .from(fromEmail)
                                .to(toEmail)
                                .subject(subject)
                                .text(text)
                                .build();

                resend.emails().send(sendEmailRequest);
        }
}