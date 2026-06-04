package com.aihealth.backend.service;

import com.aihealth.backend.dto.ConversationMessageRequest;
import com.aihealth.backend.dto.ConversationMessageResponse;
import com.aihealth.backend.model.ConversationMessage;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.repository.ConversationMessageRepository;
import com.aihealth.backend.repository.JournalEntryRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

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

    /*
     * Saves a single message into a journal conversation thread.
     *
     * senderType should be:
     * - "USER"
     * - "AI"
     */
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

    /*
     * Gets all messages for one journal entry in oldest-to-newest order.
     *
     * This version returns DTOs for frontend display.
     */
    public List<ConversationMessageResponse> getMessagesForJournal(@NonNull Long journalEntryId) {
        return conversationMessageRepository
                .findByJournalEntryIdOrderByCreatedAtAsc(journalEntryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /*
     * Gets all raw conversation message entities for backend AI context building.
     *
     * This is used by JournalEntryService so the AI can continue conversations
     * naturally instead of responding like each message is isolated.
     */
    public List<ConversationMessage> getConversationMessages(@NonNull Long journalEntryId) {
        return conversationMessageRepository
                .findByJournalEntryIdOrderByCreatedAtAsc(journalEntryId);
    }

    /*
     * Adds a user follow-up message to an existing journal thread.
     *
     * Security check ensures the logged-in user owns the journal entry.
     */
    public ConversationMessageResponse addUserMessageToJournal(
            @NonNull Long journalEntryId,
            @NonNull ConversationMessageRequest request) {

        JournalEntry journalEntry = journalEntryRepository.findById(journalEntryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));

        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        if (!journalEntry.getUser().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You are not authorized to access this journal thread");
        }

        /*
         * Save only the user's follow-up message here.
         *
         * AI response generation stays outside this method to avoid circular
         * dependencies and keep message persistence separate from AI generation.
         */
        return saveMessage(
                journalEntry,
                "USER",
                request.getMessage());
    }

    /*
     * Converts a ConversationMessage entity into a safe DTO for frontend use.
     */
    private ConversationMessageResponse mapToResponse(@NonNull ConversationMessage message) {
        return new ConversationMessageResponse(
                message.getId(),
                message.getJournalEntry().getId(),
                message.getSenderType(),
                message.getMessage(),
                message.getCreatedAt());
    }
}