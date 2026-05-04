package com.aihealth.backend.controller;

import com.aihealth.backend.dto.ConversationMessageResponse;
import com.aihealth.backend.service.ConversationMessageService;
import org.springframework.web.bind.annotation.*;
import com.aihealth.backend.dto.ConversationMessageRequest;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/conversation-messages")
public class ConversationMessageController {

    private final ConversationMessageService conversationMessageService;

    public ConversationMessageController(ConversationMessageService conversationMessageService) {
        this.conversationMessageService = conversationMessageService;
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
    public ConversationMessageResponse addUserMessageToJournal(
            @PathVariable Long journalEntryId,
            @Valid @RequestBody ConversationMessageRequest request) {
        return conversationMessageService.addUserMessageToJournal(
                journalEntryId,
                request);
    }
}