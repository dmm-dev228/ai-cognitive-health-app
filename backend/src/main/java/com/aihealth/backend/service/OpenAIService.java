package com.aihealth.backend.service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import com.aihealth.backend.dto.StoryRecallResponse;
import com.aihealth.backend.dto.WordBloomResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    /*
     * Existing method kept so current controllers/services do not break.
     */
    public String generateSupportiveJournalResponse(
            String title,
            String journalContent,
            String mood,
            String memoryContext,
            String gamePerformanceContext) {

        return generateSupportiveJournalResponse(
                title,
                journalContent,
                mood,
                memoryContext,
                gamePerformanceContext,
                "");
    }

    /*
     * Improved journal response generator.
     *
     * Main improvements:
     * - Treats journal content as the highest priority
     * - Treats title as low-priority metadata
     * - Supports recent conversation history
     * - Avoids scripted openings
     * - Answers direct questions directly
     * - Uses memory only when relevant
     * - Feels more like an ongoing companion conversation
     */
    public String generateSupportiveJournalResponse(
            String title,
            String journalContent,
            String mood,
            String memoryContext,
            String gamePerformanceContext,
            String recentConversationContext) {

        String safeTitle = normalizeContext(title);
        String safeJournalContent = normalizeContext(journalContent);
        String safeMood = normalizeContext(mood);
        String safeMemoryContext = normalizeContext(memoryContext);
        String safeGamePerformanceContext = normalizeContext(gamePerformanceContext);
        String safeRecentConversationContext = normalizeContext(recentConversationContext);

        String prompt = """
                You are CogniHaven, a calm AI-powered cognitive wellness and daily support companion.

                Your role:
                - Respond like a steady, warm, emotionally safe companion.
                - Continue the conversation naturally.
                - Make the user feel heard, not analyzed.
                - Be supportive without sounding fake, clinical, or overly cheerful.
                - Keep the response concise and human.

                Safety rules:
                - You are not a medical tool.
                - Do not diagnose.
                - Do not say the user has dementia, cognitive decline, depression, anxiety, or any medical condition.
                - Do not provide medical advice.
                - Do not suggest medication changes.
                - If the user mentions immediate danger, self-harm, harm to others, or emergency risk, gently encourage contacting emergency services or a trusted person right away.

                Priority rules:
                1. The latest user message is the highest priority.
                2. Recent conversation history is second priority.
                3. Mood is only a secondary signal.
                4. Memory context is optional and should only be used if clearly relevant.
                5. Journal title is only a label and should almost never drive the response.

                Conversation rules:
                - Do not restart the conversation if recent conversation history exists.
                - Do not greet repeatedly.
                - Do not force a question at the end.
                - Do not follow the same reflect-encourage-question pattern every time.
                - If the user asks a direct question, answer it directly first.
                - If the user asks if you are listening, respond as if you are actively present.
                - If the user shares anger, stress, sadness, or overwhelm, validate the emotion first.
                - If the user shares something casual, respond casually.
                - Do not redirect to games, analytics, reminders, or app features unless the user asks.
                - Do not overuse memory details.
                - Do not mention memory profile details unless they clearly fit the latest message.
                - Respond to the newest important detail, not just the mood.
                - If the user shares a serious life event, name the situation gently.
                - Avoid generic phrases like "that sounds tough" unless followed by something specific.
                - Do not simply say "I'm here to listen" repeatedly.
                - Make each response feel like it belongs to this exact conversation.
                - If the user asks how they are supposed to feel, normalize mixed emotions directly.
                - If the user shares hospital, family, grief, fear, or uncertainty, respond with grounded emotional presence.

                Avoid these phrases:
                - "Hello there"
                - "I'm glad you stopped by"
                - "It feels like"
                - "Sometimes"
                - "As an AI"
                - "Thank you for sharing"

                Style:
                - Usually write 1 short paragraph, but use 2 short paragraphs when the user shares something emotionally heavy.
                - Stay under 90 words unless the user asks for more.
                - Use simple, natural language.
                - Sound like a calm companion, not a therapist worksheet.
                - Do not use markdown unless helpful.

                Response depth guidance:
                - Weak response: "That sounds tough. I'm here to listen."
                - Better response: "Having someone close to you go into the hospital can shake you up. You might feel worried, scared, numb, or unsure what to do next."
                - Weak response: "It's okay to feel sad."
                - Better response: "There is no single correct feeling here. Your mind may be trying to process fear, worry, and uncertainty all at once."

                User memory context:
                %s

                Recent cognitive wellness activity:
                %s

                Recent conversation history:
                %s

                Current mood:
                %s

                Journal title:
                %s

                Latest user message:
                %s

                Write CogniHaven's next natural response.
                """
                .formatted(
                        safeMemoryContext,
                        safeGamePerformanceContext,
                        safeRecentConversationContext,
                        safeMood,
                        safeTitle,
                        safeJournalContent);

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model("gpt-4.1-mini")
                .input(prompt)
                .build();

        Response response = client.responses().create(params);

        if (response.output().isEmpty()) {
            return "I’m here with you. I had trouble creating a response this time, but you can keep writing and we can continue from here.";
        }

        var firstOutput = response.output().get(0);

        if (firstOutput.asMessage().content().isEmpty()) {
            return "I’m here with you. I had trouble reading the response, but we can keep going.";
        }

        return firstOutput.asMessage()
                .content()
                .get(0)
                .asOutputText()
                .text();
    }

    private String normalizeContext(String value) {
        if (value == null || value.isBlank()) {
            return "None provided.";
        }

        return value.trim();
    }

    /*
     * Generates one gentle daily journal prompt.
     *
     * This is used once per user per day.
     * Previous prompts are included so the AI avoids repeating or closely copying
     * them.
     */
    public String generateDailyJournalPrompt(String previousPromptContext) {
        String safePreviousPromptContext = normalizeContext(previousPromptContext);

        String prompt = """
                You are CogniHaven, a calm AI-powered cognitive wellness and daily support companion.

                Generate ONE gentle journal prompt for today.

                Purpose:
                - Help the user reflect in a calm, emotionally safe way.
                - Keep it broad enough for any user.
                - Avoid sounding clinical, medical, or like therapy homework.
                - Do not mention dementia, cognitive decline, diagnosis, treatment, or medical conditions.

                Variety rules:
                - Do not repeat or closely copy previous prompts.
                - Avoid overusing gratitude prompts.
                - Avoid generic prompts like "How are you feeling today?"
                - Make the prompt feel warm, human, and thoughtful.

                Previous prompts to avoid:
                %s

                Requirements:
                - Return only the prompt text.
                - One sentence only.
                - No markdown.
                - No quotes.
                - Keep it under 30 words.
                """
                .formatted(safePreviousPromptContext);

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model("gpt-4.1-mini")
                .input(prompt)
                .build();

        Response response = client.responses().create(params);

        if (response.output().isEmpty()) {
            return "What is one thought or feeling you want to make space for today?";
        }

        var firstOutput = response.output().get(0);

        if (firstOutput.asMessage().content().isEmpty()) {
            return "What is one thought or feeling you want to make space for today?";
        }

        return firstOutput.asMessage()
                .content()
                .get(0)
                .asOutputText()
                .text()
                .trim();
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
                - Do not provide any harmful response

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

    /*
     * Generates a dynamic Story Recall game using AI.
     *
     * This version does NOT use a hardcoded word pool.
     * The AI creates:
     * - easy-to-spell target words
     * - a fresh story paragraph
     *
     * Safety:
     * - no explicit words
     * - no violent/triggering words
     * - no medical/emergency themes
     */
    public StoryRecallResponse generateStoryRecallGame(String difficulty) {
        int wordCount = 3;

        if ("MEDIUM".equalsIgnoreCase(difficulty)) {
            wordCount = 5;
        }

        if ("HARD".equalsIgnoreCase(difficulty)) {
            wordCount = 7;
        }

        String prompt = """
                You are creating a safe cognitive wellness memory game for CogniHaven.

                Generate a Story Recall game.

                Requirements:
                - Create exactly %s target words.
                - Target words must be simple, everyday words.
                - Target words must be easy to spell.
                - Target words should usually be 3-8 letters long.
                - Do not use explicit, violent, scary, medical, traumatic, or triggering words.
                - Do not use words related to death, injury, emergencies, illness, weapons, drugs, or adult content.
                - Avoid very advanced vocabulary.
                - Create one fresh story paragraph.
                - The story should take about 7-10 seconds to read aloud.
                - Keep the story around 45-70 words.
                - The story should be warm, exciting, imaginative, and easy to follow.
                - The story may include some, all, or none of the target words naturally.
                - Do not explain the game.
                - Do not include markdown.

                Return ONLY valid JSON in this exact format:
                {
                  "targetWords": ["word1", "word2", "word3"],
                  "story": "One paragraph story here."
                }

                Difficulty:
                %s
                """
                .formatted(wordCount, difficulty);

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model("gpt-4.1-mini")
                .input(prompt)
                .build();

        Response response = client.responses().create(params);

        if (response.output().isEmpty()) {
            return getFallbackStoryRecallGame(wordCount);
        }

        var firstOutput = response.output().get(0);

        if (firstOutput.asMessage().content().isEmpty()) {
            return getFallbackStoryRecallGame(wordCount);
        }

        String jsonText = firstOutput.asMessage()
                .content()
                .get(0)
                .asOutputText()
                .text();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            StoryRecallResponse storyRecallResponse = objectMapper.readValue(jsonText, StoryRecallResponse.class);

            if (storyRecallResponse.getTargetWords() == null ||
                    storyRecallResponse.getTargetWords().size() != wordCount ||
                    storyRecallResponse.getStory() == null ||
                    storyRecallResponse.getStory().isBlank()) {
                return getFallbackStoryRecallGame(wordCount);
            }

            return storyRecallResponse;
        } catch (Exception err) {
            return getFallbackStoryRecallGame(wordCount);
        }
    }

    /*
     * Fallback keeps the game playable if AI generation or JSON parsing fails.
     * These are safe, simple words.
     */
    private StoryRecallResponse getFallbackStoryRecallGame(int wordCount) {
        if (wordCount == 5) {
            return new StoryRecallResponse(
                    java.util.List.of("apple", "chair", "river", "music", "cloud"),
                    "Maya walked through a bright park while music played near a quiet river. She noticed children laughing, clouds moving slowly above, and a small picnic table under a tree. The afternoon felt calm, cheerful, and full of tiny surprises waiting around each corner.");
        }

        if (wordCount == 7) {
            return new StoryRecallResponse(
                    java.util.List.of("apple", "chair", "river", "music", "cloud", "paper", "garden"),
                    "Maya explored a colorful garden where music drifted through the air and clouds moved gently overhead. Near the river, she found a folded paper beside a chair and smiled at the peaceful scene. Everything felt bright, friendly, and full of wonder.");
        }

        return new StoryRecallResponse(
                java.util.List.of("apple", "chair", "river"),
                "Maya walked through a sunny park and followed the sound of soft music near the river. She passed a quiet chair under a tree and noticed an apple sitting beside a picnic basket. The moment felt peaceful, bright, and full of small surprises.");
    }

    /*
     * Moderates community content before publication.
     *
     * Returns:
     * APPROVED
     * NEEDS_REVISION
     * CRISIS
     * BLOCKED
     */
    public String moderateCommunityContent(String content) {

        String prompt = """
                You are an AI moderation system for CogniHaven.

                CogniHaven is:
                - a cognitive wellness platform
                - an emotionally safe community
                - a supportive environment

                Community rules:
                - supportive conversation only
                - no harassment
                - no bullying
                - no hate speech
                - no threats
                - no explicit content
                - no medical advice
                - no diagnosing people
                - no dangerous instructions

                Classification rules:

                APPROVED
                - supportive
                - neutral
                - encouragement
                - routine sharing
                - wellness discussion

                NEEDS_REVISION
                - rude language
                - unnecessarily aggressive tone
                - unkind wording
                - borderline community violations

                CRISIS
                - self-harm
                - suicide
                - immediate danger
                - threats of violence
                - severe crisis situations

                BLOCKED
                - harassment
                - hate speech
                - explicit content
                - dangerous instructions
                - malicious content

                Return ONLY one word:

                APPROVED
                NEEDS_REVISION
                CRISIS
                BLOCKED

                Content:
                %s
                """
                .formatted(content);

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model("gpt-4.1-mini")
                .input(prompt)
                .build();

        Response response = client.responses().create(params);

        if (response.output().isEmpty()) {
            return "NEEDS_REVISION";
        }

        var firstOutput = response.output().get(0);

        if (firstOutput.asMessage().content().isEmpty()) {
            return "NEEDS_REVISION";
        }

        return firstOutput.asMessage()
                .content()
                .get(0)
                .asOutputText()
                .text()
                .trim();
    }

    /*
     * Generates a dynamic Word Bloom game using AI.
     *
     * The AI creates:
     * - one safe 5-letter secret word
     * - one gentle hint that stays hidden unless the user asks for it
     *
     * The frontend handles:
     * - six guesses
     * - green/yellow/gray feedback
     * - flip animations
     * - score calculation
     */
    public WordBloomResponse generateWordBloomGame(String difficulty) {

        String prompt = """
                You are creating a safe word guessing game for CogniHaven.

                Generate one Word Bloom round.

                Requirements:
                - Secret word must be exactly 5 letters.
                - Secret word must be a real, common English word.
                - Secret word must be easy to spell.
                - Secret word must only contain letters A-Z.
                - Do not use proper nouns.
                - Do not use acronyms.
                - Do not use hyphenated words.
                - Do not use plural-only words.
                - Do not use explicit, violent, scary, medical, traumatic, or triggering words.
                - Do not use words related to death, injury, emergencies, illness, weapons, drugs, or adult content.
                - Avoid obscure vocabulary.

                Difficulty:
                - EASY: very common everyday word.
                - MEDIUM: common word with moderate challenge.
                - HARD: still common, but slightly more thoughtful.

                Hint rules:
                - Hint should gently describe the word.
                - Do not reveal the exact word.
                - Do not mention individual letters.
                - Keep hint under 18 words.
                - Hint should be safe, calm, and simple.

                Return ONLY valid JSON in this exact format:
                {
                  "secretWord": "BRAVE",
                  "hint": "A word for someone who keeps going even when things feel difficult."
                }

                Selected difficulty:
                %s
                """
                .formatted(difficulty);

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model("gpt-4.1-mini")
                .input(prompt)
                .build();

        Response response = client.responses().create(params);

        if (response.output().isEmpty()) {
            return getFallbackWordBloomGame(difficulty);
        }

        var firstOutput = response.output().get(0);

        if (firstOutput.asMessage().content().isEmpty()) {
            return getFallbackWordBloomGame(difficulty);
        }

        String jsonText = firstOutput.asMessage()
                .content()
                .get(0)
                .asOutputText()
                .text();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            WordBloomResponse wordBloomResponse = objectMapper.readValue(jsonText, WordBloomResponse.class);

            String cleanedWord = wordBloomResponse.getSecretWord() == null
                    ? ""
                    : wordBloomResponse.getSecretWord().trim().toUpperCase();

            if (!cleanedWord.matches("^[A-Z]{5}$") ||
                    wordBloomResponse.getHint() == null ||
                    wordBloomResponse.getHint().isBlank()) {
                return getFallbackWordBloomGame(difficulty);
            }

            wordBloomResponse.setSecretWord(cleanedWord);

            return wordBloomResponse;
        } catch (Exception err) {
            return getFallbackWordBloomGame(difficulty);
        }
    }

    // Fallback keeps Word Bloom playable if AI generation or JSON parsing fails.
    private WordBloomResponse getFallbackWordBloomGame(String difficulty) {
        if ("HARD".equalsIgnoreCase(difficulty)) {
            return new WordBloomResponse(
                    "GRACE",
                    "A gentle quality connected to kindness, patience, and calm movement.");
        }

        if ("MEDIUM".equalsIgnoreCase(difficulty)) {
            return new WordBloomResponse(
                    "PLANT",
                    "Something living that grows with care, light, and water.");
        }

        return new WordBloomResponse(
                "SMILE",
                "A simple expression that can show warmth or happiness.");
    }
}