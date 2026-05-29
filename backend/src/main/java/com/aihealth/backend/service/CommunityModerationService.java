package com.aihealth.backend.service;

import com.aihealth.backend.model.CommunityModerationResult;
import org.springframework.stereotype.Service;

/*
 * CommunityModerationService
 * --------------------------
 * Central AI moderation layer for community posts and comments.
 */
@Service
public class CommunityModerationService {

    private final OpenAIService openAIService;

    public CommunityModerationService(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    public CommunityModerationResult moderateContent(String content) {

        String result =
                openAIService.moderateCommunityContent(content);

        try {
            return CommunityModerationResult.valueOf(result);
        } catch (Exception ex) {
            return CommunityModerationResult.NEEDS_REVISION;
        }
    }
}