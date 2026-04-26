package com.aihealth.backend.controller;

import com.aihealth.backend.model.MemoryProfile;
import com.aihealth.backend.service.MemoryProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memory-profile")
public class MemoryProfileController {

    private final MemoryProfileService memoryProfileService;

    public MemoryProfileController(MemoryProfileService memoryProfileService) {
        this.memoryProfileService = memoryProfileService;
    }

    // Create or update memory profile
    @PostMapping("/{userId}")
    public ResponseEntity<MemoryProfile> createOrUpdateProfile(
            @PathVariable Long userId,
            @RequestBody MemoryProfile profileData) {

        MemoryProfile savedProfile =
                memoryProfileService.saveOrUpdateMemoryProfile(userId, profileData);

        return ResponseEntity.ok(savedProfile);
    }

    // Get memory profile by user
    @GetMapping("/{userId}")
    public ResponseEntity<MemoryProfile> getProfile(@PathVariable Long userId) {

        MemoryProfile profile =
                memoryProfileService.getMemoryProfileByUserId(userId);

        return ResponseEntity.ok(profile);
    }
}