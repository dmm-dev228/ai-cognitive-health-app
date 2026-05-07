package com.aihealth.backend.service;

import com.aihealth.backend.dto.UserRequest;
import com.aihealth.backend.dto.UserResponse;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.lang.NonNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User();

        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();

        user.setUsername(request.getUsername());
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

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
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
    public void deleteCurrentUser() {
        User user = getCurrentAuthenticatedUser();

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
}