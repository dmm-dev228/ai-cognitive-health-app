package com.aihealth.backend.controller;

import com.aihealth.backend.dto.UserRequest;
import com.aihealth.backend.dto.UserResponse;
import com.aihealth.backend.service.UserService;
import com.aihealth.backend.dto.UpdateProfileImageRequest;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    // Updates the currently authenticated user's profile image.
    @PutMapping("/me/profile-image")
    public ResponseEntity<UserResponse> updateCurrentUserProfileImage(
            @RequestBody UpdateProfileImageRequest request) {

        UserResponse response = userService.updateCurrentUserProfileImage(
                request.getProfileImageUrl());

        return ResponseEntity.ok(response);
    }
}