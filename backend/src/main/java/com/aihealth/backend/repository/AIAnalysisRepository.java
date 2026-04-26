package com.aihealth.backend.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aihealth.backend.model.AIAnalysis;

public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {

    List<AIAnalysis> findByUserId(Long userId);
    List<AIAnalysis> findByJournalEntryId(Long journalEntryId);
    List<AIAnalysis> findByGameResultId(Long gameResultId);
}