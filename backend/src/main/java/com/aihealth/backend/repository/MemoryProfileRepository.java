package com.aihealth.backend.repository;

import com.aihealth.backend.model.MemoryProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemoryProfileRepository extends JpaRepository<MemoryProfile, Long> {

    Optional<MemoryProfile> findByUserId(Long userId);
}