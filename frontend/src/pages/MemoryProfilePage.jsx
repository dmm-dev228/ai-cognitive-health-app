import { useEffect, useState } from "react";
import { getMemoryProfile, saveMemoryProfile } from "../services/api";


function MemoryProfilePage() {
    const userId = 1; // Temporary test user until authentication is added

    const [saveMessage, setSaveMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
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
        setIsEditing(false);
        fetchMemoryProfile();

        setTimeout(() => {
            setSaveMessage("");
        }, 3000);
    };

    return (
        <section>
            <h2>Memory Profile</h2>
            <p>Help CogniCare personalize supportive responses for you.</p>

            {/* Edit button ONLY shows when NOT editing */}
            {!isEditing && (
                <button onClick={() => setIsEditing(true)}>
                    Edit Memory Profile
                </button>
            )}

            {/* Conditional rendering */}
            {isEditing ? (
                /* ===== EDIT MODE ===== */
                <div>

                    <label>Favorite People</label>
                    <textarea
                        name="favoritePeople"
                        value={formData.favoritePeople}
                        onChange={handleChange}
                    />

                    <label>Favorite Places</label>
                    <textarea
                        name="favoritePlaces"
                        value={formData.favoritePlaces}
                        onChange={handleChange}
                    />

                    <label>Calming Memories</label>
                    <textarea
                        name="calmingMemories"
                        value={formData.calmingMemories}
                        onChange={handleChange}
                    />

                    <label>Favorite Music</label>
                    <textarea
                        name="favoriteMusic"
                        value={formData.favoriteMusic}
                        onChange={handleChange}
                    />

                    <label>Comforting Activities</label>
                    <textarea
                        name="comfortingActivities"
                        value={formData.comfortingActivities}
                        onChange={handleChange}
                    />

                    <label>Triggers to Avoid</label>
                    <textarea
                        name="triggersToAvoid"
                        value={formData.triggersToAvoid}
                        onChange={handleChange}
                    />

                    <button onClick={handleSubmit}>Save Memory Profile</button>

                </div>
            ) : (
                /* ===== VIEW MODE ===== */
                <div>
                    <p><strong>Favorite People:</strong> {formData.favoritePeople}</p>
                    <p><strong>Favorite Places:</strong> {formData.favoritePlaces}</p>
                    <p><strong>Calming Memories:</strong> {formData.calmingMemories}</p>
                    <p><strong>Favorite Music:</strong> {formData.favoriteMusic}</p>
                    <p><strong>Comforting Activities:</strong> {formData.comfortingActivities}</p>
                    <p><strong>Triggers to Avoid:</strong> {formData.triggersToAvoid}</p>
                </div>
            )}

            {/* Save message */}
            {saveMessage && <p>{saveMessage}</p>}
        </section>
    );
}

export default MemoryProfilePage;