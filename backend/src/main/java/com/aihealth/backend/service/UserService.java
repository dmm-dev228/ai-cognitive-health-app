package com.aihealth.backend.service;

import com.aihealth.backend.dto.ForgotPasswordRequest;
import com.aihealth.backend.dto.ResetPasswordRequest;
import com.aihealth.backend.dto.UserRequest;
import com.aihealth.backend.dto.UserResponse;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.AchievementRepository;
import com.aihealth.backend.repository.CommunityCommentRepository;
import com.aihealth.backend.repository.MedicationReminderRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;
import com.aihealth.backend.repository.GoalLogRepository;
import com.aihealth.backend.repository.GoalRepository;
import com.aihealth.backend.repository.CommunityReactionRepository;
import com.aihealth.backend.repository.CommunityCommentRepository;
import com.aihealth.backend.repository.DailyPromptRepository;

import org.springframework.lang.NonNull;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final MedicationReminderRepository medicationReminderRepository;
    private final AchievementRepository achievementRepository;
    private final GoalLogRepository goalLogRepository;
    private final GoalRepository goalRepository;
    private final CommunityReactionRepository communityReactionRepository;
    private final CommunityCommentRepository communityCommentRepository;
    private final DailyPromptRepository dailyPromptRepository;

    public UserService(
            UserRepository userRepository,
            EmailService emailService,
            MedicationReminderRepository medicationReminderRepository,
            AchievementRepository achievementRepository,
            GoalLogRepository goalLogRepository,
            GoalRepository goalRepository,
            CommunityReactionRepository communityReactionRepository,
            CommunityCommentRepository communityCommentRepository, DailyPromptRepository dailyPromptRepository) {

        this.userRepository = userRepository;
        this.emailService = emailService;
        this.medicationReminderRepository = medicationReminderRepository;
        this.achievementRepository = achievementRepository;
        this.goalLogRepository = goalLogRepository;
        this.goalRepository = goalRepository;
        this.communityReactionRepository = communityReactionRepository;
        this.communityCommentRepository = communityCommentRepository;
        this.dailyPromptRepository = dailyPromptRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserResponse createUser(UserRequest request) {

        // Validate username rules before account creation.
        validateUsername(request.getUsername());

        // Prevent duplicate usernames.
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new RuntimeException("Username is already taken.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User();

        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();

        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        // Email verification defaults
        user.setEmailVerified(false);
        user.setVerificationToken(verificationToken);

        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                verificationToken);

        return mapToResponse(savedUser);
    }

    public UserResponse getUserById(@NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToResponse(user);
    }

    /*
     * Converts User entity into API response DTO.
     */
    private UserResponse mapToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getProfileImageUrl(),
                user.getJournalReminderEnabled(),
                user.getGoalReminderEnabled(),
                user.getMedicationReminderEnabled(),
                user.getCommunityNotificationEnabled(),
                user.getCreatedAt());
    }

    // Verifies a user's email using the token sent during signup.
    public User verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);

        return userRepository.save(user);
    }

    // Deletes the currently authenticated user's account.
    @Transactional
    public void deleteCurrentUser() {

        User user = getCurrentAuthenticatedUser();

        // Delete medication reminders first because they reference the user.
        var medicationReminders = medicationReminderRepository.findByUserId(user.getId());

        if (!medicationReminders.isEmpty()) {
            medicationReminderRepository.deleteAll(medicationReminders);
        }

        // Delete achievements before deleting the user to avoid foreign key errors.
        var achievements = achievementRepository.findByUserId(user.getId());

        if (!achievements.isEmpty()) {
            achievementRepository.deleteAll(achievements);
        }

        // Delete goal progress logs before goals because logs reference both user and
        // goal.
        var goalLogs = goalLogRepository.findByUserId(user.getId());

        if (!goalLogs.isEmpty()) {
            goalLogRepository.deleteAll(goalLogs);
            goalLogRepository.flush();
        }

        // Delete goals after goal logs are removed.
        var goals = goalRepository.findByUserId(user.getId());

        if (!goals.isEmpty()) {
            goalRepository.deleteAll(goals);
            goalRepository.flush();
        }

        // Delete community reactions before deleting the user.
        var communityReactions = communityReactionRepository.findByUserId(user.getId());

        if (!communityReactions.isEmpty()) {
            communityReactionRepository.deleteAll(communityReactions);
            communityReactionRepository.flush();
        }

        // Delete community comments before deleting the user.
        var communityComments = communityCommentRepository.findByUserId(user.getId());

        if (!communityComments.isEmpty()) {
            communityCommentRepository.deleteAll(communityComments);
            communityCommentRepository.flush();
        }

        // Delete daily prompts before deleting the user.
        var dailyPrompts = dailyPromptRepository.findByUserId(user.getId());

        if (!dailyPrompts.isEmpty()) {
            dailyPromptRepository.deleteAll(dailyPrompts);
            dailyPromptRepository.flush();
        }
        // Finally delete the user.
        userRepository.delete(user);
    }

    // Loads the currently authenticated user from JWT.
    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // Resends verification email to unverified users.
    public void resendVerificationEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Verification email sent if account exists."));

        // Do nothing if already verified
        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            return;
        }

        // Generate fresh token
        String verificationToken = UUID.randomUUID().toString();

        user.setVerificationToken(verificationToken);

        userRepository.save(user);

        emailService.sendVerificationEmail(
                user.getEmail(),
                verificationToken);
    }

    /*
     * Starts password reset flow.
     *
     * Security note:
     * We do not reveal whether the email exists.
     * This prevents account enumeration.
     */
    public void forgotPassword(ForgotPasswordRequest request) {

        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    String resetToken = UUID.randomUUID().toString();

                    user.setPasswordResetToken(resetToken);
                    user.setPasswordResetTokenExpiresAt(
                            LocalDateTime.now().plusMinutes(30));

                    userRepository.save(user);

                    emailService.sendPasswordResetEmail(
                            user.getEmail(),
                            resetToken);
                });
    }

    /*
     * Completes password reset using a valid reset token.
     */
    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository
                .findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getPasswordResetTokenExpiresAt() == null
                || user.getPasswordResetTokenExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Invalid or expired reset token");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiresAt(null);

        userRepository.save(user);
    }

    // Updates the current user's profile image URL.
    public UserResponse updateCurrentUserProfileImage(
            String profileImageUrl) {

        User user = getCurrentAuthenticatedUser();

        user.setProfileImageUrl(profileImageUrl);

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    /*
     * Updates the username of the currently authenticated user.
     * Requires current password because username is an account-level change.
     */
    public UserResponse updateCurrentUsername(
            String username,
            String currentPassword) {

        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        validateUsername(username);

        String cleanedUsername = username.trim();

        // Only check uniqueness if username is actually changing.
        if (!user.getUsername().equalsIgnoreCase(cleanedUsername)
                && userRepository.existsByUsernameIgnoreCase(cleanedUsername)) {

            throw new RuntimeException("Username is already taken.");
        }

        user.setUsername(cleanedUsername);

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    /*
     * Validates username rules used throughout the application.
     *
     * Rules:
     * - Required
     * - 3 to 20 characters
     * - Letters, numbers, and underscores only
     */
    private void validateUsername(String username) {

        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username is required.");
        }

        String cleanedUsername = username.trim();

        if (cleanedUsername.length() < 3 ||
                cleanedUsername.length() > 20) {

            throw new RuntimeException(
                    "Username must be between 3 and 20 characters.");
        }

        if (!cleanedUsername.matches("^[a-zA-Z0-9_]+$")) {

            throw new RuntimeException(
                    "Username can only contain letters, numbers, and underscores.");
        }
    }

    /*
     * Changes the currently authenticated user's password.
     *
     * Requires current password so someone cannot change the password
     * just because they found an unlocked session.
     */
    public void changeCurrentUserPassword(
            String currentPassword,
            String newPassword,
            String confirmPassword) {

        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters.");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("New passwords do not match.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    /*
     * Starts secure email change flow.
     * The current email is not changed until the new email is verified.
     */
    public void requestEmailChange(String newEmail, String currentPassword) {
        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        if (newEmail == null || newEmail.trim().isEmpty()) {
            throw new RuntimeException("New email is required.");
        }

        String cleanedEmail = newEmail.trim().toLowerCase();

        if (userRepository.existsByEmail(cleanedEmail)) {
            throw new RuntimeException("Email is already in use.");
        }

        String token = UUID.randomUUID().toString();

        user.setPendingEmail(cleanedEmail);
        user.setEmailChangeToken(token);
        user.setEmailChangeTokenExpiresAt(LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        emailService.sendEmailChangeVerificationEmail(cleanedEmail, token);
    }

    /*
     * Confirms email change after user clicks verification link.
     */
    public UserResponse confirmEmailChange(String token) {
        User user = userRepository.findByEmailChangeToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid email change token."));

        if (user.getEmailChangeTokenExpiresAt() == null
                || user.getEmailChangeTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Email change link has expired.");
        }

        if (user.getPendingEmail() == null || user.getPendingEmail().isBlank()) {
            throw new RuntimeException("No pending email change found.");
        }

        if (userRepository.existsByEmail(user.getPendingEmail())) {
            throw new RuntimeException("Email is already in use.");
        }

        user.setEmail(user.getPendingEmail());
        user.setPendingEmail(null);
        user.setEmailChangeToken(null);
        user.setEmailChangeTokenExpiresAt(null);

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    // Updates whether the current user receives daily journal reminders.
    public UserResponse updateJournalReminderPreference(Boolean enabled) {
        User user = getCurrentAuthenticatedUser();

        user.setJournalReminderEnabled(Boolean.TRUE.equals(enabled));

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    // Updates whether the current user receives goal reminder notifications.
    public UserResponse updateGoalReminderPreference(Boolean enabled) {
        User user = getCurrentAuthenticatedUser();

        user.setGoalReminderEnabled(Boolean.TRUE.equals(enabled));

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    // Updates whether the current user receives medication reminder notifications.
    public UserResponse updateMedicationReminderPreference(Boolean enabled) {
        User user = getCurrentAuthenticatedUser();

        user.setMedicationReminderEnabled(Boolean.TRUE.equals(enabled));

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    // Updates whether the current user receives community notifications.
    public UserResponse updateCommunityNotificationPreference(Boolean enabled) {

        User user = getCurrentAuthenticatedUser();

        user.setCommunityNotificationEnabled(
                Boolean.TRUE.equals(enabled));

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }
}