package com.aihealth.backend.service;

import com.aihealth.backend.dto.DailyPromptResponse;
import com.aihealth.backend.model.DailyPrompt;
import com.aihealth.backend.model.User;
import com.aihealth.backend.repository.DailyPromptRepository;
import com.aihealth.backend.repository.UserRepository;
import com.aihealth.backend.security.SecurityUtils;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class DailyPromptService {

    private final DailyPromptRepository dailyPromptRepository;
    private final UserRepository userRepository;
    private final OpenAIService openAIService;

    public DailyPromptService(
            DailyPromptRepository dailyPromptRepository,
            UserRepository userRepository,
            OpenAIService openAIService) {
        this.dailyPromptRepository = dailyPromptRepository;
        this.userRepository = userRepository;
        this.openAIService = openAIService;
    }

    /*
     * Returns today's daily prompt for the authenticated user.
     *
     * If one already exists for today, reuse it.
     * If not, generate one with AI, save it, and return it.
     */
    public DailyPromptResponse getTodayPrompt() {
        User user = getCurrentAuthenticatedUser();
        LocalDate today = LocalDate.now();

        return dailyPromptRepository.findByUserIdAndPromptDate(user.getId(), today)
                .map(this::mapToResponse)
                .orElseGet(() -> createTodayPrompt(user, today));
    }

    // Generates and saves a new AI daily prompt for today.
    private DailyPromptResponse createTodayPrompt(User user, LocalDate today) {
        String previousPromptContext = buildPreviousPromptContext(user.getId());

        String aiPrompt = openAIService.generateDailyJournalPrompt(previousPromptContext);

        DailyPrompt dailyPrompt = new DailyPrompt();

        dailyPrompt.setUser(user);
        dailyPrompt.setPrompt(aiPrompt);
        dailyPrompt.setPromptDate(today);
        dailyPrompt.setCreatedAt(LocalDateTime.now());

        DailyPrompt saved = dailyPromptRepository.save(dailyPrompt);

        return mapToResponse(saved);
    }

    // Builds a short list of previous prompts so OpenAI avoids repeating them.
    private String buildPreviousPromptContext(Long userId) {
        var previousPrompts = dailyPromptRepository.findTop30ByUserIdOrderByPromptDateDesc(userId);

        if (previousPrompts == null || previousPrompts.isEmpty()) {
            return "No previous prompts yet.";
        }

        return previousPrompts.stream()
                .map(prompt -> "- " + prompt.getPrompt())
                .collect(Collectors.joining("\n"));
    }

    // Loads the currently authenticated user from the JWT email.
    private User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // Converts entity to frontend-safe response DTO.
    private DailyPromptResponse mapToResponse(DailyPrompt dailyPrompt) {
        return new DailyPromptResponse(
                dailyPrompt.getId(),
                dailyPrompt.getPrompt(),
                dailyPrompt.getPromptDate());
    }
}