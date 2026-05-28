package com.aihealth.backend.service;

import com.aihealth.backend.dto.ConversationAnalysis;
import org.springframework.stereotype.Service;

/*
 * Analyzes the user's latest journal message before AI generation.
 *
 * Purpose:
 * - detect emotional tone
 * - detect conversational intent
 * - identify direct questions
 * - detect active emotional disclosure
 * - detect urgent safety concerns
 *
 * This analysis helps CogniHaven generate more natural,
 * context-aware companion responses instead of generic reflections.
 */

@Service
public class ConversationAnalysisService {

    public ConversationAnalysis analyze(String latestMessage, String recentConversationContext) {
        String message = latestMessage == null ? "" : latestMessage.trim().toLowerCase();
        String context = recentConversationContext == null ? "" : recentConversationContext.trim();

        boolean directQuestion = isDirectQuestion(message);
        boolean urgentSafetyConcern = hasUrgentSafetyConcern(message);
        boolean activeDisclosure = isActiveDisclosure(message);
        boolean continueConversation = !context.isBlank();

        String emotionalTone = detectEmotionalTone(message);
        String intent = detectIntent(message, directQuestion, activeDisclosure, urgentSafetyConcern);

        return new ConversationAnalysis(
                intent,
                emotionalTone,
                directQuestion,
                activeDisclosure,
                continueConversation,
                urgentSafetyConcern
        );
    }

    private boolean isDirectQuestion(String message) {
        return message.contains("?")
                || message.startsWith("who ")
                || message.startsWith("what ")
                || message.startsWith("when ")
                || message.startsWith("where ")
                || message.startsWith("why ")
                || message.startsWith("how ")
                || message.startsWith("can ")
                || message.startsWith("do ")
                || message.startsWith("does ")
                || message.startsWith("did ")
                || message.startsWith("am ")
                || message.startsWith("are ")
                || message.startsWith("is ");
    }

    private boolean isActiveDisclosure(String message) {
        return message.contains("i feel")
                || message.contains("i'm feeling")
                || message.contains("im feeling")
                || message.contains("i am feeling")
                || message.contains("i'm angry")
                || message.contains("im angry")
                || message.contains("i'm sad")
                || message.contains("im sad")
                || message.contains("i'm stressed")
                || message.contains("im stressed")
                || message.contains("i'm scared")
                || message.contains("im scared")
                || message.contains("family member")
                || message.contains("hospital")
                || message.contains("i want to tell you")
                || message.contains("can i talk")
                || message.contains("are you listening");
    }

    private boolean hasUrgentSafetyConcern(String message) {
        return message.contains("kill myself")
                || message.contains("hurt myself")
                || message.contains("end my life")
                || message.contains("suicide")
                || message.contains("hurt someone")
                || message.contains("harm someone");
    }

    private String detectEmotionalTone(String message) {
        if (message.contains("angry") || message.contains("mad") || message.contains("furious")) {
            return "angry";
        }

        if (message.contains("sad") || message.contains("down") || message.contains("depressed")) {
            return "sad";
        }

        if (message.contains("stressed") || message.contains("overwhelmed") || message.contains("too much")) {
            return "stressed";
        }

        if (message.contains("scared") || message.contains("afraid") || message.contains("worried")
                || message.contains("hospital")) {
            return "worried";
        }

        if (message.contains("happy") || message.contains("good") || message.contains("excited")) {
            return "positive";
        }

        return "neutral";
    }

    private String detectIntent(
            String message,
            boolean directQuestion,
            boolean activeDisclosure,
            boolean urgentSafetyConcern) {

        if (urgentSafetyConcern) {
            return "urgent_safety";
        }

        if (directQuestion) {
            return "direct_question";
        }

        if (message.equals("hello") || message.equals("hi") || message.equals("hey")) {
            return "greeting";
        }

        if (activeDisclosure) {
            return "emotional_disclosure";
        }

        if (message.contains("thank you") || message.contains("thanks")) {
            return "gratitude";
        }

        return "general_conversation";
    }
}