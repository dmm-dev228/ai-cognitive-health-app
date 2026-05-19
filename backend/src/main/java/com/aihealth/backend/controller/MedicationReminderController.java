package com.aihealth.backend.controller;

import com.aihealth.backend.dto.MedicationReminderRequest;
import com.aihealth.backend.service.MedicationReminderService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * MedicationReminderController
 * ----------------------------
 * Exposes REST endpoints for medication reminders.
 * Uses JWT authentication (no userId in routes).
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/medication-reminders")
public class MedicationReminderController {

    private final MedicationReminderService medicationReminderService;

    public MedicationReminderController(MedicationReminderService medicationReminderService) {
        this.medicationReminderService = medicationReminderService;
    }

    // Create a new reminder
    @PostMapping
    public ResponseEntity<MedicationReminderResponse> createReminder(
            @Valid @RequestBody MedicationReminderRequest request) {

        MedicationReminderResponse response = medicationReminderService.saveReminder(request);

        return ResponseEntity.ok(response);
    }

    // Get all reminders for current user
    @GetMapping
    public ResponseEntity<List<MedicationReminderResponse>> getReminders() {

        List<MedicationReminderResponse> responses = medicationReminderService.getRemindersForCurrentUser();

        return ResponseEntity.ok(responses);
    }

    // Update an existing reminder
    @PutMapping("/{id}")
    public ResponseEntity<MedicationReminderResponse> updateReminder(
            @PathVariable Long id,
            @Valid @RequestBody MedicationReminderRequest request) {

        MedicationReminderResponse response = medicationReminderService.updateReminder(id, request);

        return ResponseEntity.ok(response);
    }

    // Delete a reminder
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {

        medicationReminderService.deleteReminder(id);

        return ResponseEntity.noContent().build();
    }

    // Toggle active status
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<MedicationReminderResponse> toggleReminder(
            @PathVariable Long id) {

        MedicationReminderResponse response = medicationReminderService.toggleActive(id);

        return ResponseEntity.ok(response);
    }
}