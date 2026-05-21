package com.aihealth.backend.controller;

import com.aihealth.backend.dto.StoryRecallRequest;
import com.aihealth.backend.dto.StoryRecallResponse;
import com.aihealth.backend.service.OpenAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
 * Controller for generating dynamic Story Recall games.
 *
 * This endpoint creates:
 * - random AI-generated target words
 * - a fresh AI-generated story paragraph
 *
 * The frontend will use this before starting the Story Recall game.
 */
@RestController
@RequestMapping("/api/games/story-recall")
public class StoryRecallController {

    private final OpenAIService openAIService;

    public StoryRecallController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    /*
     * Generates a new Story Recall round based on difficulty.
     *
     * EASY = 3 words
     * MEDIUM = 5 words
     * HARD = 7 words
     */
    @PostMapping("/generate")
    public ResponseEntity<StoryRecallResponse> generateStoryRecallGame(
            @RequestBody StoryRecallRequest request) {

        StoryRecallResponse response =
                openAIService.generateStoryRecallGame(request.getDifficulty());

        return ResponseEntity.ok(response);
    }
}