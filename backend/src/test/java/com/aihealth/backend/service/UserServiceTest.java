package com.aihealth.backend.service;

import com.aihealth.backend.model.User;
import com.aihealth.backend.dto.ForgotPasswordRequest;
import com.aihealth.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.aihealth.backend.dto.ResetPasswordRequest;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private MedicationReminderRepository medicationReminderRepository;
    @Mock
    private AchievementRepository achievementRepository;
    @Mock
    private GoalLogRepository goalLogRepository;
    @Mock
    private GoalRepository goalRepository;
    @Mock
    private CommunityReactionRepository communityReactionRepository;
    @Mock
    private CommunityCommentRepository communityCommentRepository;
    @Mock
    private DailyPromptRepository dailyPromptRepository;
    @Mock
    private JournalEntryRepository journalEntryRepository;
    @Mock
    private ConversationMessageRepository conversationMessageRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void verifyEmailShouldActivateUserAccount() {
        // Arrange
        // Create an unverified user with a verification token.
        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("demarquis");
        user.setEmailVerified(false);
        user.setVerificationToken("valid-token");

        when(userRepository.findByVerificationToken("valid-token"))
                .thenReturn(Optional.of(user));

        when(userRepository.save(user))
                .thenReturn(user);

        // Act
        User verifiedUser = userService.verifyEmail("valid-token");

        // Assert
        // The account should be marked verified and the token should be cleared.
        assertTrue(verifiedUser.getEmailVerified());
        assertNull(verifiedUser.getVerificationToken());

        verify(userRepository).findByVerificationToken("valid-token");
        verify(userRepository).save(user);
    }

    @Test
    void verifyEmailShouldFailWhenTokenIsInvalid() {
        // Arrange
        // Simulate no user being found for the submitted verification token.
        when(userRepository.findByVerificationToken("bad-token"))
                .thenReturn(Optional.empty());

        // Act + Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.verifyEmail("bad-token"));

        assertEquals("Invalid verification token", exception.getMessage());

        verify(userRepository).findByVerificationToken("bad-token");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void forgotPasswordShouldCreateResetTokenWhenEmailExists() {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");

        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(userRepository.save(user))
                .thenReturn(user);

        // Act
        userService.forgotPassword(request);

        // Assert
        assertNotNull(user.getPasswordResetToken());
        assertNotNull(user.getPasswordResetTokenExpiresAt());

        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository).save(user);
        verify(emailService).sendPasswordResetEmail(
                eq("test@example.com"),
                anyString());
    }

    @Test
    void forgotPasswordShouldDoNothingWhenEmailDoesNotExist() {
        // Arrange
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("missing@example.com");

        when(userRepository.findByEmail("missing@example.com"))
                .thenReturn(Optional.empty());

        // Act
        userService.forgotPassword(request);

        // Assert
        verify(userRepository).findByEmail("missing@example.com");
        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(emailService);
    }

    @Test
    void resetPasswordShouldUpdatePasswordWhenTokenIsValid() {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("old-hashed-password");
        user.setPasswordResetToken("valid-reset-token");
        user.setPasswordResetTokenExpiresAt(LocalDateTime.now().plusMinutes(10));

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-reset-token");
        request.setNewPassword("NewPassword123");

        when(userRepository.findByPasswordResetToken("valid-reset-token"))
                .thenReturn(Optional.of(user));

        when(userRepository.save(user))
                .thenReturn(user);

        // Act
        userService.resetPassword(request);

        // Assert
        assertNotEquals("old-hashed-password", user.getPassword());
        assertNull(user.getPasswordResetToken());
        assertNull(user.getPasswordResetTokenExpiresAt());

        verify(userRepository).findByPasswordResetToken("valid-reset-token");
        verify(userRepository).save(user);
    }

    @Test
    void resetPasswordShouldFailWhenTokenDoesNotExist() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("invalid-token");
        request.setNewPassword("NewPassword123");

        when(userRepository.findByPasswordResetToken("invalid-token"))
                .thenReturn(Optional.empty());

        // Act + Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.resetPassword(request));

        assertEquals(
                "Invalid or expired reset token",
                exception.getMessage());

        verify(userRepository).findByPasswordResetToken("invalid-token");
        verify(userRepository, never()).save(any(User.class));
    }
    @Test
void resetPasswordShouldFailWhenTokenIsExpired() {
    // Arrange
    User user = new User();
    user.setPasswordResetToken("expired-token");

    // Token expired 5 minutes ago
    user.setPasswordResetTokenExpiresAt(
            LocalDateTime.now().minusMinutes(5));

    ResetPasswordRequest request = new ResetPasswordRequest();
    request.setToken("expired-token");
    request.setNewPassword("NewPassword123");

    when(userRepository.findByPasswordResetToken("expired-token"))
            .thenReturn(Optional.of(user));

    // Act + Assert
    RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.resetPassword(request));

    assertEquals(
            "Invalid or expired reset token",
            exception.getMessage());

    verify(userRepository).findByPasswordResetToken("expired-token");
    verify(userRepository, never()).save(any(User.class));
}
}