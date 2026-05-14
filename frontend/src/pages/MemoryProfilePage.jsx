import { useEffect, useState } from "react";
import { getMemoryProfile, saveMemoryProfile } from "../services/api";

function MemoryProfilePage() {
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
        try {
            setIsLoading(true);
            setError("");

            const data = await getMemoryProfile();

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
        } catch (err) {
            console.error("Failed to fetch memory profile:", err);
            setError("Could not load memory profile.");
        } finally {
            setIsLoading(false);
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
        try {
            setError("");

            await saveMemoryProfile(formData);

            setSaveMessage("Memory profile saved successfully.");
            setIsEditing(false);
            fetchMemoryProfile();

            setTimeout(() => {
                setSaveMessage("");
            }, 3000);
        } catch (err) {
            console.error("Failed to save memory profile:", err);
            setError("Could not save memory profile.");
        }
    };

    if (isLoading) {
        return (
            <section>
                <h2>Memory Profile</h2>
                <p>Loading memory profile...</p>
            </section>
        );
    }

    return (
        <section>
            <h2>Memory Profile</h2>
            <p>Help CogniHaven personalize supportive responses for you.</p>

            {error && <p>{error}</p>}
            {saveMessage && <p>{saveMessage}</p>}

            {!isEditing && (
                <button onClick={() => setIsEditing(true)}>
                    Edit Memory Profile
                </button>
            )}

            {isEditing ? (
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

                    <button onClick={handleSubmit}>
                        Save Memory Profile
                    </button>
                </div>
            ) : (
                <div>
                    <p><strong>Favorite People:</strong> {formData.favoritePeople || "Not added yet"}</p>
                    <p><strong>Favorite Places:</strong> {formData.favoritePlaces || "Not added yet"}</p>
                    <p><strong>Calming Memories:</strong> {formData.calmingMemories || "Not added yet"}</p>
                    <p><strong>Favorite Music:</strong> {formData.favoriteMusic || "Not added yet"}</p>
                    <p><strong>Comforting Activities:</strong> {formData.comfortingActivities || "Not added yet"}</p>
                    <p><strong>Triggers to Avoid:</strong> {formData.triggersToAvoid || "Not added yet"}</p>
                </div>
            )}
        </section>
    );
}

export default MemoryProfilePage;