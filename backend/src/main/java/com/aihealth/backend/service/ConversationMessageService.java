package com.aihealth.backend.service;

import com.aihealth.backend.dto.ConversationMessageResponse;
import com.aihealth.backend.model.ConversationMessage;
import com.aihealth.backend.model.JournalEntry;
import com.aihealth.backend.repository.ConversationMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationMessageService {

    private final ConversationMessageRepository conversationMessageRepository;

    public ConversationMessageService(ConversationMessageRepository conversationMessageRepository) {
        this.conversationMessageRepository = conversationMessageRepository;
    }

    // Saves a single message into a journal thread.
    // senderType should be "USER" or "AI".
    public ConversationMessageResponse saveMessage(
            JournalEntry journalEntry,
            String senderType,
            String message
    ) {
        ConversationMessage conversationMessage = new ConversationMessage();

        conversationMessage.setJournalEntry(journalEntry);
        conversationMessage.setSenderType(senderType);
        conversationMessage.setMessage(message);

        ConversationMessage savedMessage =
                conversationMessageRepository.save(conversationMessage);

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
                message.getCreatedAt()
        );
    }
}