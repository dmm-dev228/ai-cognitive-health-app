import { useEffect, useRef, useState } from "react";
import {
  createJournalEntry,
  getJournalEntries,
  generateJournalReflection,
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

  const bottomRef = useRef(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

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
    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and journal content.");
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
        aiResponse: "CogniHaven is thinking...",
      };

      setEntries((prev) => [tempEntry, ...prev]);

      const aiResult = await generateJournalReflection(savedEntry.id);

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === savedEntry.id
            ? {
                ...entry,
                aiResponse:
                  aiResult.supportiveResponse ||
                  aiResult.response ||
                  aiResult.message ||
                  aiResult.data?.supportiveResponse ||
                  "No AI response returned.",
              }
            : entry
        )
      );

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

    try {
      setError("");

      setLoadingMap((prev) => ({
        ...prev,
        [entryId]: true,
      }));

      const updatedMessages = await addConversationMessage(entryId, message);

      setConversationMap((prev) => ({
        ...prev,
        [entryId]: updatedMessages,
      }));

      setFollowUpMap((prev) => ({
        ...prev,
        [entryId]: "",
      }));

      scrollToBottom();
    } catch (err) {
      console.error("Failed to send follow-up message:", err);
      setError("Could not send follow-up message.");
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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
          Journal Workspace
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Reflect, write, and continue the conversation.
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          A calm space for daily reflection, mood awareness, and supportive
          AI-guided insights.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Left composer */}
        <aside className="glass-card h-fit rounded-3xl p-6 lg:sticky lg:top-28">
          <div className="mb-6">
            <p className="text-sm font-semibold text-indigo-600">
              New Reflection
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              What’s on your mind?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Write a short entry and CogniHaven will respond with a supportive
              reflection.
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
                Journal Entry
              </span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts..."
                rows="7"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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

            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
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
        </aside>

        {/* Right conversation feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Previous Entries
              </h3>
              <p className="text-sm text-slate-500">
                Your reflections are shown newest first.
              </p>
            </div>

            <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              {entries.length} entries
            </div>
          </div>

          {isLoading ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
              <p className="font-semibold text-slate-700">
                Loading journal entries...
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-3xl">
                ✍️
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                No journal entries yet.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Start with a quick reflection. Your first AI-supported insight
                will appear here.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <article
                key={entry.id}
                className="glass-card overflow-hidden rounded-3xl"
              >
                <div className="border-b border-slate-100 bg-white/70 px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {entry.title || "Untitled Entry"}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Mood: {entry.mood || "neutral"}{" "}
                        {moodEmojis[entry.mood] || "😐"}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                      AI Reflection
                    </span>
                  </div>
                </div>

                <div className="space-y-5 px-4 py-6 sm:px-6">
                  {(conversationMap[entry.id] || []).length > 0 ? (
                    (conversationMap[entry.id] || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderType === "USER"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-6 shadow-sm ${
                            msg.senderType === "USER"
                              ? "rounded-br-md bg-indigo-600 text-white"
                              : "rounded-bl-md border border-slate-100 bg-white text-slate-700"
                          }`}
                        >
                          {msg.senderType === "AI" && (
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                              CogniHaven
                            </p>
                          )}

                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-3xl rounded-br-md bg-indigo-600 px-5 py-4 text-sm leading-6 text-white shadow-sm">
                          <p className="whitespace-pre-wrap">
                            {entry.content || "No journal content found."}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-3xl rounded-bl-md border border-slate-100 bg-white px-5 py-4 text-sm leading-6 text-slate-700 shadow-sm">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                            CogniHaven
                          </p>
                          <p className="whitespace-pre-wrap">
                            {entry.aiResponse ||
                              entry.supportiveResponse ||
                              entry.aiAnalysis?.supportiveResponse ||
                              "No AI reflection yet."}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {loadingMap[entry.id] && (
                    <div className="flex justify-start">
                      <div className="rounded-3xl rounded-bl-md border border-slate-100 bg-white px-5 py-4 shadow-sm">
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

                <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={followUpMap[entry.id] || ""}
                      onChange={(e) =>
                        setFollowUpMap((prev) => ({
                          ...prev,
                          [entry.id]: e.target.value,
                        }))
                      }
                      placeholder="Continue this conversation..."
                      disabled={loadingMap[entry.id]}
                      className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      onClick={() => handleFollowUpSubmit(entry.id)}
                      disabled={loadingMap[entry.id]}
                      className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingMap[entry.id] ? "Thinking..." : "Send"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default JournalPage;