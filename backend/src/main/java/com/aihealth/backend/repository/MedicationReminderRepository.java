package com.aihealth.backend.repository;

import com.aihealth.backend.model.MedicationReminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
 * MedicationReminderRepository
 * ----------------------------
 * Handles database operations for medication reminders.
 * Allows fetching reminders per user.
 */
public interface MedicationReminderRepository extends JpaRepository<MedicationReminder, Long> {

    // Get all reminders for a specific user
    List<MedicationReminder> findByUserId(Long userId);
}