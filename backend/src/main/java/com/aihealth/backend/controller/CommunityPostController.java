package com.aihealth.backend.controller;

import com.aihealth.backend.dto.CommunityPostRequest;
import com.aihealth.backend.dto.CommunityPostResponse;
import com.aihealth.backend.service.CommunityPostService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * CommunityPostController
 * -----------------------
 * REST endpoints for the community feed.
 */
@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "http://localhost:5173")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    public CommunityPostController(
            CommunityPostService communityPostService) {

        this.communityPostService = communityPostService;
    }

    // Creates a new community post.
    @PostMapping
    public ResponseEntity<CommunityPostResponse> createPost(
            @Valid @RequestBody CommunityPostRequest request) {

        CommunityPostResponse response =
                communityPostService.createPost(request);

        return ResponseEntity.ok(response);
    }

    // Returns all community posts newest first.
    @GetMapping
    public ResponseEntity<List<CommunityPostResponse>> getAllPosts() {

        List<CommunityPostResponse> responses =
                communityPostService.getAllPosts();

        return ResponseEntity.ok(responses);
    }
}