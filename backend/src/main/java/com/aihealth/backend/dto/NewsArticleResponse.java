package com.aihealth.backend.dto;

/*
 * NewsArticleResponse
 * -------------------
 * Safe DTO returned to the frontend.
 */
public class NewsArticleResponse {

    private String title;
    private String url;
    private String section;
    private String imageUrl;

    public NewsArticleResponse() {
    }

    public NewsArticleResponse(
            String title,
            String url,
            String section,
            String imageUrl) {
        this.title = title;
        this.url = url;
        this.section = section;
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getSection() {
        return section;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}