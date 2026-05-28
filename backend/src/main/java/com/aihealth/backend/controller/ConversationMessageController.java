package com.aihealth.backend.controller;

import com.aihealth.backend.dto.ConversationMessageResponse;
import com.aihealth.backend.service.AIAnalysisService;
import com.aihealth.backend.service.ConversationMessageService;
import org.springframework.web.bind.annotation.*;
import com.aihealth.backend.dto.ConversationMessageRequest;
import jakarta.validation.Valid;

import java.util.List;


@RestController
@RequestMapping("/api/conversation-messages")
public class ConversationMessageController {

    private final ConversationMessageService conversationMessageService;
    private final AIAnalysisService aiAnalysisService;

    public ConversationMessageController(
            ConversationMessageService conversationMessageService,
            AIAnalysisService aiAnalysisService) {
        this.conversationMessageService = conversationMessageService;
        this.aiAnalysisService = aiAnalysisService;
    }

    // Fetches the full chat thread for one journal entry.
    // Example:
    // GET /api/conversation-messages/journal/12
    @GetMapping("/journal/{journalEntryId}")
    public List<ConversationMessageResponse> getMessagesForJournal(
            @PathVariable Long journalEntryId) {
        return conversationMessageService.getMessagesForJournal(journalEntryId);
    }

    // Adds a new user message to an existing journal conversation.
    // Later, this will also trigger an AI reply.
@PostMapping("/journal/{journalEntryId}")
public List<ConversationMessageResponse> addUserMessageAndGenerateAI(
        @PathVariable Long journalEntryId,
        @Valid @RequestBody ConversationMessageRequest request
) {
    // 1. Save USER message
    conversationMessageService.addUserMessageToJournal(
            journalEntryId,
            request
    );

    // 2. Generate AI response (this also saves AI message)
    aiAnalysisService.generateJournalReflection(journalEntryId);

    // 3. Return FULL updated conversation thread
    return conversationMessageService.getMessagesForJournal(journalEntryId);
}
}