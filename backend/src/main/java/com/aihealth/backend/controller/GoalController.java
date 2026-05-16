package com.aihealth.backend.controller;

import com.aihealth.backend.dto.GoalLogRequest;
import com.aihealth.backend.dto.GoalLogResponse;
import com.aihealth.backend.dto.GoalRequest;
import com.aihealth.backend.dto.GoalResponse;
import com.aihealth.backend.service.GoalService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * GoalController
 * --------------
 * REST endpoints for MyGoals.
 *
 * All routes are JWT-protected by SecurityConfig.
 */
@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:5173")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    /*
     * Create a new wellness goal.
     */
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @Valid @RequestBody GoalRequest request) {

        return ResponseEntity.ok(goalService.createGoal(request));
    }

    /*
     * Get all goals for the logged-in user.
     */
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getGoals() {
        return ResponseEntity.ok(goalService.getGoals());
    }

    /*
     * Log progress toward a specific goal.
     */
    @PostMapping("/{goalId}/logs")
    public ResponseEntity<GoalLogResponse> logProgress(
            @PathVariable Long goalId,
            @Valid @RequestBody GoalLogRequest request) {

        return ResponseEntity.ok(goalService.logProgress(goalId, request));
    }
}