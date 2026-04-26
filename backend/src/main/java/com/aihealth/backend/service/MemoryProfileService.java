package com.aihealth.backend.service;

import com.aihealth.backend.model.MemoryProfile;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.MemoryProfileRepository;
import com.aihealth.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

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

    // Create or update memory profile
    public MemoryProfile saveOrUpdateMemoryProfile(Long userId, MemoryProfile profileData) {

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if profile already exists
        Optional<MemoryProfile> existingProfile =
                memoryProfileRepository.findByUserId(userId);

        if (existingProfile.isPresent()) {
            // Update existing profile
            MemoryProfile profile = existingProfile.get();

            profile.setFavoritePeople(profileData.getFavoritePeople());
            profile.setFavoritePlaces(profileData.getFavoritePlaces());
            profile.setCalmingMemories(profileData.getCalmingMemories());
            profile.setFavoriteMusic(profileData.getFavoriteMusic());
            profile.setComfortingActivities(profileData.getComfortingActivities());
            profile.setTriggersToAvoid(profileData.getTriggersToAvoid());

            return memoryProfileRepository.save(profile);

        } else {
            // Create new profile
            profileData.setUser(user);
            return memoryProfileRepository.save(profileData);
        }
    }

    // Get memory profile by user
    public MemoryProfile getMemoryProfileByUserId(Long userId) {
        return memoryProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Memory profile not found"));
    }
}