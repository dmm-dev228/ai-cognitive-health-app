package com.aihealth.backend.service;

import com.aihealth.backend.dto.MedicationReminderRequest;
import com.aihealth.backend.dto.MedicationReminderResponse;
import com.aihealth.backend.model.MedicationReminder;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.MedicationReminderRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/*
 * MedicationReminderService
 * -------------------------
 * Handles business logic for medication reminders.
 * Uses JWT authentication to associate reminders with the current user.
 */
@Service
public class MedicationReminderService {

    private final MedicationReminderRepository medicationReminderRepository;
    private final UserRepository userRepository;

    public MedicationReminderService(MedicationReminderRepository medicationReminderRepository,
            UserRepository userRepository) {
        this.medicationReminderRepository = medicationReminderRepository;
        this.userRepository = userRepository;
    }

    // Create a new medication reminder for the authenticated user.
    public MedicationReminderResponse saveReminder(MedicationReminderRequest request) {
        User user = getCurrentAuthenticatedUser();

        MedicationReminder reminder = new MedicationReminder();

        reminder.setUser(user);
        reminder.setMedicationName(request.getMedicationName());
        reminder.setDosage(request.getDosage());
        reminder.setPillShape(request.getPillShape());
        reminder.setPillColor(request.getPillColor());
        reminder.setPillSize(request.getPillSize());
        reminder.setReminderTime(request.getReminderTime());
        reminder.setFrequency(request.getFrequency());
        reminder.setNotes(request.getNotes());
        reminder.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        reminder.setInAppReminderEnabled(
                request.getInAppReminderEnabled() != null ? request.getInAppReminderEnabled() : true);
        reminder.setEmailReminderEnabled(
                request.getEmailReminderEnabled() != null ? request.getEmailReminderEnabled() : false);
        reminder.setSmsReminderEnabled(
                request.getSmsReminderEnabled() != null ? request.getSmsReminderEnabled() : false);

        reminder.setCreatedAt(LocalDateTime.now());
        reminder.setUpdatedAt(LocalDateTime.now());

        MedicationReminder saved = medicationReminderRepository.save(reminder);

        return mapToResponse(saved);
    }

    // Get all reminders owned by the authenticated user.
    public List<MedicationReminderResponse> getRemindersForCurrentUser() {
        User user = getCurrentAuthenticatedUser();

        return medicationReminderRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update an existing reminder if it belongs to the authenticated user.
    public MedicationReminderResponse updateReminder(Long id, MedicationReminderRequest request) {
        User user = getCurrentAuthenticatedUser();

        MedicationReminder reminder = medicationReminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        reminder.setMedicationName(request.getMedicationName());
        reminder.setDosage(request.getDosage());
        reminder.setPillShape(request.getPillShape());
        reminder.setPillColor(request.getPillColor());
        reminder.setPillSize(request.getPillSize());
        reminder.setReminderTime(request.getReminderTime());
        reminder.setFrequency(request.getFrequency());
        reminder.setNotes(request.getNotes());
        reminder.setInAppReminderEnabled(
                request.getInAppReminderEnabled() != null ? request.getInAppReminderEnabled() : true);
        reminder.setEmailReminderEnabled(
                request.getEmailReminderEnabled() != null ? request.getEmailReminderEnabled() : false);
        reminder.setSmsReminderEnabled(
                request.getSmsReminderEnabled() != null ? request.getSmsReminderEnabled() : false);

        reminder.setUpdatedAt(LocalDateTime.now());

        MedicationReminder updated = medicationReminderRepository.save(reminder);

        return mapToResponse(updated);
    }

    // Delete a reminder if it belongs to the authenticated user.
    public void deleteReminder(Long id) {
        User user = getCurrentAuthenticatedUser();

        MedicationReminder reminder = medicationReminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        medicationReminderRepository.delete(reminder);
    }

    // Enable or disable a reminder.
    public MedicationReminderResponse toggleActive(Long id) {
        User user = getCurrentAuthenticatedUser();

        MedicationReminder reminder = medicationReminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        if (!reminder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        reminder.setIsActive(!Boolean.TRUE.equals(reminder.getIsActive()));
        reminder.setUpdatedAt(LocalDateTime.now());

        MedicationReminder updated = medicationReminderRepository.save(reminder);

        return mapToResponse(updated);
    }

    // Load current user from JWT security context.
    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // Convert entity to safe frontend response.
    private MedicationReminderResponse mapToResponse(MedicationReminder reminder) {
        return new MedicationReminderResponse(
                reminder.getId(),
                reminder.getUser().getId(),
                reminder.getMedicationName(),
                reminder.getDosage(),
                reminder.getPillShape(),
                reminder.getPillColor(),
                reminder.getPillSize(),
                reminder.getReminderTime(),
                reminder.getFrequency(),
                reminder.getNotes(),
                reminder.getIsActive(),
                reminder.getInAppReminderEnabled(),
                reminder.getEmailReminderEnabled(),
                reminder.getSmsReminderEnabled(),
                reminder.getCreatedAt(),
                reminder.getUpdatedAt());
    }
}