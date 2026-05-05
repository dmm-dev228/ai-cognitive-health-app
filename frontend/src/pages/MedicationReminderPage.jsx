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
 * - Add reminders
 * - View reminders
 * - Delete reminders
 * - Toggle active status
 */
function MedicationReminderPage() {

    const [reminders, setReminders] = useState([]);
    const [formData, setFormData] = useState({
        medicationName: "",
        dosage: "",
        reminderTime: "",
        frequency: "",
        notes: "",
        notificationMethod: "IN_APP"
    });

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        const data = await getMedicationReminders();
        setReminders(Array.isArray(data) ? data : []);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        await createMedicationReminder(formData);

        setFormData({
            medicationName: "",
            dosage: "",
            reminderTime: "",
            frequency: "",
            notes: "",
            notificationMethod: "IN_APP"
        });

        fetchReminders();
    };

    const handleDelete = async (id) => {
        await deleteMedicationReminder(id);
        fetchReminders();
    };

    const handleToggle = async (id) => {
        await toggleMedicationReminder(id);
        fetchReminders();
    };

    return (
        <section>
            <h2>Medication Reminders</h2>

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
                    type="time"
                    name="reminderTime"
                    value={formData.reminderTime}
                    onChange={handleChange}
                />

                <input
                    name="frequency"
                    placeholder="Frequency (e.g. daily)"
                    value={formData.frequency}
                    onChange={handleChange}
                />

                <input
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleChange}
                />

                <select
                    name="notificationMethod"
                    value={formData.notificationMethod}
                    onChange={handleChange}
                >
                    <option value="IN_APP">In App</option>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                </select>

                <button onClick={handleSubmit}>
                    Add Reminder
                </button>
            </div>

            {/* LIST */}
            <div>
                {reminders.map((r) => (
                    <div key={r.id}>
                        <p><strong>{r.medicationName}</strong></p>
                        <p>{r.dosage}</p>
                        <p>{r.reminderTime}</p>
                        <p>{r.frequency}</p>
                        <p>{r.notes}</p>
                        <p>Status: {r.isActive ? "Active" : "Inactive"}</p>

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