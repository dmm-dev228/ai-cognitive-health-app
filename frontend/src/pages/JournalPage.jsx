import "../styles/journal.css";
import { useEffect, useState } from "react";
import { createJournalEntry, getJournalEntries, generateJournalReflection } from "../services/api";

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
    const userId = 1; // Temporary test user until authentication is added

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [entries, setEntries] = useState([]);
    const [mood, setMood] = useState("neutral");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        const data = await getJournalEntries(userId);
        setEntries(data);
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSaving(true);

        // Step 1: Save journal entry
        const savedEntry = await createJournalEntry(userId, {
            title,
            content,
            mood,
            isPublic: false
        });

        // Step 2: Immediately add to UI with "thinking..."
        const tempEntry = {
            ...savedEntry,
            aiResponse: "CogniCare is thinking..."
        };

        setEntries((prev) => [tempEntry, ...prev]);

        // Step 3: Generate AI response
        const aiResult = await generateJournalReflection(savedEntry.id);

        // Step 4: Replace "thinking..." with real response
        setEntries((prev) =>
            prev.map((entry) =>
                entry.id === savedEntry.id
                    ? { ...entry, aiResponse: aiResult.supportiveResponse }
                    : entry
            )
        );

        setTitle("");
        setContent("");
        setMood("neutral");

        setIsSaving(false);
    };

    return (
        <section>
            <h2>Journal</h2>

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
                    {isSaving ? "CogniCare is thinking..." : "Save Entry"}
                </button>
            </div>

            <h3>Previous Entries</h3>

            <div className="journal-container">
                {entries.map((entry) => (
                    <div key={entry.id} className="entry">
                        <div className="user-bubble">
                            <h4>{entry.title}</h4>
                            <p>{entry.content}</p>
                            <small>
                                Mood: {entry.mood} {moodEmojis[entry.mood]}
                            </small>
                        </div>

                        {entry.aiResponse && (
                            <div className="ai-bubble">
                                <strong>CogniCare</strong>
                                <p>{entry.aiResponse}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default JournalPage;