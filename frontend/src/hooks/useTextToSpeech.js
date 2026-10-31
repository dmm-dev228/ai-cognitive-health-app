
import { useEffect, useRef, useState } from "react";

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  const utteranceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      setVoices(synth.getVoices());
    };

    loadVoices();
    synth.addEventListener?.("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener?.("voiceschanged", loadVoices);
      synth.cancel();
    };
  }, []);

  const getBestVoice = () => {
    const available = window.speechSynthesis?.getVoices() || [];
    const list = available.length ? available : voices;

    return (
      list.find((voice) =>
        voice.name.toLowerCase().includes("samantha")
      ) ||
      list.find((voice) =>
        voice.name.toLowerCase().includes("google us english")
      ) ||
      list.find((voice) =>
        voice.name.toLowerCase().includes("microsoft aria")
      ) ||
      list.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      ) ||
      null
    );
  };

  const stopSpeaking = () => {
    requestIdRef.current += 1;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    utteranceRef.current = null;
    setIsSpeaking(false);
  };

  // onComplete receives "ended", "error", or "unsupported".
  const speak = (text, onComplete) => {
    if (!text?.trim()) {
      onComplete?.("error");
      return;
    }

    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      onComplete?.("unsupported");
      return;
    }

    const synth = window.speechSynthesis;
    const requestId = ++requestIdRef.current;

    synth.cancel();
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const selectedVoice = getBestVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    let completed = false;

    const finish = (status) => {
      if (completed || requestId !== requestIdRef.current) return;

      completed = true;
      utteranceRef.current = null;
      setIsSpeaking(false);

      onComplete?.(status);
    };

    utterance.onstart = () => {
      if (requestId === requestIdRef.current) {
        setIsSpeaking(true);
      }
    };

    utterance.onend = () => finish("ended");

    utterance.onerror = (event) => {
      console.warn("Speech synthesis error:", event.error);
      finish("error");
    };

    try {
      synth.speak(utterance);
    } catch (error) {
      console.error("Unable to start narration:", error);
      finish("error");
    }
  };

  const toggleSpeaking = (text) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return {
    speak,
    stopSpeaking,
    toggleSpeaking,
    isSpeaking,
  };
}
