package com.aihealth.backend.service;

import com.aihealth.backend.dto.DietaryProfileRequest;
import com.aihealth.backend.dto.DietaryProfileResponse;
import com.aihealth.backend.model.DietaryProfile;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.DietaryProfileRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class DietaryProfileService {
    private final DietaryProfileRepository dietaryProfileRepository;
    private final UserRepository userRepository;

    public DietaryProfileService(DietaryProfileRepository dietaryProfileRepository,
            UserRepository userRepository) {
        this.dietaryProfileRepository = dietaryProfileRepository;
        this.userRepository = userRepository;
    }

    public DietaryProfileResponse saveOrUpdateDietaryProfile(DietaryProfileRequest request) {
        User user = getCurrentAuthenticatedUser();

        Optional<DietaryProfile> existingProfile = dietaryProfileRepository.findByUserId(user.getId());

        DietaryProfile profile = existingProfile.orElseGet(DietaryProfile::new);

        profile.setUser(user);
        profile.setFavoriteFoods(request.getFavoriteFoods());
        profile.setFoodsToAvoid(request.getFoodsToAvoid());
        profile.setAllergies(request.getAllergies());
        profile.setDietaryNotes(request.getDietaryNotes());
        profile.setHydrationReminderPreference(request.getHydrationReminderPreference());

        if (profile.getCreatedAt() == null) {
            profile.setCreatedAt(LocalDateTime.now());
        }

        DietaryProfile saved = dietaryProfileRepository.save(profile);

        return mapToResponse(saved);
    }

    public DietaryProfileResponse getDietaryProfileForCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        DietaryProfile profile = dietaryProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Dietary profile not found"));

        return mapToResponse(profile);
    }

    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private DietaryProfileResponse mapToResponse(DietaryProfile profile) {
        return new DietaryProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getFavoriteFoods(),
                profile.getFoodsToAvoid(),
                profile.getAllergies(),
                profile.getDietaryNotes(),
                profile.getHydrationReminderPreference(),
                profile.getCreatedAt());
    }
}