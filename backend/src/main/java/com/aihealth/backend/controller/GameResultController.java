package com.aihealth.backend.controller;

import com.aihealth.backend.dto.GameResultRequest;
import com.aihealth.backend.dto.GameResultResponse;
import com.aihealth.backend.service.GameResultService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * GameResultController
 * --------------------
 * REST endpoints for saving and retrieving game results.
 * All endpoints are JWT-protected by SecurityConfig.
 */
@RestController
@RequestMapping("/api/game-results")
public class GameResultController {

    private final GameResultService gameResultService;

    public GameResultController(GameResultService gameResultService) {
        this.gameResultService = gameResultService;
    }

    /*
     * Save a completed game result for the logged-in user.
     */
    @PostMapping
    public GameResultResponse saveGameResult(
            @RequestBody GameResultRequest request) {

        return gameResultService.saveGameResult(request);
    }

    //Get all game results for the logged-in user.
    @GetMapping
    public List<GameResultResponse> getGameResults() {
        return gameResultService.getGameResultsForCurrentUser();
    }
}