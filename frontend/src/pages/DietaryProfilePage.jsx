import { useEffect, useState } from "react";
import { getDietaryProfile, saveDietaryProfile } from "../services/api";

/*
 * DietaryProfilePage
 * ------------------
 * Allows users to:
 * - View their dietary profile
 * - Edit/update preferences
 * - Persist data per authenticated user (JWT-based)
 */
function DietaryProfilePage() {
    const [formData, setFormData] = useState({
        favoriteFoods: "",
        foodsToAvoid: "",
        allergies: "",
        dietaryNotes: "",
        hydrationReminderPreference: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDietaryProfile();
    }, []);

    /*
     * Fetch dietary profile for current user
     */
    const fetchDietaryProfile = async () => {
        try {
            setIsLoading(true);
            setError("");

            const data = await getDietaryProfile();

            if (data && !data.status) {
                setFormData({
                    favoriteFoods: data.favoriteFoods || "",
                    foodsToAvoid: data.foodsToAvoid || "",
                    allergies: data.allergies || "",
                    dietaryNotes: data.dietaryNotes || "",
                    hydrationReminderPreference:
                        data.hydrationReminderPreference || ""
                });
            }
        } catch (err) {
            console.error("Failed to load dietary profile:", err);
            setError("Could not load dietary profile.");
        } finally {
            setIsLoading(false);
        }
    };

    /*
     * Handle form field updates
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    /*
     * Save dietary profile
     */
    const handleSubmit = async () => {
        try {
            setError("");

            await saveDietaryProfile(formData);

            setMessage("Dietary profile saved.");
            setIsEditing(false);

            fetchDietaryProfile();

            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Failed to save dietary profile:", err);
            setError("Could not save dietary profile.");
        }
    };

    if (isLoading) {
        return <p>Loading dietary profile...</p>;
    }

    return (
        <section>
            <h2>Dietary Profile</h2>
            <p>Help CogniHaven personalize dietary support and reminders.</p>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            {!isEditing && (
                <button onClick={() => setIsEditing(true)}>
                    Edit Dietary Profile
                </button>
            )}

            {isEditing ? (
                <div>
                    <label>Favorite Foods</label>
                    <textarea
                        name="favoriteFoods"
                        value={formData.favoriteFoods}
                        onChange={handleChange}
                    />

                    <label>Foods to Avoid</label>
                    <textarea
                        name="foodsToAvoid"
                        value={formData.foodsToAvoid}
                        onChange={handleChange}
                    />

                    <label>Allergies</label>
                    <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                    />

                    <label>Dietary Notes</label>
                    <textarea
                        name="dietaryNotes"
                        value={formData.dietaryNotes}
                        onChange={handleChange}
                    />

                    <label>Hydration Reminder Preference</label>
                    <input
                        type="text"
                        name="hydrationReminderPreference"
                        value={formData.hydrationReminderPreference}
                        onChange={handleChange}
                    />

                    <button onClick={handleSubmit}>
                        Save Dietary Profile
                    </button>
                </div>
            ) : (
                <div>
                    <p><strong>Favorite Foods:</strong> {formData.favoriteFoods || "Not set"}</p>
                    <p><strong>Foods to Avoid:</strong> {formData.foodsToAvoid || "Not set"}</p>
                    <p><strong>Allergies:</strong> {formData.allergies || "Not set"}</p>
                    <p><strong>Dietary Notes:</strong> {formData.dietaryNotes || "Not set"}</p>
                    <p>
                        <strong>Hydration Preference:</strong>{" "}
                        {formData.hydrationReminderPreference || "Not set"}
                    </p>
                </div>
            )}
        </section>
    );
}

export default DietaryProfilePage;