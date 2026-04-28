package com.aihealth.backend.controller;

import com.aihealth.backend.dto.MemoryProfileRequest;
import com.aihealth.backend.dto.MemoryProfileResponse;
import com.aihealth.backend.model.MemoryProfile;
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

    // Create or update
    @PostMapping("/{userId}")
    public ResponseEntity<MemoryProfileResponse> createOrUpdateProfile(
            @PathVariable Long userId,
            @RequestBody @Valid MemoryProfileRequest request) {

        MemoryProfile profile = new MemoryProfile();

        profile.setFavoritePeople(request.getFavoritePeople());
        profile.setFavoritePlaces(request.getFavoritePlaces());
        profile.setCalmingMemories(request.getCalmingMemories());
        profile.setFavoriteMusic(request.getFavoriteMusic());
        profile.setComfortingActivities(request.getComfortingActivities());
        profile.setTriggersToAvoid(request.getTriggersToAvoid());

        MemoryProfile saved = memoryProfileService.saveOrUpdateMemoryProfile(userId, profile);

        MemoryProfileResponse response = mapToResponse(saved);

        return ResponseEntity.ok(response);
    }

    // Get profile
    @GetMapping("/{userId}")
    public ResponseEntity<MemoryProfileResponse> getProfile(@PathVariable Long userId) {

        MemoryProfile profile = memoryProfileService.getMemoryProfileByUserId(userId);

        MemoryProfileResponse response = mapToResponse(profile);

        return ResponseEntity.ok(response);
    }

    // Mapping method
    private MemoryProfileResponse mapToResponse(MemoryProfile profile) {
        return new MemoryProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getFavoritePeople(),
                profile.getFavoritePlaces(),
                profile.getCalmingMemories(),
                profile.getFavoriteMusic(),
                profile.getComfortingActivities(),
                profile.getTriggersToAvoid(),
                profile.getCreatedAt());
    }
}