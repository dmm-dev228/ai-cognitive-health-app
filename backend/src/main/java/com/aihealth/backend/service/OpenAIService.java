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
                        String memoryContext,
                        String gamePerformanceContext) {
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

                                Recent Cognitive Wellness Activity:
                                %s

                                User mood:
                                %s

                                User journal entry:
                                %s
                                """
                                .formatted(memoryContext, gamePerformanceContext, mood, journalContent);

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

        /*
         * Generates a supportive, non-medical reflection after a cognitive wellness
         * game.
         *
         * This is separate from journal reflection because game feedback should focus
         * on:
         * - effort
         * - consistency
         * - engagement
         * - encouragement
         *
         * It should NOT diagnose or interpret performance medically.
         */
        public String generateGameReflectionResponse(
                        String gameType,
                        Integer score,
                        Integer correctAnswers,
                        Integer totalQuestions,
                        Integer timeTakenSeconds,
                        String difficulty,
                        String memoryContext,
                        String gamePerformanceContext) {

                String prompt = """
                                You are CogniHaven, a calm, supportive cognitive wellness companion.

                                Personality:
                                - Be warm, encouraging, and grounded.
                                - Speak like a supportive coach or trusted friend.
                                - Keep the response short and easy to understand.
                                - Avoid sounding clinical or overly formal.

                                Safety rules:
                                - You are not a doctor.
                                - Do not diagnose cognitive decline, memory issues, or medical conditions.
                                - Do not make medical claims based on game performance.
                                - Do not say the user is improving or declining unless the data clearly supports a simple wellness trend.
                                - Frame game results as cognitive engagement, routine, and practice.

                                Game result:
                                - Game type: %s
                                - Score: %s%%
                                - Correct answers: %s/%s
                                - Time taken: %s seconds
                                - Difficulty: %s

                                User memory context:
                                %s

                                Recent cognitive wellness activity:
                                %s

                                Response style:
                                - Acknowledge the user's effort.
                                - Reflect on the result in a supportive, non-medical way.
                                - Encourage consistency or gentle practice.
                                - End with one simple follow-up question.
                                - Keep the response under 100 words.
                                """
                                .formatted(
                                                gameType,
                                                score,
                                                correctAnswers,
                                                totalQuestions,
                                                timeTakenSeconds,
                                                difficulty,
                                                memoryContext,
                                                gamePerformanceContext);

                ResponseCreateParams params = ResponseCreateParams.builder()
                                .model("gpt-4.1-mini")
                                .input(prompt)
                                .build();

                Response response = client.responses().create(params);

                if (response.output().isEmpty()) {
                        return "Nice work completing the game. I'm here with you, but I had trouble creating a reflection this time.";
                }

                var firstOutput = response.output().get(0);

                if (firstOutput.asMessage().content().isEmpty()) {
                        return "Nice work completing the game. I had trouble reading the reflection, but your effort still counts.";
                }

                return firstOutput.asMessage()
                                .content()
                                .get(0)
                                .asOutputText()
                                .text();
        }

        /*
         * Generates a supportive AI summary from analytics context.
         *
         * The AI should explain trends in plain language while staying
         * non-medical and wellness-focused.
         */
        public String generateAnalyticsSummaryResponse(String analyticsContext) {

                String prompt = """
                                You are CogniHaven, an AI-powered cognitive wellness and daily support companion.

                                Your job is to explain the user's cognitive wellness game analytics
                                in a warm, supportive, non-medical way.

                                Safety rules:
                                - Do not diagnose.
                                - Do not mention cognitive decline.
                                - Do not make medical claims.
                                - Do not say the user is improving or declining unless the provided data clearly supports it.
                                - Frame results as wellness engagement, consistency, focus, and practice.

                                Analytics context:
                                %s

                                Response style:
                                - Keep it under 120 words.
                                - Explain the trend in simple language.
                                - Mention one encouraging observation.
                                - Suggest one gentle next step.
                                """
                                .formatted(analyticsContext);

                ResponseCreateParams params = ResponseCreateParams.builder()
                                .model("gpt-4.1-mini")
                                .input(prompt)
                                .build();

                Response response = client.responses().create(params);

                if (response.output().isEmpty()) {
                        return "Your analytics are available, but I had trouble creating a summary this time.";
                }

                var firstOutput = response.output().get(0);

                if (firstOutput.asMessage().content().isEmpty()) {
                        return "Your analytics were reviewed, but I had trouble reading the summary.";
                }

                return firstOutput.asMessage()
                                .content()
                                .get(0)
                                .asOutputText()
                                .text();
        }

        /*
         * Generates a supportive AI goal plan.
         *
         * The goal of this response is:
         * - encouragement
         * - realistic habit-building
         * - simple actionable steps
         *
         * NOT:
         * - medical advice
         * - pressure/shaming
         * - unrealistic expectations
         */
        public String generateGoalPlan(
                        String title,
                        String description,
                        String category,
                        Integer targetCount,
                        String unitLabel) {

                String prompt = """
                                You are CogniHaven, a calm and supportive AI wellness companion.

                                Your role:
                                - Help users create realistic wellness goals
                                - Encourage consistency and small progress
                                - Keep advice supportive and practical
                                - Never sound clinical or judgmental

                                Safety rules:
                                - Do not diagnose conditions
                                - Do not provide medical advice
                                - Do not shame the user
                                - Avoid unrealistic expectations

                                Create a short supportive goal plan.

                                Goal Title:
                                %s

                                Goal Description:
                                %s

                                Goal Category:
                                %s

                                Goal Target:
                                %s %s

                                Requirements:
                                - Keep response under 150 words
                                - Break the goal into small manageable actions
                                - Encourage consistency over perfection
                                - End with a gentle motivational statement
                                """
                                .formatted(
                                                title,
                                                description,
                                                category,
                                                targetCount,
                                                unitLabel);

                ResponseCreateParams params = ResponseCreateParams.builder()
                                .model("gpt-4.1-mini")
                                .input(prompt)
                                .build();

                Response response = client.responses().create(params);

                if (response.output().isEmpty()) {
                        return """
                                        Start with small consistent progress.
                                        Small steps can build healthy momentum over time.
                                        """;
                }

                var firstOutput = response.output().get(0);

                if (firstOutput.asMessage().content().isEmpty()) {
                        return """
                                        Focus on consistency and gradual improvement.
                                        Small progress still matters.
                                        """;
                }

                return firstOutput.asMessage()
                                .content()
                                .get(0)
                                .asOutputText()
                                .text();
        }
}