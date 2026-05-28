package com.aihealth.backend.dto;

public class ConversationAnalysis {

    private String intent;
    private String emotionalTone;
    private boolean directQuestion;
    private boolean activeDisclosure;
    private boolean continueConversation;
    private boolean urgentSafetyConcern;

    public ConversationAnalysis() {
    }

    public ConversationAnalysis(
            String intent,
            String emotionalTone,
            boolean directQuestion,
            boolean activeDisclosure,
            boolean continueConversation,
            boolean urgentSafetyConcern) {
        this.intent = intent;
        this.emotionalTone = emotionalTone;
        this.directQuestion = directQuestion;
        this.activeDisclosure = activeDisclosure;
        this.continueConversation = continueConversation;
        this.urgentSafetyConcern = urgentSafetyConcern;
    }

    public String getIntent() {
        return intent;
    }

    public String getEmotionalTone() {
        return emotionalTone;
    }

    public boolean isDirectQuestion() {
        return directQuestion;
    }

    public boolean isActiveDisclosure() {
        return activeDisclosure;
    }

    public boolean isContinueConversation() {
        return continueConversation;
    }

    public boolean isUrgentSafetyConcern() {
        return urgentSafetyConcern;
    }
}