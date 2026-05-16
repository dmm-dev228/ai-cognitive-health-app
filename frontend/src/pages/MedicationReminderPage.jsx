import { useEffect, useState } from "react";
import {
  createMedicationReminder,
  getMedicationReminders,
  deleteMedicationReminder,
  toggleMedicationReminder
} from "../services/api";

function MedicationReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      const data = await getMedicationReminders();
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch medication reminders:", err);
      setReminders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFrequencyChange = (e) => {
    const count = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      frequencyPerDay: count,
      reminderTimes: Array(count).fill("")
    }));
  };

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = () => {
    if (!formData.medicationName.trim()) {
      return "Medication name is required.";
    }

    if (!formData.frequencyPerDay) {
      return "Please choose how many times per day.";
    }

    if (
      !formData.reminderTimes ||
      formData.reminderTimes.length !== Number(formData.frequencyPerDay) ||
      formData.reminderTimes.some((time) => !time)
    ) {
      return "Please select a reminder time for each daily dose.";
    }

    return "";
  };

  const handleSubmit = async () => {
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setError("");

      await createMedicationReminder(formData);

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
      });

      await fetchReminders();
    } catch (err) {
      console.error("Failed to create medication reminder:", err);
      setError("Could not create medication reminder. Please check your fields and try again.");
    }
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
    <section className="animate-fade-in">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
          Supportive Wellness Reminders
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Medication Reminder Center
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Build supportive medication routines with flexible reminder schedules,
          wellness tracking, and personalized notifications.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <div className="glass-card h-fit rounded-[2rem] p-6 lg:sticky lg:top-28">
          <div className="mb-6">
            <p className="text-sm font-semibold text-emerald-600">
              New Reminder
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Add Medication Routine
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create supportive reminders that help maintain routine consistency.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Medication Name <span className="text-red-500">*</span>
              </span>
              <input
                name="medicationName"
                placeholder="Medication Name"
                value={formData.medicationName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <input
              name="dosage"
              placeholder="Dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <input name="pillShape" placeholder="Shape" value={formData.pillShape} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
              <input name="pillColor" placeholder="Color" value={formData.pillColor} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
              <input name="pillSize" placeholder="Size" value={formData.pillSize} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Frequency Per Day <span className="text-red-500">*</span>
              </span>

              <select
                name="frequencyPerDay"
                value={formData.frequencyPerDay}
                onChange={handleFrequencyChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              >
                <option value={1}>Once daily</option>
                <option value={2}>Twice daily</option>
                <option value={3}>Three times daily</option>
                <option value={4}>Four times daily</option>
              </select>
            </label>

            <div className="space-y-3">
              {formData.reminderTimes.map((time, index) => (
                <label key={index} className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Reminder Time {index + 1} <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="time"
                    value={time}
                    required
                    onChange={(e) =>
                      handleReminderTimeChange(index, e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              ))}
            </div>

            <textarea
              name="notes"
              placeholder="Supportive notes..."
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />

            <button
              onClick={handleSubmit}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Add Reminder
            </button>
          </div>
        </div>

        {/* Reminder List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Your Medication Routines
              </h3>

              <p className="text-sm text-slate-500">
                View and manage supportive reminder schedules.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              {reminders.length} reminders
            </span>
          </div>

          {isLoading ? (
            <div className="glass-card rounded-3xl p-10 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />

              <p className="font-semibold text-slate-700">
                Loading reminders...
              </p>
            </div>
          ) : reminders.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-3xl">
                💊
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                No reminders yet.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Create your first supportive medication reminder to begin
                building a wellness routine.
              </p>
            </div>
          ) : (
            reminders.map((r) => (
              <div
                key={r.id}
                className="glass-card overflow-hidden rounded-[2rem]"
              >
                {/* Card Header */}
                <div className="border-b border-slate-100 bg-white/70 px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-2xl">
                          💊
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {r.medicationName}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {r.dosage || "Dosage not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${r.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="grid gap-6 p-6 lg:grid-cols-2">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Pill Details
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-slate-400">
                            Shape
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {r.pillShape || "Not set"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-slate-400">
                            Color
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {r.pillColor || "Not set"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-slate-400">
                            Size
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {r.pillSize || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Notes
                      </p>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {r.notes || "No notes added."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Daily Routine
                      </p>

                      <div className="mt-3 rounded-3xl bg-emerald-50 p-5">
                        <p className="text-sm font-semibold text-emerald-700">
                          {r.frequencyPerDay
                            ? `${r.frequencyPerDay} time(s) per day`
                            : "Frequency not set"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {Array.isArray(r.reminderTimes) &&
                            r.reminderTimes.length > 0 ? (
                            r.reminderTimes.map((time, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm"
                              >
                                {time}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">
                              No reminder times set.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Reminder Channels
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          r.inAppReminderEnabled ? "In-app" : null,
                          r.emailReminderEnabled ? "Email" : null
                        ]
                          .filter(Boolean)
                          .map((channel) => (
                            <span
                              key={channel}
                              className="rounded-full bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700"
                            >
                              {channel}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => handleToggle(r.id)}
                        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
                      >
                        {r.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDelete(r.id)}
                        className="rounded-2xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default MedicationReminderPage;