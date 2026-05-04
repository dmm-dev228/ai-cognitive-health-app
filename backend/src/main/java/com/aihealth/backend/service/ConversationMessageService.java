package com.aihealth.backend.service;

import com.aihealth.backend.dto.ConversationMessageResponse;
import com.aihealth.backend.model.ConversationMessage;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.repository.ConversationMessageRepository;
import org.springframework.stereotype.Service;
import com.aihealth.backend.dto.ConversationMessageRequest;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.security.SecurityUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationMessageService {

    private final ConversationMessageRepository conversationMessageRepository;
    private final JournalEntryRepository journalEntryRepository;

    public ConversationMessageService(
            ConversationMessageRepository conversationMessageRepository,
            JournalEntryRepository journalEntryRepository) {
        this.conversationMessageRepository = conversationMessageRepository;
        this.journalEntryRepository = journalEntryRepository;
    }

    // Saves a single message into a journal thread.
    // senderType should be "USER" or "AI".
    public ConversationMessageResponse saveMessage(
            JournalEntry journalEntry,
            String senderType,
            String message) {
        ConversationMessage conversationMessage = new ConversationMessage();

        conversationMessage.setJournalEntry(journalEntry);
        conversationMessage.setSenderType(senderType);
        conversationMessage.setMessage(message);

        ConversationMessage savedMessage = conversationMessageRepository.save(conversationMessage);

        return mapToResponse(savedMessage);
    }

    // Gets all messages for one journal entry in oldest-to-newest order.
    public List<ConversationMessageResponse> getMessagesForJournal(Long journalEntryId) {
        return conversationMessageRepository
                .findByJournalEntryIdOrderByCreatedAtAsc(journalEntryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Converts entity into safe DTO for frontend.
    private ConversationMessageResponse mapToResponse(ConversationMessage message) {
        return new ConversationMessageResponse(
                message.getId(),
                message.getJournalEntry().getId(),
                message.getSenderType(),
                message.getMessage(),
                message.getCreatedAt());
    }

    // Adds a user follow-up message to an existing journal thread.
    // Security check makes sure the logged-in user owns the journal entry.
    public ConversationMessageResponse addUserMessageToJournal(
            Long journalEntryId,
            ConversationMessageRequest request) {
        JournalEntry journalEntry = journalEntryRepository.findById(journalEntryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        if (!journalEntry.getUser().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You are not authorized to access this journal thread");
        }

        // Save only the user's follow-up message here.
        // AI response generation stays in AIAnalysisService to avoid circular
        // dependency.
        return saveMessage(
                journalEntry,
                "USER",
                request.getMessage());
    }
}