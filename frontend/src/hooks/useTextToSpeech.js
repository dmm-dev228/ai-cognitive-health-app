import { useEffect, useState } from "react";

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis?.getVoices() || []);
    };

    loadVoices();

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getBestVoice = () => {
    return (
      voices.find((voice) =>
        voice.name.toLowerCase().includes("samantha")
      ) ||
      voices.find((voice) =>
        voice.name.toLowerCase().includes("google us english")
      ) ||
      voices.find((voice) =>
        voice.name.toLowerCase().includes("microsoft aria")
      ) ||
      voices.find((voice) => voice.lang.startsWith("en")) ||
      null
    );
  };

  const speak = (text, onEndCallback) => {
    if (!text || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = getBestVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeaking = (text) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return { speak, stopSpeaking, toggleSpeaking, isSpeaking };
}