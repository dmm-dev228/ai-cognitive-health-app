import { useState } from "react";

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const isSupported = !!SpeechRecognition;

  const startListening = (onResult) => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    setError("");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);

      if (onResult) {
        onResult(spokenText);
      }
    };

    recognition.onerror = () => {
      setError("Could not capture your voice. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return {
    startListening,
    isListening,
    transcript,
    error,
    isSupported,
  };
}