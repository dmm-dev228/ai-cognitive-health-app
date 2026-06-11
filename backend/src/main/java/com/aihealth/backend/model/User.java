package com.aihealth.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
 * User
 * ----
 * Represents an authenticated CogniHaven user.
 * Stores login credentials, role information,
 * and email verification state.
 */
@Entity
@Table(name = "users")
public class User {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Public username
    @Column(nullable = false, length = 50)
    private String username;

    // Unique login email
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // BCrypt hashed password
    @Column(nullable = false, length = 255)
    private String password;

    // User role
    @Column(nullable = false, length = 20)
    private String role;

    // Email verification state
    @Column(name = "email_verified")
    private Boolean emailVerified;

    // Verification token sent via email
    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    // Account creation timestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expires_at")
    private LocalDateTime passwordResetTokenExpiresAt;

    // Optional profile image URL shown in the navbar/settings drawer.
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    // New email waiting for user verification before it replaces current email.
    @Column(name = "pending_email", length = 100)
    private String pendingEmail;

    // Token sent to the new email address for confirming an email change.
    @Column(name = "email_change_token", length = 255)
    private String emailChangeToken;

    // Expiration time for the email change token.
    @Column(name = "email_change_token_expires_at")
    private LocalDateTime emailChangeTokenExpiresAt;

    // Controls whether the user receives daily journal reminder notifications.
    @Column(name = "journal_reminder_enabled")
    private Boolean journalReminderEnabled = true;

    // Controls whether the user receives goal reminder notifications.
    @Column(name = "goal_reminder_enabled")
    private Boolean goalReminderEnabled = true;

    public User() {
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getPasswordResetToken() {
        return passwordResetToken;
    }

    public void setPasswordResetToken(String passwordResetToken) {
        this.passwordResetToken = passwordResetToken;
    }

    public LocalDateTime getPasswordResetTokenExpiresAt() {
        return passwordResetTokenExpiresAt;
    }

    public void setPasswordResetTokenExpiresAt(LocalDateTime passwordResetTokenExpiresAt) {
        this.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getPendingEmail() {
        return pendingEmail;
    }

    public void setPendingEmail(String pendingEmail) {
        this.pendingEmail = pendingEmail;
    }

    public String getEmailChangeToken() {
        return emailChangeToken;
    }

    public void setEmailChangeToken(String emailChangeToken) {
        this.emailChangeToken = emailChangeToken;
    }

    public LocalDateTime getEmailChangeTokenExpiresAt() {
        return emailChangeTokenExpiresAt;
    }

    public void setEmailChangeTokenExpiresAt(LocalDateTime emailChangeTokenExpiresAt) {
        this.emailChangeTokenExpiresAt = emailChangeTokenExpiresAt;
    }

    public Boolean getJournalReminderEnabled() {
        return journalReminderEnabled;
    }

    public void setJournalReminderEnabled(Boolean journalReminderEnabled) {
        this.journalReminderEnabled = journalReminderEnabled;
    }

    public Boolean getGoalReminderEnabled() {
        return goalReminderEnabled;
    }

    public void setGoalReminderEnabled(Boolean goalReminderEnabled) {
        this.goalReminderEnabled = goalReminderEnabled;
    }
}