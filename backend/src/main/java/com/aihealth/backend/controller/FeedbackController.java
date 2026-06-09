package com.aihealth.backend.controller;

import com.aihealth.backend.dto.FeedbackRequest;
import com.aihealth.backend.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
 * FeedbackController
 * ------------------
 * Handles public feedback submissions from the home page.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final EmailService emailService;

    public FeedbackController(EmailService emailService) {
        this.emailService = emailService;
    }

    /*
     * Sends submitted feedback to the app owner.
     */
    @PostMapping
    public ResponseEntity<String> submitFeedback(@RequestBody FeedbackRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Feedback message cannot be empty.");
        }

        emailService.sendFeedbackEmail(request.getMessage());

        return ResponseEntity.ok("Thank you for helping improve CogniHaven.");
    }
}