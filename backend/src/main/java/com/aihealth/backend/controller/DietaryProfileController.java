package com.aihealth.backend.controller;

import com.aihealth.backend.dto.DietaryProfileRequest;
import com.aihealth.backend.dto.DietaryProfileResponse;
import com.aihealth.backend.service.DietaryProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dietary-profile")
public class DietaryProfileController {

private final DietaryProfileService dietaryProfileService;

public DietaryProfileController(DietaryProfileService dietaryProfileService) {
    this.dietaryProfileService = dietaryProfileService;
}

@PostMapping
public ResponseEntity<DietaryProfileResponse> saveOrUpdateProfile(
        @RequestBody DietaryProfileRequest request) {

    DietaryProfileResponse response =
            dietaryProfileService.saveOrUpdateDietaryProfile(request);

    return ResponseEntity.ok(response);
}

@GetMapping
public ResponseEntity<DietaryProfileResponse> getProfile() {

    DietaryProfileResponse response =
            dietaryProfileService.getDietaryProfileForCurrentUser();

    return ResponseEntity.ok(response);
}

}