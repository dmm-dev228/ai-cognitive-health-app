package com.aihealth.backend.service;

import com.aihealth.backend.dto.MemoryProfileRequest;
import com.aihealth.backend.dto.MemoryProfileResponse;
import com.aihealth.backend.model.MemoryProfile;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.MemoryProfileRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MemoryProfileService {

    private final MemoryProfileRepository memoryProfileRepository;
    private final UserRepository userRepository;

    public MemoryProfileService(MemoryProfileRepository memoryProfileRepository,
            UserRepository userRepository) {
        this.memoryProfileRepository = memoryProfileRepository;
        this.userRepository = userRepository;
    }

    public MemoryProfileResponse saveOrUpdateMemoryProfile(MemoryProfileRequest request) {
        User user = getCurrentAuthenticatedUser();

        Optional<MemoryProfile> existingProfile = memoryProfileRepository.findByUserId(user.getId());

        MemoryProfile profile = existingProfile.orElseGet(MemoryProfile::new);

        profile.setUser(user);
        profile.setFavoritePeople(request.getFavoritePeople());
        profile.setFavoritePlaces(request.getFavoritePlaces());
        profile.setCalmingMemories(request.getCalmingMemories());
        profile.setFavoriteMusic(request.getFavoriteMusic());
        profile.setComfortingActivities(request.getComfortingActivities());
        profile.setTriggersToAvoid(request.getTriggersToAvoid());

        if (profile.getCreatedAt() == null) {
            profile.setCreatedAt(LocalDateTime.now());
        }

        MemoryProfile saved = memoryProfileRepository.save(profile);

        return mapToResponse(saved);
    }

    public MemoryProfileResponse getMemoryProfileForCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        MemoryProfile profile = memoryProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Memory profile not found"));

        return mapToResponse(profile);
    }

    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

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

    public MemoryProfile getMemoryProfileEntityByUserId(Long userId) {
        return memoryProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Memory profile not found"));
    }
}