/* When user first enters a entry for journal the ai does not respond until the second Entry
 * Ai needs updating re says things previously stated not flowwing in convoy
*/
import { useEffect, useRef, useState } from "react";
import VoiceControls from "../components/VoiceControls";
import {
  createJournalEntry,
  getJournalEntries,
  getConversationMessages,
  addConversationMessage,
} from "../services/api";

const moodEmojis = {
  happy: "😊",
  excited: "🤩",
  calm: "😌",
  grateful: "🙏",
  proud: "😎",
  neutral: "😐",
  tired: "😴",
  sad: "😢",
  anxious: "😟",
  stressed: "😫",
  frustrated: "😤",
  overwhelmed: "😰",
  angry: "😠",
};

const journalThemes = {
  default: {
    name: "CogniHaven",
    cover: "from-indigo-600 via-violet-600 to-emerald-500",
    page: "bg-white",
    accent: "text-indigo-600",
    button: "from-indigo-600 to-violet-600",
    soft: "bg-indigo-50",
  },
  ocean: {
    name: "Ocean Calm",
    cover: "from-sky-500 via-cyan-500 to-teal-500",
    page: "bg-sky-50",
    accent: "text-sky-600",
    button: "from-sky-500 to-cyan-600",
    soft: "bg-sky-50",
  },
  lavender: {
    name: "Lavender Calm",
    cover: "from-violet-500 via-purple-500 to-fuchsia-500",
    page: "bg-violet-50",
    accent: "text-violet-600",
    button: "from-violet-600 to-purple-600",
    soft: "bg-violet-50",
  },
  forest: {
    name: "Forest Wellness",
    cover: "from-emerald-600 via-green-600 to-teal-600",
    page: "bg-emerald-50",
    accent: "text-emerald-600",
    button: "from-emerald-600 to-teal-600",
    soft: "bg-emerald-50",
  },
  sunrise: {
    name: "Warm Sunrise",
    cover: "from-orange-400 via-amber-400 to-yellow-400",
    page: "bg-amber-50",
    accent: "text-amber-600",
    button: "from-orange-500 to-amber-500",
    soft: "bg-amber-50",
  },
};

function JournalPage() {
  const storedUserId = localStorage.getItem("userId");

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("neutral");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [conversationMap, setConversationMap] = useState({});
  const [followUpMap, setFollowUpMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [isCreatingEntry, setIsCreatingEntry] = useState(true);

  const [journalTheme, setJournalTheme] = useState(
    localStorage.getItem("journalTheme") || "default"
  );

  const [isPageTurning, setIsPageTurning] = useState(false);

  const bottomRef = useRef(null);
  const activeTheme = journalThemes[journalTheme];

  useEffect(() => {
    fetchEntries();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleThemeChange = (themeKey) => {
    setJournalTheme(themeKey);
    localStorage.setItem("journalTheme", themeKey);
  };

  const openNewEntryPage = () => {
    setIsPageTurning(true);

    setTimeout(() => {
      setSelectedEntryId(null);
      setIsCreatingEntry(true);
      setIsPageTurning(false);
    }, 250);
  };

  const openExistingEntryPage = (entryId) => {
    setIsPageTurning(true);

    setTimeout(() => {
      setSelectedEntryId(entryId);
      setIsCreatingEntry(false);
      setIsPageTurning(false);
    }, 250);
  };

  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!storedUserId) {
        setError("No user found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const data = await getJournalEntries();
      const journalEntries = Array.isArray(data) ? data : [];

      setEntries(journalEntries);

      const conversationData = {};

      for (const entry of journalEntries) {
        try {
          const messages = await getConversationMessages(entry.id);
          conversationData[entry.id] = messages;
        } catch (err) {
          console.error(
            `Failed to fetch conversation messages for entry ${entry.id}:`,
            err
          );

          conversationData[entry.id] = [];
        }
      }

      setConversationMap(conversationData);
    } catch (err) {
      console.error("Failed to fetch journal entries:", err);
      setError("Could not load journal entries.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required. Please add a title before saving.");
      return;
    }

    if (!content.trim()) {
      setError("Journal Entry is required. Please write your thoughts before saving.");
      return;
    }

    if (!storedUserId) {
      setError("No user found. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const savedEntry = await createJournalEntry({
        title,
        content,
        mood,
        isPublic: false,
      });

      const tempEntry = {
        ...savedEntry,
        title: savedEntry.title || title,
        content: savedEntry.content || content,
        mood: savedEntry.mood || mood,
      };

      setEntries((prev) => [tempEntry, ...prev]);

      setSelectedEntryId(savedEntry.id);
      setIsCreatingEntry(false);

      /*
       * Backend now generates the first AI response during journal creation.
       * We only fetch the updated conversation thread here.
       */
      const messages = await getConversationMessages(savedEntry.id);

      setConversationMap((prev) => ({
        ...prev,
        [savedEntry.id]: messages,
      }));

      setTitle("");
      setContent("");
      setMood("neutral");

      scrollToBottom();
    } catch (err) {
      console.error("Failed to save journal entry:", err);
      setError("Could not save journal entry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFollowUpSubmit = async (entryId) => {
    const message = followUpMap[entryId];

    if (!message || !message.trim()) {
      setError("Please enter a follow-up message.");
      return;
    }

    const trimmedMessage = message.trim();

    /*
     * Optimistic user message.
     * This shows the user's message immediately before waiting for CogniHaven.
     */
    const optimisticUserMessage = {
      id: `temp-user-${Date.now()}`,
      journalEntryId: entryId,
      senderType: "USER",
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      setError("");

      setConversationMap((prev) => ({
        ...prev,
        [entryId]: [...(prev[entryId] || []), optimisticUserMessage],
      }));

      setFollowUpMap((prev) => ({
        ...prev,
        [entryId]: "",
      }));

      setLoadingMap((prev) => ({
        ...prev,
        [entryId]: true,
      }));

      scrollToBottom();

      const updatedMessages = await addConversationMessage(entryId, trimmedMessage);

      setConversationMap((prev) => ({
        ...prev,
        [entryId]: updatedMessages,
      }));

      scrollToBottom();
    } catch (err) {
      console.error("Failed to send follow-up message:", err);
      setError("Could not send follow-up message.");

      /*
       * Remove temporary optimistic message if the request fails.
       */
      setConversationMap((prev) => ({
        ...prev,
        [entryId]: (prev[entryId] || []).filter(
          (msg) => msg.id !== optimisticUserMessage.id
        ),
      }));
    } finally {
      setLoadingMap((prev) => ({
        ...prev,
        [entryId]: false,
      }));
    }
  };

  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${activeTheme.accent}`}>
          Digital Journal
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Open your journal, write, and continue the conversation.
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          A calm digital journal for reflection, mood awareness, and supportive
          AI-guided insights.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[340px_1fr]">
        <aside className="glass-card h-fit rounded-[2rem] p-5 xl:sticky xl:top-28">
          <div className={`rounded-[1.75rem] bg-gradient-to-br ${activeTheme.cover} p-5 text-white shadow-xl`}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              My Journal
            </p>

            <h3 className="mt-3 text-3xl font-black tracking-tight">
              {activeTheme.name}
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/80">
              Choose an entry or open a fresh page.
            </p>

            <button
              onClick={openNewEntryPage}
              className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              + New Journal Entry
            </button>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-100 bg-white/70 p-4">
            <p className="mb-3 text-sm font-bold text-slate-800">
              Customize Journal
            </p>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(journalThemes).map(([themeKey, theme]) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeChange(themeKey)}
                  className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${journalTheme === themeKey
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">
                Previous Entries
              </p>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {entries.length}
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-3xl bg-white/70 p-5 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
                <p className="text-sm font-semibold text-slate-600">
                  Loading entries...
                </p>
              </div>
            ) : entries.length === 0 ? (
              <div className="rounded-3xl bg-white/70 p-5 text-center">
                <p className="text-3xl">✍️</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  No entries yet.
                </p>
              </div>
            ) : (
              <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => openExistingEntryPage(entry.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${selectedEntryId === entry.id && !isCreatingEntry
                      ? "border-indigo-200 bg-indigo-50 shadow-md"
                      : "border-white/60 bg-white/70 hover:bg-white"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="line-clamp-1 text-sm font-bold text-slate-900">
                          {entry.title || "Untitled Entry"}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {entry.mood || "neutral"}{" "}
                          {moodEmojis[entry.mood] || "😐"}
                        </p>
                      </div>

                      <span className="text-lg">
                        {moodEmojis[entry.mood] || "😐"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="relative">
          <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${activeTheme.cover} opacity-20 blur-2xl`} />

          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 p-3 shadow-2xl shadow-slate-300/60">
            <div className="grid min-h-[720px] overflow-hidden rounded-[2rem] border border-amber-200/70 bg-white shadow-inner lg:grid-cols-[1fr_1.1fr]">
              <div className={`hidden border-r border-amber-200/70 ${activeTheme.page} p-8 lg:block`}>
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${activeTheme.accent}`}>
                      CogniHaven Journal
                    </p>

                    <h3 className="mt-4 text-4xl font-black leading-tight text-slate-900">
                      A quiet place to collect thoughts.
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      Use the journal shelf to open past reflections or start a
                      new page whenever you are ready.
                    </p>
                  </div>

                  <div className={`rounded-[2rem] ${activeTheme.soft} p-6`}>
                    <p className="text-sm font-bold text-slate-800">
                      Today’s gentle prompt
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      What is one small moment from today that you want to
                      remember?
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`min-h-[720px] bg-white p-6 transition-all duration-300 sm:p-8 ${isPageTurning
                  ? "scale-[0.98] rotate-1 opacity-40 blur-sm"
                  : "scale-100 rotate-0 opacity-100 blur-0"
                  }`}
              >
                {isCreatingEntry ? (
                  <div className="flex h-full flex-col">
                    <div className="mb-8">
                      <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${activeTheme.accent}`}>
                        New Entry
                      </p>

                      <h3 className="mt-3 text-3xl font-black text-slate-900">
                        Write a fresh journal page.
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        Add a title, choose your mood, and write your thoughts.
                        CogniHaven will respond with a supportive reflection.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Title
                        </span>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Morning check-in"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Mood
                        </span>
                        <select
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        >
                          <option value="happy">Happy 😊</option>
                          <option value="excited">Excited 🤩</option>
                          <option value="calm">Calm 😌</option>
                          <option value="grateful">Grateful 🙏</option>
                          <option value="proud">Proud 😎</option>
                          <option value="neutral">Neutral 😐</option>
                          <option value="tired">Tired 😴</option>
                          <option value="sad">Sad 😢</option>
                          <option value="anxious">Anxious 😟</option>
                          <option value="stressed">Stressed 😫</option>
                          <option value="frustrated">Frustrated 😤</option>
                          <option value="overwhelmed">Overwhelmed 😰</option>
                          <option value="angry">Angry 😠</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Journal Entry
                        </span>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your thoughts..."
                          rows="12"
                          className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(transparent_95%,rgba(99,102,241,0.12)_96%)] px-5 py-4 text-sm leading-8 text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      {/*
                        Speech-to-text support for journal writing.
                        Appends spoken words to the journal entry instead of replacing it.
                      */}
                      <VoiceControls
                        onTranscript={(spokenText) =>
                          setContent((prev) =>
                            prev ? `${prev} ${spokenText}` : spokenText
                          )
                        }
                        showTextToSpeech={false}
                        showSpeechToText={true}
                        listenButtonLabel="Speak Journal Entry"
                      />

                      <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className={`w-full rounded-2xl bg-gradient-to-r ${activeTheme.button} px-5 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {isSaving ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            CogniHaven is thinking...
                          </span>
                        ) : (
                          "Save Entry"
                        )}
                      </button>
                    </div>
                  </div>
                ) : selectedEntry ? (
                  <div className="flex h-full flex-col">
                    <div className="mb-6 border-b border-slate-100 pb-5">
                      <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${activeTheme.accent}`}>
                        Open Entry
                      </p>

                      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-3xl font-black text-slate-900">
                            {selectedEntry.title || "Untitled Entry"}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            Mood: {selectedEntry.mood || "neutral"}{" "}
                            {moodEmojis[selectedEntry.mood] || "😐"}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                          AI Reflection
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto pr-1">
                      {(conversationMap[selectedEntry.id] || []).length > 0 ? (
                        (conversationMap[selectedEntry.id] || []).map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderType === "USER"
                              ? "justify-end"
                              : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm ${msg.senderType === "USER"
                                ? `rounded-br-md bg-gradient-to-r ${activeTheme.button} text-white`
                                : "rounded-bl-md border border-slate-100 bg-slate-50 text-slate-700"
                                }`}
                            >
                              {msg.senderType === "AI" && (
                                <>
                                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                                    CogniHaven
                                  </p>

                                  {/*
                                    Text-to-speech support for AI conversation messages.
                                    Allows users to listen to each CogniHaven reply.
                                  */}
                                  <div className="mb-3">
                                    <VoiceControls
                                      textToRead={msg.message}
                                      showTextToSpeech={true}
                                      showSpeechToText={false}
                                      readButtonLabel="Listen"
                                    />
                                  </div>
                                </>
                              )}

                              <p className="whitespace-pre-wrap">
                                {msg.message}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex justify-end">
                            <div className={`max-w-[85%] rounded-3xl rounded-br-md bg-gradient-to-r ${activeTheme.button} px-5 py-4 text-sm leading-7 text-white shadow-sm`}>
                              {/*
                                Text-to-speech support for the user's saved journal entry.
                              */}
                              <div className="mb-3">
                                <VoiceControls
                                  textToRead={
                                    selectedEntry.content ||
                                    "No journal content found."
                                  }
                                  showTextToSpeech={true}
                                  showSpeechToText={false}
                                  readButtonLabel="Listen to Entry"
                                />
                              </div>

                              <p className="whitespace-pre-wrap">
                                {selectedEntry.content ||
                                  "No journal content found."}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-3xl rounded-bl-md border border-slate-100 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700 shadow-sm">
                              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                                CogniHaven
                              </p>

                              {/*
                                Text-to-speech support for the AI reflection fallback display.
                              */}
                              <div className="mb-3">
                                <VoiceControls
                                  textToRead={
                                    selectedEntry.aiResponse ||
                                    selectedEntry.supportiveResponse ||
                                    selectedEntry.aiAnalysis?.supportiveResponse ||
                                    "No AI reflection yet."
                                  }
                                  showTextToSpeech={true}
                                  showSpeechToText={false}
                                  readButtonLabel="Listen to Reflection"
                                />
                              </div>

                              <p className="whitespace-pre-wrap">
                                {selectedEntry.aiResponse ||
                                  selectedEntry.supportiveResponse ||
                                  selectedEntry.aiAnalysis?.supportiveResponse ||
                                  "No AI reflection yet."}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {loadingMap[selectedEntry.id] && (
                        <div className="flex justify-start">
                          <div className="rounded-3xl rounded-bl-md border border-slate-100 bg-slate-50 px-5 py-4 shadow-sm">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                              CogniHaven
                            </p>
                            <div className="flex gap-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={bottomRef}></div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            type="text"
                            value={followUpMap[selectedEntry.id] || ""}
                            onChange={(e) =>
                              setFollowUpMap((prev) => ({
                                ...prev,
                                [selectedEntry.id]: e.target.value,
                              }))
                            }
                            placeholder="Continue this conversation..."
                            disabled={loadingMap[selectedEntry.id]}
                            className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                          />

                          <button
                            onClick={() =>
                              handleFollowUpSubmit(selectedEntry.id)
                            }
                            disabled={loadingMap[selectedEntry.id]}
                            className={`rounded-2xl bg-gradient-to-r ${activeTheme.button} px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            {loadingMap[selectedEntry.id] ? "Thinking..." : "Send"}
                          </button>
                        </div>

                        {/*
                          Speech-to-text support for follow-up conversations.
                          Appends spoken text to the current follow-up message.
                        */}
                        <VoiceControls
                          onTranscript={(spokenText) =>
                            setFollowUpMap((prev) => ({
                              ...prev,
                              [selectedEntry.id]: prev[selectedEntry.id]
                                ? `${prev[selectedEntry.id]} ${spokenText}`
                                : spokenText,
                            }))
                          }
                          showTextToSpeech={false}
                          showSpeechToText={true}
                          listenButtonLabel="Speak Message"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] ${activeTheme.soft} text-4xl`}>
                        📖
                      </div>

                      <h3 className="text-3xl font-black text-slate-900">
                        Open your journal.
                      </h3>

                      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                        Choose an entry from the shelf or create a new journal
                        page to begin.
                      </p>

                      <button
                        onClick={openNewEntryPage}
                        className={`mt-6 rounded-2xl bg-gradient-to-r ${activeTheme.button} px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5`}
                      >
                        Start New Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JournalPage;