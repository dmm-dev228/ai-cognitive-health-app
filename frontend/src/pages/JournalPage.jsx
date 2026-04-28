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

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        const data = await getJournalEntries(userId);
        setEntries(data);
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            return;
        }

        const savedEntry = await createJournalEntry(userId, {
            title,
            content,
            mood,
            isPublic: false
        });

        await generateJournalReflection(savedEntry.id);

        setTitle("");
        setContent("");
        fetchEntries();
    };

    return (
        <section>
            <h2>Journal</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
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
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write your thoughts..."
                rows="6"
            />

            <br />

            <button onClick={handleSubmit}>Save Entry</button>

            <h3>Previous Entries</h3>

            {entries.map((entry) => (
                <article key={entry.id}>
                    <h4>{entry.title}</h4>
                    <p>{entry.content}</p>

                    <small>
                        Mood: {entry.mood} {moodEmojis[entry.mood]}
                    </small>

                    {/* AI Response */}
                    {entry.aiResponse && (
                        <div>
                            <strong>CogniCare:</strong>
                            <p>{entry.aiResponse}</p>
                        </div>
                    )}

                    <hr />
                </article>
            ))}
        </section>
    );
}

export default JournalPage;