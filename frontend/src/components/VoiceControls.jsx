import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useSpeechToText } from "../hooks/useSpeechToText";

function VoiceControls({
  textToRead = "",
  onTranscript,
  showTextToSpeech = true,
  showSpeechToText = true,
  listenButtonLabel = "Speak",
  insideInput = false,
}) {
  const { toggleSpeaking, isSpeaking } = useTextToSpeech();

  const {
    startListening,
    isListening,
    transcript,
    error: speechError,
    isSupported,
  } = useSpeechToText();

  const handleListen = () => {
    startListening((spokenText) => {
      if (onTranscript) {
        onTranscript(spokenText);
      }
    });
  };

  return (
    <div className={insideInput ? "" : "mt-3 space-y-2"}>
      <div
        className={
          insideInput
            ? ""
            : "flex flex-wrap items-center gap-3"
        }
      >
        {showTextToSpeech && textToRead && (
          <button
            type="button"
            onClick={() => toggleSpeaking(textToRead)}
            title={isSpeaking ? "Stop reading" : "Read aloud"}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
              isSpeaking
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {isSpeaking ? "🔊" : "🔈"}
          </button>
        )}

        {showSpeechToText && insideInput && (
          <button
            type="button"
            onClick={handleListen}
            disabled={!isSupported}
            title={isListening ? "Listening..." : "Speak answer"}
            className={`absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lg transition-all duration-200 ${
              isListening
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isListening ? "🎙️" : "🎤"}
          </button>
        )}

        {showSpeechToText && !insideInput && (
          <button
            type="button"
            onClick={handleListen}
            disabled={!isSupported || isListening}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 ${
              isListening
                ? "bg-indigo-100 text-indigo-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isListening ? "Listening..." : listenButtonLabel}
          </button>
        )}
      </div>

      {!insideInput && !isSupported && showSpeechToText && (
        <p className="text-sm text-slate-500">
          Speech recognition is not supported in this browser.
        </p>
      )}

      {!insideInput && transcript && showSpeechToText && (
        <p className="text-sm text-slate-600">Heard: {transcript}</p>
      )}

      {!insideInput && speechError && showSpeechToText && (
        <p className="text-sm text-red-600">{speechError}</p>
      )}
    </div>
  );
}

export default VoiceControls;