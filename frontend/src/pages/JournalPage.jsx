import "../styles/journal.css";
import { useEffect, useRef, useState } from "react";
import {
    createJournalEntry,
    getJournalEntries,
    generateJournalReflection,
    getConversationMessages,
    addConversationMessage
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
    angry: "😠"
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

    // Stores messages grouped by journal entry ID
    const [conversationMap, setConversationMap] = useState({});

    // Stores follow-up input text grouped by journal entry ID
    const [followUpMap, setFollowUpMap] = useState({});

    // Tracks which journal thread is waiting for AI response
    const [loadingMap, setLoadingMap] = useState({});

    // Used to scroll to the newest message
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

            console.log("Fetched journal entries:", data);

            const journalEntries = Array.isArray(data) ? data : [];

            setEntries(journalEntries);

            // Fetch conversation messages for each existing journal entry
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

            // Store all loaded conversations by journal entry ID
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
                isPublic: false
            });

            console.log("Saved journal entry:", savedEntry);

            const tempEntry = {
                ...savedEntry,
                title: savedEntry.title || title,
                content: savedEntry.content || content,
                mood: savedEntry.mood || mood,
                aiResponse: "CogniHaven is thinking..."
            };

            setEntries((prev) => [tempEntry, ...prev]);

            const aiResult = await generateJournalReflection(savedEntry.id);

            console.log("AI reflection result:", aiResult);

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
                                  "No AI response returned."
                          }
                        : entry
                )
            );

            // Fetch full conversation thread after AI response is generated
            const messages = await getConversationMessages(savedEntry.id);

            // Store messages mapped by journal ID
            setConversationMap((prev) => ({
                ...prev,
                [savedEntry.id]: messages
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

            // Show typing/loading state for this specific journal thread
            setLoadingMap((prev) => ({
                ...prev,
                [entryId]: true
            }));

            // Backend saves USER message, generates AI reply, and returns full thread
            const updatedMessages = await addConversationMessage(
                entryId,
                message
            );

            // Replace only this journal's conversation thread
            setConversationMap((prev) => ({
                ...prev,
                [entryId]: updatedMessages
            }));

            // Clear only this journal's input box
            setFollowUpMap((prev) => ({
                ...prev,
                [entryId]: ""
            }));

            scrollToBottom();
        } catch (err) {
            console.error("Failed to send follow-up message:", err);
            setError("Could not send follow-up message.");
        } finally {
            // Turn off typing/loading state for this journal thread
            setLoadingMap((prev) => ({
                ...prev,
                [entryId]: false
            }));
        }
    };

    return (
        <section>
            <h2>Journal</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="form-container">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts..."
                    rows="6"
                />

                <label>Mood:</label>

                <select value={mood} onChange={(e) => setMood(e.target.value)}>
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

                <button onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? "CogniHaven is thinking..." : "Save Entry"}
                </button>
            </div>

            <h3>Previous Entries</h3>

            {isLoading ? (
                <p>Loading journal entries...</p>
            ) : entries.length === 0 ? (
                <p>No journal entries yet.</p>
            ) : (
                <div className="journal-container">
                    {entries.map((entry) => (
                        <div key={entry.id} className="entry">
                            <h4>{entry.title || "Untitled Entry"}</h4>

                            <small>
                                Mood: {entry.mood || "neutral"}{" "}
                                {moodEmojis[entry.mood] || "😐"}
                            </small>

                            {(conversationMap[entry.id] || []).length > 0 ? (
                                (conversationMap[entry.id] || []).map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={
                                            msg.senderType === "USER"
                                                ? "user-bubble"
                                                : "ai-bubble"
                                        }
                                    >
                                        {msg.senderType === "AI" && (
                                            <strong>CogniHaven</strong>
                                        )}

                                        <p>{msg.message}</p>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="user-bubble">
                                        <p>
                                            {entry.content ||
                                                "No journal content found."}
                                        </p>
                                    </div>

                                    <div className="ai-bubble">
                                        <strong>CogniHaven</strong>
                                        <p>
                                            {entry.aiResponse ||
                                                entry.supportiveResponse ||
                                                entry.aiAnalysis
                                                    ?.supportiveResponse ||
                                                "No AI reflection yet."}
                                        </p>
                                    </div>
                                </>
                            )}

                            {loadingMap[entry.id] && (
                                <div className="ai-bubble typing">
                                    <strong>CogniHaven</strong>
                                    <p>Typing...</p>
                                </div>
                            )}

                            <div ref={bottomRef}></div>

                            <div className="follow-up-container">
                                <input
                                    type="text"
                                    value={followUpMap[entry.id] || ""}
                                    onChange={(e) =>
                                        setFollowUpMap((prev) => ({
                                            ...prev,
                                            [entry.id]: e.target.value
                                        }))
                                    }
                                    placeholder="Continue this conversation..."
                                    disabled={loadingMap[entry.id]}
                                />

                                <button
                                    onClick={() =>
                                        handleFollowUpSubmit(entry.id)
                                    }
                                    disabled={loadingMap[entry.id]}
                                >
                                    {loadingMap[entry.id]
                                        ? "Thinking..."
                                        : "Send"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default JournalPage;