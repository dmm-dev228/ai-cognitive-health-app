import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useSpeechToText } from "../hooks/useSpeechToText";

function VoiceControls({
  textToRead = "",
  onTranscript,
  showTextToSpeech = true,
  showSpeechToText = true,
  readButtonLabel = "Listen",
  stopButtonLabel = "Stop",
  listenButtonLabel = "Speak",
}) {
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech();

  const {
    startListening,
    isListening,
    transcript,
    error: speechError,
    isSupported,
  } = useSpeechToText();

  const handleSpeak = () => {
    if (!textToRead) return;
    speak(textToRead);
  };

  const handleListen = () => {
    startListening((spokenText) => {
      if (onTranscript) {
        onTranscript(spokenText);
      }
    });
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-3">
        {showTextToSpeech && textToRead && (
          <>
            <button
              type="button"
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {isSpeaking ? "Speaking..." : readButtonLabel}
            </button>

            <button
              type="button"
              onClick={stopSpeaking}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
            >
              {stopButtonLabel}
            </button>
          </>
        )}

        {showSpeechToText && (
          <button
            type="button"
            onClick={handleListen}
            disabled={!isSupported || isListening}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {isListening ? "Listening..." : listenButtonLabel}
          </button>
        )}
      </div>

      {!isSupported && showSpeechToText && (
        <p className="text-sm text-gray-500">
          Speech recognition is not supported in this browser.
        </p>
      )}

      {transcript && showSpeechToText && (
        <p className="text-sm text-gray-600">
          Heard: {transcript}
        </p>
      )}

      {speechError && showSpeechToText && (
        <p className="text-sm text-red-600">
          {speechError}
        </p>
      )}
    </div>
  );
}

export default VoiceControls;