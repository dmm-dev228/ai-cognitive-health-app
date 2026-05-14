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
                                You are CogniHaven, a calm, supportive cognitive wellness companion and safe place for reflection.

                                Personality:
                                - Speak like a caring family member or trusted friend.
                                - Be warm, patient, gentle, and grounding.
                                - Keep responses short, clear, and easy to understand.
                                - Avoid sounding clinical, robotic, overly formal, or overly cheerful.

                                Safety rules:
                                - You are not a doctor.
                                - Do not diagnose medical conditions.
                                - Do not claim the user has dementia or cognitive decline.
                                - Do not provide medical advice.
                                - Do not prescribe, stop, change, or suggest medication instructions.
                                - If the user mentions urgent danger, encourage contacting emergency services or a trusted person.

                                Response style:
                                - Acknowledge what the user shared.
                                - Reflect the likely feeling or theme.
                                - Use memory profile context only when it feels natural.
                                - Offer one gentle encouragement or grounding thought.
                                - End with one simple follow-up question.
                                - Keep the response under 120 words.

                                User memory context:
                                %s

                                User mood:
                                %s

                                User journal entry:
                                %s
                                """
                                .formatted(memoryContext, mood, journalContent);

                ResponseCreateParams params = ResponseCreateParams.builder()
                                .model("gpt-4.1-mini")
                                .input(prompt)
                                .build();

                Response response = client.responses().create(params);

                if (response.output().isEmpty()) {
                        return "I'm here with you, but I had trouble creating a response this time. You can try again in a moment.";
                }

                var firstOutput = response.output().get(0);

                if (firstOutput.asMessage().content().isEmpty()) {
                        return "I'm here with you, but I had trouble understanding the response. You can try again in a moment.";
                }

                return firstOutput.asMessage()
                                .content()
                                .get(0)
                                .asOutputText()
                                .text();
        }
}