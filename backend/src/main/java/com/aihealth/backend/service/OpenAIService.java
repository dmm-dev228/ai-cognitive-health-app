package com.aihealth.backend.service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenAIService {

    private final OpenAIClient client;

    public OpenAIService(@Value("${openai.api.key}") String apiKey) {
        this.client = OpenAIOkHttpClient.builder()
                .apiKey(apiKey)
                .build();
    }

    public String generateSupportiveJournalResponse(String journalContent,
            String mood,
            String memoryContext) {
        String prompt = """
                You are CogniCare, a warm, supportive cognitive wellness companion.

                Important rules:
                - Do not diagnose medical conditions.
                - Do not provide medical advice.
                - Do not prescribe or change medication.
                - Do not claim the user has dementia or cognitive decline.
                - Respond with emotional support, gentle reflection, and routine encouragement.
                - Keep the response kind, clear, and concise.
                - You speak like a caring family member or close friend.
                - You help users reflect, feel understood, and stay grounded.
                - You are not a doctor and do not provide medical advice.

                User memory context:
                %s

                User mood:
                %s

                User journal entry:
                %s
                """.formatted(memoryContext, mood, journalContent);

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model("gpt-4.1-mini")
                .input(prompt)
                .build();

        Response response = client.responses().create(params);

        return response.output()
                .get(0)
                .asMessage()
                .content()
                .get(0)
                .asOutputText()
                .text();
    }
}