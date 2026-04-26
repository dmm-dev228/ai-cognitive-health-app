package com.aihealth.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aihealth.backend.model.JournalEntry;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    List<JournalEntry> findByUserId(Long userId);
}