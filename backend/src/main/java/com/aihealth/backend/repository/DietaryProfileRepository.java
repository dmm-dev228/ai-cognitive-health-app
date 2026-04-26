package com.aihealth.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aihealth.backend.model.DietaryProfile;

public interface DietaryProfileRepository extends JpaRepository<DietaryProfile, Long> {

    Optional<DietaryProfile> findByUserId(Long userId);
}