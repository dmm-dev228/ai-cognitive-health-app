package com.aihealth.backend.controller;

import com.aihealth.backend.dto.JournalEntryRequest;
import com.aihealth.backend.dto.JournalEntryResponse;
import com.aihealth.backend.service.JournalEntryService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/journal")
public class JournalEntryController {

    private final JournalEntryService journalEntryService;

    public JournalEntryController(JournalEntryService journalEntryService) {
        this.journalEntryService = journalEntryService;
    }

    // Create journal entry
    @PostMapping("/{userId}")
    public ResponseEntity<JournalEntryResponse> createEntry(
            @PathVariable Long userId,
            @RequestBody @Valid JournalEntryRequest request) {

        JournalEntryResponse response =
                journalEntryService.createEntry(userId, request);

        return ResponseEntity.ok(response);
    }

    // Get all journal entries for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<JournalEntryResponse>> getEntries(
            @PathVariable Long userId) {

        List<JournalEntryResponse> responses =
                journalEntryService.getEntriesByUser(userId);

        return ResponseEntity.ok(responses);
    }
}