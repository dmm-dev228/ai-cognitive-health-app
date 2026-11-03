import { useEffect, useRef, useState } from "react";

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener?.("voiceschanged", load);
    return () => {
      synth.removeEventListener?.("voiceschanged", load);
      requestRef.current += 1;
      synth.cancel();
    };
  }, []);

  const stopSpeaking = () => {
    requestRef.current += 1;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  };

  const speak = (text, onComplete) => {
    if (!text?.trim()) { onComplete?.("error"); return; }
    if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      onComplete?.("unsupported");
      return;
    }
    const synth = window.speechSynthesis;
    const request = ++requestRef.current;
    synth.cancel();
    setIsSpeaking(false);
    const utterance = new window.SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    const available = synth.getVoices().length ? synth.getVoices() : voices;
    const preferred = ["samantha", "google us english", "microsoft aria"];
    const voice = preferred.map((name) => available.find((v) => v.name.toLowerCase().includes(name))).find(Boolean)
      || available.find((v) => v.lang.toLowerCase().startsWith("en"));
    if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
    else utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    let finished = false;
    const complete = (status) => {
      if (finished || request !== requestRef.current) return;
      finished = true;
      utteranceRef.current = null;
      setIsSpeaking(false);
      onComplete?.(status);
    };
    utterance.onstart = () => { if (request === requestRef.current) setIsSpeaking(true); };
    utterance.onend = () => complete("ended");
    utterance.onerror = (event) => {
      console.warn("Speech synthesis error:", event.error);
      complete("error");
    };
    try { synth.speak(utterance); }
    catch (error) { console.error("Speech could not start:", error); complete("error"); }
  };

  const toggleSpeaking = (text) => {
    if (isSpeaking) stopSpeaking();
    else speak(text);
  };

  return { speak, stopSpeaking, toggleSpeaking, isSpeaking };
}
