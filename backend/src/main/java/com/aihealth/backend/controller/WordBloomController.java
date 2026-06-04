package com.aihealth.backend.controller;

import com.aihealth.backend.dto.WordBloomRequest;
import com.aihealth.backend.dto.WordBloomResponse;
import com.aihealth.backend.service.OpenAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games/word-bloom")
@CrossOrigin(origins = "http://localhost:5173")
public class WordBloomController {

    private final OpenAIService openAIService;

    public WordBloomController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    // Generate a new Word Bloom game.
    @PostMapping("/generate")
    public ResponseEntity<WordBloomResponse> generateWordBloomGame(
            @RequestBody WordBloomRequest request) {

        WordBloomResponse response =
                openAIService.generateWordBloomGame(request.getDifficulty());

        return ResponseEntity.ok(response);
    }
}