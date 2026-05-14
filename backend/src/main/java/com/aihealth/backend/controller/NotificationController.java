package com.aihealth.backend.controller;

import com.aihealth.backend.dto.NotificationResponse;
import com.aihealth.backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * NotificationController
 * ----------------------
 * Provides in-app notifications for the authenticated user.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Get current in-app notifications.
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        List<NotificationResponse> notifications = notificationService.getNotificationsForCurrentUser();

        return ResponseEntity.ok(notifications);
    }
}