import { useEffect, useState } from "react";
import { getMemoryProfile, saveMemoryProfile } from "../services/api";


function MemoryProfilePage() {
    const userId = 1; // Temporary test user until authentication is added

    const [saveMessage, setSaveMessage] = useState("");

    const [formData, setFormData] = useState({
        favoritePeople: "",
        favoritePlaces: "",
        calmingMemories: "",
        favoriteMusic: "",
        comfortingActivities: "",
        triggersToAvoid: ""
    });

    useEffect(() => {
        fetchMemoryProfile();
    }, []);

    const fetchMemoryProfile = async () => {
        const data = await getMemoryProfile(userId);

        if (data && !data.status) {
            setFormData({
                favoritePeople: data.favoritePeople || "",
                favoritePlaces: data.favoritePlaces || "",
                calmingMemories: data.calmingMemories || "",
                favoriteMusic: data.favoriteMusic || "",
                comfortingActivities: data.comfortingActivities || "",
                triggersToAvoid: data.triggersToAvoid || ""
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        await saveMemoryProfile(userId, formData);

        setSaveMessage("Memory profile saved successfully.");
        fetchMemoryProfile();

        setTimeout(() => {
            setSaveMessage("");
        }, 3000);
    };

    return (
        <section>
            <h2>Memory Profile</h2>
            <p>Help CogniCare personalize supportive responses for you.</p>

            <label>Favorite People</label>
            <textarea
                name="favoritePeople"
                value={formData.favoritePeople}
                onChange={handleChange}
                placeholder="Example: Mom, Dad, sister, best friend..."
            />

            <label>Favorite Places</label>
            <textarea
                name="favoritePlaces"
                value={formData.favoritePlaces}
                onChange={handleChange}
                placeholder="Example: the beach, church, grandma's house..."
            />

            <label>Calming Memories</label>
            <textarea
                name="calmingMemories"
                value={formData.calmingMemories}
                onChange={handleChange}
                placeholder="Example: fishing with family, Sunday dinners..."
            />

            <label>Favorite Music</label>
            <textarea
                name="favoriteMusic"
                value={formData.favoriteMusic}
                onChange={handleChange}
                placeholder="Example: gospel, jazz, old school R&B..."
            />

            <label>Comforting Activities</label>
            <textarea
                name="comfortingActivities"
                value={formData.comfortingActivities}
                onChange={handleChange}
                placeholder="Example: walking, prayer, puzzles, cooking..."
            />

            <label>Triggers to Avoid</label>
            <textarea
                name="triggersToAvoid"
                value={formData.triggersToAvoid}
                onChange={handleChange}
                placeholder="Example: loud noises, stressful topics..."
            />

            <button onClick={handleSubmit}>Save Memory Profile</button>
            {saveMessage && <p>{saveMessage}</p>}
        </section>
    );
}

export default MemoryProfilePage;