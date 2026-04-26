package com.aihealth.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aihealth.backend.model.MedicationReminder;

public interface MedicationReminderRepository extends JpaRepository<MedicationReminder, Long> {

    List<MedicationReminder> findByUserId(Long userId);
}