package com.aihealth.backend.repository;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aihealth.backend.model.JournalEntry;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    long countByUserId(Long userId);

    List<JournalEntry> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<JournalEntry> findByUserIdAndCreatedAtBetween(
            Long userId,
            LocalDateTime start,
            LocalDateTime end);
}