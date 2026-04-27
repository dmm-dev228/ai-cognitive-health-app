import { useEffect, useState } from "react";
import { createJournalEntry, getJournalEntries } from "../services/api";

function JournalPage() {
  const userId = 1; // Temporary test user until authentication is added

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);

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

    await createJournalEntry(userId, {
      title,  
      content,
      mood: "neutral",
      isPublic: false
    });

    setTitle("");
    setContent("");
    fetchEntries();
  };

  return (
    <section>
      <h2>Journal</h2>
      <input
        type = "text"
        value = {title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
    />
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
          <small>Mood: {entry.mood}</small>
          <hr />
        </article>
      ))}
    </section>
  );
}

export default JournalPage;