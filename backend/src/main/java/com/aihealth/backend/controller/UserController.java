package com.aihealth.backend.controller;

import com.aihealth.backend.dto.UpdateProfileImageRequest;
import com.aihealth.backend.dto.UserRequest;
import com.aihealth.backend.dto.UserResponse;
import com.aihealth.backend.service.ProfileImageService;
import com.aihealth.backend.service.UserService;
import com.aihealth.backend.dto.UpdateUsernameRequest;
import com.aihealth.backend.dto.ChangePasswordRequest;
import com.aihealth.backend.dto.EmailChangeRequest;
import com.aihealth.backend.dto.UpdateCommunityNotificationRequest;
import com.aihealth.backend.dto.UpdateGoalReminderRequest;
import com.aihealth.backend.dto.UpdateJournalReminderRequest;
import com.aihealth.backend.dto.UpdateMedicationReminderRequest;
import com.aihealth.backend.dto.UpdateCommunityNotificationRequest;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ProfileImageService profileImageService;

    public UserController(
            UserService userService,
            ProfileImageService profileImageService) {

        this.userService = userService;
        this.profileImageService = profileImageService;
    }

    // Create user (register)
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody @Valid UserRequest request) {

        UserResponse response = userService.createUser(request);

        return ResponseEntity.ok(response);
    }

    // Get user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable @NonNull Long userId) {

        UserResponse response = userService.getUserById(userId);

        return ResponseEntity.ok(response);
    }

    // Deletes the currently authenticated user's account.
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser() {
        userService.deleteCurrentUser();

        return ResponseEntity.noContent().build();
    }

    // Updates the currently authenticated user's profile image from a URL.
    @PutMapping("/me/profile-image")
    public ResponseEntity<UserResponse> updateCurrentUserProfileImage(
            @RequestBody UpdateProfileImageRequest request) {

        UserResponse response = userService.updateCurrentUserProfileImage(
                request.getProfileImageUrl());

        return ResponseEntity.ok(response);
    }

    /*
     * Uploads a selected image file to Cloudinary.
     * Cloudinary returns a permanent secure URL.
     * That URL is then saved on the authenticated user.
     */
    @PostMapping(value = "/me/profile-image/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> uploadCurrentUserProfileImage(
            @RequestParam("file") MultipartFile file) {

        String profileImageUrl = profileImageService.uploadProfileImage(file);

        UserResponse response = userService.updateCurrentUserProfileImage(profileImageUrl);

        return ResponseEntity.ok(response);
    }

    // Updates the currently authenticated user's username.
    @PutMapping("/me/username")
    public ResponseEntity<UserResponse> updateCurrentUsername(
            @RequestBody UpdateUsernameRequest request) {

        UserResponse response = userService.updateCurrentUsername(
                request.getUsername(),
                request.getCurrentPassword());

        return ResponseEntity.ok(response);
    }

    // Changes the currently authenticated user's password.
    @PutMapping("/me/password")
    public ResponseEntity<String> changeCurrentUserPassword(
            @RequestBody ChangePasswordRequest request) {

        userService.changeCurrentUserPassword(
                request.getCurrentPassword(),
                request.getNewPassword(),
                request.getConfirmPassword());

        return ResponseEntity.ok("Password updated successfully.");
    }

    // Starts a secure email change flow.
    // The email is not changed until the new address is verified.
    @PostMapping("/me/email-change-request")
    public ResponseEntity<String> requestEmailChange(
            @RequestBody EmailChangeRequest request) {

        userService.requestEmailChange(
                request.getNewEmail(),
                request.getCurrentPassword());

        return ResponseEntity.ok(
                "Verification email sent to your new email address.");
    }

    // Confirms email change after the user clicks the verification link.
    @GetMapping("/confirm-email-change")
    public ResponseEntity<UserResponse> confirmEmailChange(
            @RequestParam String token) {

        UserResponse response = userService.confirmEmailChange(token);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/journal-reminder")
    public ResponseEntity<UserResponse> updateJournalReminderPreference(
            @RequestBody UpdateJournalReminderRequest request) {

        UserResponse response = userService.updateJournalReminderPreference(
                request.getJournalReminderEnabled());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/goal-reminder")
    public ResponseEntity<UserResponse> updateGoalReminderPreference(
            @RequestBody UpdateGoalReminderRequest request) {

        UserResponse response = userService.updateGoalReminderPreference(
                request.getGoalReminderEnabled());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/medication-reminder")
    public ResponseEntity<UserResponse> updateMedicationReminderPreference(
            @RequestBody UpdateMedicationReminderRequest request) {

        UserResponse response = userService.updateMedicationReminderPreference(
                request.getMedicationReminderEnabled());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/community-notifications")
public ResponseEntity<UserResponse> updateCommunityNotificationPreference(
        @RequestBody UpdateCommunityNotificationRequest request) {

    UserResponse response =
            userService.updateCommunityNotificationPreference(
                    request.getCommunityNotificationEnabled());

    return ResponseEntity.ok(response);
}
}