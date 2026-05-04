package com.aihealth.backend.controller;

import com.aihealth.backend.dto.ConversationMessageResponse;
import com.aihealth.backend.service.ConversationMessageService;
import org.springframework.web.bind.annotation.*;

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
            @PathVariable Long journalEntryId
    ) {
        return conversationMessageService.getMessagesForJournal(journalEntryId);
    }
}