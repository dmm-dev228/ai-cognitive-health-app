package com.aihealth.backend.controller;

import com.aihealth.backend.dto.NewsArticleResponse;
import com.aihealth.backend.service.NewsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * NewsController
 * --------------
 * Provides safe headline-only news content to the frontend.
 *
 * Guardian API calls stay inside the backend so the API key is never exposed.
 */
@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(
            NewsService newsService
    ) {
        this.newsService = newsService;
    }

    // Gets headline-only articles for the community sidebar.
    @GetMapping("/community-headlines")
    public List<NewsArticleResponse> getCommunityHeadlines() {
        return newsService.getCommunityHeadlines();
    }
}