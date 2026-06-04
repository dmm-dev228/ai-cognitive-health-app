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
import java.util.List;

/*
 * NewsService
 * -----------
 * Fetches curated headline-only content from The Guardian Open Platform API.
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

    // Fetches one curated article for each Discover lane.
    public List<NewsArticleResponse> getCommunityHeadlines() {
        return List.of(
                fetchArticleForLane(
                        "personal growth OR habits OR self improvement OR support",
                        "lifeandstyle",
                        "Growth & Support",
                        getGrowthFallback()
                ),
                fetchArticleForLane(
                        "artificial intelligence OR technology OR innovation",
                        "technology|science",
                        "Tech & AI",
                        getTechFallback()
                ),
                fetchArticleForLane(
                        "wellbeing OR resilience OR mindfulness OR gratitude OR healthy habits",
                        "lifeandstyle",
                        "Wellbeing & Resilience",
                        getWellbeingFallback()
                )
        );
    }

    // Fetches one safe Guardian article for a specific Discover lane.
    private NewsArticleResponse fetchArticleForLane(
            String rawQuery,
            String sections,
            String laneLabel,
            NewsArticleResponse fallbackArticle
    ) {
        try {
            String query =
                    URLEncoder.encode(rawQuery, StandardCharsets.UTF_8);

            String requestUrl =
                    "https://content.guardianapis.com/search"
                            + "?q=" + query
                            + "&section=" + sections
                            + "&page-size=15"
                            + "&order-by=newest"
                            + "&show-fields=thumbnail"
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
                return fallbackArticle;
            }

            JsonNode root =
                    objectMapper.readTree(response.body());

            JsonNode results =
                    root.path("response").path("results");

            for (JsonNode result : results) {
                String title =
                        result.path("webTitle").asText();

                String url =
                        result.path("webUrl").asText();

                String imageUrl =
                        result.path("fields")
                                .path("thumbnail")
                                .asText("");

                if (isUnsafeArticle(title, url, laneLabel)) {
                    continue;
                }

                if (!title.isBlank() && !url.isBlank()) {
                    return new NewsArticleResponse(
                            title,
                            url,
                            laneLabel,
                            imageUrl
                    );
                }
            }

            return fallbackArticle;
        } catch (Exception err) {
            return fallbackArticle;
        }
    }

    private NewsArticleResponse getGrowthFallback() {
        return new NewsArticleResponse(
                "Explore supportive ideas for personal growth and steadier routines",
                "https://www.theguardian.com/lifeandstyle",
                "Growth & Support",
                ""
        );
    }

    private NewsArticleResponse getTechFallback() {
        return new NewsArticleResponse(
                "Discover technology and AI stories shaping the future",
                "https://www.theguardian.com/technology/artificialintelligenceai",
                "Tech & AI",
                ""
        );
    }

    private NewsArticleResponse getWellbeingFallback() {
        return new NewsArticleResponse(
                "Find uplifting wellbeing ideas for calmer daily living",
                "https://www.theguardian.com/lifeandstyle/health-and-wellbeing",
                "Wellbeing & Resilience",
                ""
        );
    }

    // Filters out articles that do not fit CogniHaven's calm Discover experience.
    private boolean isUnsafeArticle(
            String title,
            String url,
            String section
    ) {
        String combinedText =
                ((title == null ? "" : title) + " "
                        + (url == null ? "" : url) + " "
                        + (section == null ? "" : section))
                        .toLowerCase();

        String[] blockedTerms = {
                "murder",
                "murdered",
                "homicide",
                "killed",
                "kill",
                "death",
                "dead",
                "shooting",
                "stabbed",
                "attack",
                "attacked",
                "war",
                "bomb",
                "abuse",
                "rape",
                "assault",
                "crime",
                "court",
                "trial",
                "police",
                "terror",
                "violence",
                "violent",
                "suicide",
                "self-harm",
                "scandal",
                "fraud",
                "lawsuit"
        };

        for (String term : blockedTerms) {
            if (combinedText.contains(term)) {
                return true;
            }
        }

        return false;
    }
}