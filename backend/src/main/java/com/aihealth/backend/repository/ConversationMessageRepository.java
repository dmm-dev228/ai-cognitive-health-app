package com.aihealth.backend.repository;

import com.aihealth.backend.model.ConversationMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationMessageRepository extends JpaRepository<ConversationMessage, Long> {

    // Fetch all messages for a journal thread in chronological order
    List<ConversationMessage> findByJournalEntryIdOrderByCreatedAtAsc(Long journalEntryId);
    List<ConversationMessage> findByJournalEntryId(Long journalEntryId);
}