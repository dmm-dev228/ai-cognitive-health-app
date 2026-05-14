import { useEffect, useState } from "react";
import {
    createMedicationReminder,
    getMedicationReminders,
    deleteMedicationReminder,
    toggleMedicationReminder
} from "../services/api";

/*
 * MedicationReminderPage
 * ----------------------
 * Allows users to:
 * - Add medication reminders
 * - Include pill details for recognition
 * - Choose how many times per day the medication is taken
 * - Add multiple reminder times based on frequencyPerDay
 * - Choose reminder channels
 * - View, delete, and toggle reminders
 */
function MedicationReminderPage() {
    const [reminders, setReminders] = useState([]);

    const [formData, setFormData] = useState({
        medicationName: "",
        dosage: "",
        pillShape: "",
        pillColor: "",
        pillSize: "",
        frequencyPerDay: 1,
        reminderTimes: [""],
        notes: "",
        inAppReminderEnabled: true,
        emailReminderEnabled: false
        // smsReminderEnabled: false
    });

    useEffect(() => {
        fetchReminders();
    }, []);

/*
 * Fetch all reminders for the currently authenticated user.
 */
const fetchReminders = async () => {
    try {
        const data = await getMedicationReminders();

        console.log("Fetched medication reminders:", data);

        setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error("Failed to fetch medication reminders:", err);
        setReminders([]);
    }
};
    /*
     * Handles normal text input changes.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    /*
     * Updates frequencyPerDay and automatically creates
     * the matching number of time input fields.
     *
     * Example:
     * frequencyPerDay = 3
     * reminderTimes = ["", "", ""]
     */
    const handleFrequencyChange = (e) => {
        const count = Number(e.target.value);

        setFormData((prev) => ({
            ...prev,
            frequencyPerDay: count,
            reminderTimes: Array(count).fill("")
        }));
    };

    /*
     * Updates a specific reminder time inside reminderTimes.
     */
    const handleReminderTimeChange = (index, value) => {
        setFormData((prev) => {
            const updatedTimes = [...prev.reminderTimes];
            updatedTimes[index] = value;

            return {
                ...prev,
                reminderTimes: updatedTimes
            };
        });
    };

    /*
     * Handles checkbox changes for reminder channels.
     */
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    /*
     * Create a medication reminder.
     * Backend expects:
     * - frequencyPerDay
     * - reminderTimes array
     */
/*
 * Create a medication reminder.
 * Backend expects:
 * - frequencyPerDay
 * - reminderTimes array
 */
const handleSubmit = async () => {
    try {
        console.log("Submitting medication reminder:", formData);

        const savedReminder = await createMedicationReminder(formData);

        console.log("Saved medication reminder:", savedReminder);

        setFormData({
            medicationName: "",
            dosage: "",
            pillShape: "",
            pillColor: "",
            pillSize: "",
            frequencyPerDay: 1,
            reminderTimes: [""],
            notes: "",
            inAppReminderEnabled: true,
            emailReminderEnabled: false
            // smsReminderEnabled: false
        });

        await fetchReminders();
    } catch (err) {
        console.error("Failed to create medication reminder:", err);
        alert("Could not create medication reminder. Check console/backend logs.");
    }
};

    /*
     * Delete a reminder.
     */
    const handleDelete = async (id) => {
        await deleteMedicationReminder(id);
        fetchReminders();
    };

    /*
     * Toggle active/inactive status.
     */
    const handleToggle = async (id) => {
        await toggleMedicationReminder(id);
        fetchReminders();
    };

    return (
        <section>
            <h2>Medication Reminders</h2>
            <p>
                Add reminders to help keep track of medication routines.
                Reminders are supportive only and should follow the user’s care plan.
            </p>

            {/* FORM */}
            <div>
                <input
                    name="medicationName"
                    placeholder="Medication Name"
                    value={formData.medicationName}
                    onChange={handleChange}
                />

                <input
                    name="dosage"
                    placeholder="Dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                />

                <input
                    name="pillShape"
                    placeholder="Pill Shape (round, oval, capsule)"
                    value={formData.pillShape}
                    onChange={handleChange}
                />

                <input
                    name="pillColor"
                    placeholder="Pill Color"
                    value={formData.pillColor}
                    onChange={handleChange}
                />

                <input
                    name="pillSize"
                    placeholder="Pill Size"
                    value={formData.pillSize}
                    onChange={handleChange}
                />

                <label>
                    How many times per day?
                    <select
                        name="frequencyPerDay"
                        value={formData.frequencyPerDay}
                        onChange={handleFrequencyChange}
                    >
                        <option value={1}>Once daily</option>
                        <option value={2}>Twice daily</option>
                        <option value={3}>Three times daily</option>
                        <option value={4}>Four times daily</option>
                    </select>
                </label>

                {/* Dynamic reminder time inputs */}
                {formData.reminderTimes.map((time, index) => (
                    <label key={index}>
                        Reminder Time {index + 1}
                        <input
                            type="time"
                            value={time}
                            onChange={(e) =>
                                handleReminderTimeChange(index, e.target.value)
                            }
                        />
                    </label>
                ))}

                <input
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleChange}
                />

                <div>
                    <p>
                        <strong>Reminder Channels</strong>
                    </p>

                    <label>
                        <input
                            type="checkbox"
                            name="inAppReminderEnabled"
                            checked={formData.inAppReminderEnabled}
                            onChange={handleCheckboxChange}
                        />
                        In-app reminder
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            name="emailReminderEnabled"
                            checked={formData.emailReminderEnabled}
                            onChange={handleCheckboxChange}
                        />
                        Email reminder
                    </label>
                </div>

                <button onClick={handleSubmit}>Add Reminder</button>
            </div>

            {/* LIST */}
            <div>
                {reminders.map((r) => (
                    <div key={r.id}>
                        <p>
                            <strong>{r.medicationName}</strong>
                        </p>

                        <p>Dosage: {r.dosage || "Not set"}</p>
                        <p>Shape: {r.pillShape || "Not set"}</p>
                        <p>Color: {r.pillColor || "Not set"}</p>
                        <p>Size: {r.pillSize || "Not set"}</p>

                        <p>
                            Frequency:{" "}
                            {r.frequencyPerDay
                                ? `${r.frequencyPerDay} time(s) per day`
                                : "Not set"}
                        </p>

                        <p>
                            Times:{" "}
                            {Array.isArray(r.reminderTimes) &&
                            r.reminderTimes.length > 0
                                ? r.reminderTimes.join(", ")
                                : "Not set"}
                        </p>

                        <p>Notes: {r.notes || "None"}</p>

                        <p>Status: {r.isActive ? "Active" : "Inactive"}</p>

                        <p>
                            Channels:{" "}
                            {[
                                r.inAppReminderEnabled ? "In-app" : null,
                                r.emailReminderEnabled ? "Email" : null
                                // r.smsReminderEnabled ? "Phone/SMS" : null
                            ]
                                .filter(Boolean)
                                .join(", ") || "None"}
                        </p>

                        <button onClick={() => handleToggle(r.id)}>
                            Toggle
                        </button>

                        <button onClick={() => handleDelete(r.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default MedicationReminderPage;