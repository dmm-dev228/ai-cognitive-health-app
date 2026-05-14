package com.aihealth.backend.controller;

import com.aihealth.backend.dto.MemoryProfileRequest;
import com.aihealth.backend.dto.MemoryProfileResponse;
import com.aihealth.backend.service.MemoryProfileService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/memory-profile")
public class MemoryProfileController {

    private final MemoryProfileService memoryProfileService;

    public MemoryProfileController(MemoryProfileService memoryProfileService) {
        this.memoryProfileService = memoryProfileService;
    }

    // Create or update memory profile for currently authenticated user
    @PostMapping
    public ResponseEntity<MemoryProfileResponse> createOrUpdateProfile(
            @RequestBody @Valid MemoryProfileRequest request) {

        MemoryProfileResponse response =
                memoryProfileService.saveOrUpdateMemoryProfile(request);

        return ResponseEntity.ok(response);
    }

    // Get memory profile for currently authenticated user
    @GetMapping
    public ResponseEntity<MemoryProfileResponse> getProfile() {

        MemoryProfileResponse response =
                memoryProfileService.getMemoryProfileForCurrentUser();

        return ResponseEntity.ok(response);
    }
}