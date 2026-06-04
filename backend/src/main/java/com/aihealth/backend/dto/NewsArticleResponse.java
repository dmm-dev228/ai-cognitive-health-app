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

    public NewsArticleResponse() {
    }

    public NewsArticleResponse(
            String title,
            String url,
            String section
    ) {
        this.title = title;
        this.url = url;
        this.section = section;
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
}