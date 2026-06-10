package com.aihealth.backend.controller;

import com.aihealth.backend.dto.UpdateProfileImageRequest;
import com.aihealth.backend.dto.UserRequest;
import com.aihealth.backend.dto.UserResponse;
import com.aihealth.backend.service.ProfileImageService;
import com.aihealth.backend.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @PostMapping("/me/profile-image/upload")
    public ResponseEntity<UserResponse> uploadCurrentUserProfileImage(
            @RequestParam("file") MultipartFile file) {

        String profileImageUrl = profileImageService.uploadProfileImage(file);

        UserResponse response =
                userService.updateCurrentUserProfileImage(profileImageUrl);

        return ResponseEntity.ok(response);
    }
}