package com.aihealth.backend.dto;

/*
 * Response DTO returned to the frontend.
 *
 * The secret word is hidden from the user in the UI,
 * but the frontend needs it to evaluate guesses.
 *
 * Hint is only shown if the user clicks the hint button.
 */
public class WordBloomResponse {

    private String secretWord;
    private String hint;

    public WordBloomResponse() {
    }

    public WordBloomResponse(String secretWord, String hint) {
        this.secretWord = secretWord;
        this.hint = hint;
    }

    public String getSecretWord() {
        return secretWord;
    }

    public void setSecretWord(String secretWord) {
        this.secretWord = secretWord;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }
}