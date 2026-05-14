package com.aihealth.backend.controller;

import com.aihealth.backend.dto.JournalEntryRequest;
import com.aihealth.backend.dto.JournalEntryResponse;
import com.aihealth.backend.service.JournalEntryService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
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

    /*
     * Creates a journal entry for the currently authenticated user.
     * User identity is derived from JWT (no userId passed from frontend).
     */
    @PostMapping
    public ResponseEntity<JournalEntryResponse> createEntry(
            @RequestBody @Valid @NonNull JournalEntryRequest request) {

        JournalEntryResponse response = journalEntryService.createEntry(request);

        return ResponseEntity.ok(response);
    }

    /*
     * Retrieves all journal entries for the currently authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<JournalEntryResponse>> getEntries() {

        List<JournalEntryResponse> responses = journalEntryService.getEntriesByCurrentUser();

        return ResponseEntity.ok(responses);
    }
}