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
        reminderTime: "",
        frequency: "",
        notes: "",
        inAppReminderEnabled: true,
        emailReminderEnabled: false,
    //  smsReminderEnabled: false
    });

    useEffect(() => {
        fetchReminders();
    }, []);

    /*
     * Fetch all reminders for current authenticated user.
     */
    const fetchReminders = async () => {
        const data = await getMedicationReminders();
        setReminders(Array.isArray(data) ? data : []);
    };

    /*
     * Handles text/time input changes.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
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
     */
    const handleSubmit = async () => {
        await createMedicationReminder(formData);

        setFormData({
            medicationName: "",
            dosage: "",
            pillShape: "",
            pillColor: "",
            pillSize: "",
            reminderTime: "",
            frequency: "",
            notes: "",
            inAppReminderEnabled: true,
            emailReminderEnabled: false,
        //  smsReminderEnabled: false
        });

        fetchReminders();
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

                <input
                    type="time"
                    name="reminderTime"
                    value={formData.reminderTime}
                    onChange={handleChange}
                />

                <input
                    name="frequency"
                    placeholder="Frequency (e.g. daily, twice daily)"
                    value={formData.frequency}
                    onChange={handleChange}
                />

                <input
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleChange}
                />

                <div>
                    <p><strong>Reminder Channels</strong></p>

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

                <button onClick={handleSubmit}>
                    Add Reminder
                </button>
            </div>

            {/* LIST */}
            <div>
                {reminders.map((r) => (
                    <div key={r.id}>
                        <p><strong>{r.medicationName}</strong></p>
                        <p>Dosage: {r.dosage || "Not set"}</p>
                        <p>Shape: {r.pillShape || "Not set"}</p>
                        <p>Color: {r.pillColor || "Not set"}</p>
                        <p>Size: {r.pillSize || "Not set"}</p>
                        <p>Time: {r.reminderTime}</p>
                        <p>Frequency: {r.frequency || "Not set"}</p>
                        <p>Notes: {r.notes || "None"}</p>

                        <p>Status: {r.isActive ? "Active" : "Inactive"}</p>

                        <p>
                            Channels:{" "}
                            {[
                                r.inAppReminderEnabled ? "In-app" : null,
                                r.emailReminderEnabled ? "Email" : null,
                            //   r.smsReminderEnabled ? "Phone/SMS" : null
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