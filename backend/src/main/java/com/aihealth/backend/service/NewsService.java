package com.aihealth.backend.service;

import com.aihealth.backend.dto.NewsArticleResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/*
 * NewsService
 * -----------
 * Fetches safe headline-only content from The Guardian Open Platform API.
 *
 * API keys stay on the backend so the frontend never exposes credentials.
 */
@Service
public class NewsService {

    private final String guardianApiKey;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public NewsService(
            @Value("${guardian.api.key}") String guardianApiKey
    ) {
        this.guardianApiKey = guardianApiKey;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newHttpClient();
    }

    // Fetches calm headline-only articles for the Community sidebar.
    public List<NewsArticleResponse> getCommunityHeadlines() {
        try {
            String query = URLEncoder.encode(
                    "wellbeing OR science OR technology OR environment",
                    StandardCharsets.UTF_8
            );

            String requestUrl =
                    "https://content.guardianapis.com/search"
                            + "?q=" + query
                            + "&section=science|technology|environment|lifeandstyle"
                            + "&page-size=5"
                            + "&order-by=newest"
                            + "&api-key=" + guardianApiKey;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(requestUrl))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return getFallbackHeadlines();
            }

            JsonNode root =
                    objectMapper.readTree(response.body());

            JsonNode results =
                    root.path("response").path("results");

            List<NewsArticleResponse> articles =
                    new ArrayList<>();

            for (JsonNode result : results) {
                String title =
                        result.path("webTitle").asText();

                String url =
                        result.path("webUrl").asText();

                String section =
                        result.path("sectionName").asText();

                if (!title.isBlank() && !url.isBlank()) {
                    articles.add(
                            new NewsArticleResponse(
                                    title,
                                    url,
                                    section
                            )
                    );
                }
            }

            if (articles.isEmpty()) {
                return getFallbackHeadlines();
            }

            return articles;
        } catch (Exception err) {
            return getFallbackHeadlines();
        }
    }

    // Keeps the UI useful if the external API is unavailable.
    private List<NewsArticleResponse> getFallbackHeadlines() {
        return List.of(
                new NewsArticleResponse(
                        "Small daily routines can support steadier wellness habits",
                        "https://www.theguardian.com",
                        "Wellness"
                ),
                new NewsArticleResponse(
                        "Science and technology continue shaping healthier daily tools",
                        "https://www.theguardian.com",
                        "Science"
                ),
                new NewsArticleResponse(
                        "Community spaces can help people feel more connected",
                        "https://www.theguardian.com",
                        "Community"
                )
        );
    }
}