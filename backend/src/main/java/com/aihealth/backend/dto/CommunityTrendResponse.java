package com.aihealth.backend.dto;

/*
 * CommunityTrendResponse
 * ----------------------
 * Represents a dynamic community category trend.
 */
public class CommunityTrendResponse {

    private String category;
    private Long count;

    public CommunityTrendResponse() {
    }

    public CommunityTrendResponse(
            String category,
            Long count
    ) {
        this.category = category;
        this.count = count;
    }

    public String getCategory() {
        return category;
    }

    public Long getCount() {
        return count;
    }
}