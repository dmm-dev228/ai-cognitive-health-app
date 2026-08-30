import { useEffect, useState } from "react";
import {
  createMedicationReminder,
  getMedicationReminders,
  deleteMedicationReminder,
  toggleMedicationReminder,
} from "../services/api";

function MedicationReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
    emailReminderEnabled: false,
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
      [name]: value,
    }));
  };

  const handleFrequencyChange = (e) => {
    const count = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      frequencyPerDay: count,
      reminderTimes: Array(count).fill(""),
    }));
  };

  const handleReminderTimeChange = (index, value) => {
    setFormData((prev) => {
      const updatedTimes = [...prev.reminderTimes];

      updatedTimes[index] = value;

      return {
        ...prev,
        reminderTimes: updatedTimes,
      };
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
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

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

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
        emailReminderEnabled: false,
      });

      await fetchReminders();
    } catch (err) {
      console.error("Failed to create medication reminder:", err);

      setError(
        "Could not create medication reminder. Please check your fields and try again."
      );
    }
  };

  const handleDelete = async (id) => {
    await deleteMedicationReminder(id);
    fetchReminders();
  };

  const handleToggle = async (id) => {
    try {
      setTogglingId(id);

      await toggleMedicationReminder(id);

      const reminder = reminders.find((r) => r.id === id);

      setSuccessMessage(
        reminder?.isActive
          ? "Reminder paused successfully."
          : "Reminder resumed successfully."
      );

      await fetchReminders();

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.error(err);

      setError("Could not update reminder status.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <section className="animate-fade-in">
      {/* =========================================================
          PAGE HEADER
          ========================================================= */}
      <div className="mb-5 sm:mb-7 lg:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500 sm:text-sm sm:tracking-[0.25em]">
          Supportive Wellness Reminders
        </p>

        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 min-[390px]:text-3xl sm:mt-3 sm:text-4xl">
          Medication Reminder Center
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Build supportive medication routines with flexible reminder schedules,
          wellness tracking, and personalized notifications.
        </p>
      </div>

      {/* =========================================================
          FEEDBACK MESSAGES
          ========================================================= */}
      {error && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-600 sm:mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 animate-fade-in rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-700 shadow-md sm:mb-6 sm:px-5 sm:py-4">
          {successMessage}
        </div>
      )}

      {/* =========================================================
          MAIN MEDICATION LAYOUT
          ========================================================= */}
      <div className="grid gap-5 sm:gap-6 xl:grid-cols-[420px_1fr] xl:gap-8">
        {/* =======================================================
            NEW REMINDER FORM
            ======================================================= */}
        <div className="glass-card h-fit rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6 xl:sticky xl:top-28">
          <div className="mb-5 sm:mb-6">
            <p className="text-sm font-semibold text-emerald-600">
              New Reminder
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Add Medication Routine
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create supportive reminders that help maintain routine
              consistency.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Medication Name */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Medication Name <span className="text-red-500">*</span>
              </span>

              <input
                name="medicationName"
                placeholder="Medication Name"
                value={formData.medicationName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            {/* Dosage */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Dosage
              </span>

              <input
                name="dosage"
                placeholder="Example: 10 mg"
                value={formData.dosage}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            {/* Pill Appearance */}
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Pill Appearance
              </p>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <input
                  name="pillShape"
                  placeholder="Shape"
                  value={formData.pillShape}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />

                <input
                  name="pillColor"
                  placeholder="Color"
                  value={formData.pillColor}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />

                <input
                  name="pillSize"
                  placeholder="Size"
                  value={formData.pillSize}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Frequency */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Frequency Per Day <span className="text-red-500">*</span>
              </span>

              <select
                name="frequencyPerDay"
                value={formData.frequencyPerDay}
                onChange={handleFrequencyChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                <option value={1}>Once daily</option>
                <option value={2}>Twice daily</option>
                <option value={3}>Three times daily</option>
                <option value={4}>Four times daily</option>
              </select>
            </label>

            {/* Reminder Times */}
            <div className="space-y-3">
              {formData.reminderTimes.map((time, index) => (
                <label key={index} className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Reminder Time {index + 1}{" "}
                    <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="time"
                    value={time}
                    required
                    onChange={(e) =>
                      handleReminderTimeChange(index, e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              ))}
            </div>

            {/* Notes */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Notes
              </span>

              <textarea
                name="notes"
                placeholder="Supportive notes..."
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            {/* Reminder Channels */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:rounded-3xl sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Reminder Channels
              </p>

              <div className="mt-3 grid gap-3 sm:mt-4">
                {/* In-App */}
                <div
                  onClick={(event) => event.stopPropagation()}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm sm:py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      In-app notifications
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Show reminders inside CogniHaven
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="inAppReminderEnabled"
                    checked={formData.inAppReminderEnabled}
                    onChange={handleCheckboxChange}
                    onClick={(event) => event.stopPropagation()}
                    className="h-5 w-5 shrink-0 accent-emerald-500"
                  />
                </div>

                {/* Email */}
                <div
                  onClick={(event) => event.stopPropagation()}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm sm:py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      Email reminders
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Send reminder emails
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="emailReminderEnabled"
                    checked={formData.emailReminderEnabled}
                    onChange={handleCheckboxChange}
                    onClick={(event) => event.stopPropagation()}
                    className="h-5 w-5 shrink-0 accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Add Reminder */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Add Reminder
            </button>
          </div>
        </div>

        {/* =======================================================
            REMINDER LIST
            ======================================================= */}
        <div className="min-w-0 space-y-4 sm:space-y-6">
          {/* Reminder List Header */}
          <div className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:px-5">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                Your Medication Routines
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                View and manage supportive reminder schedules.
              </p>
            </div>

            <span className="w-fit shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 sm:text-sm">
              {reminders.length} reminders
            </span>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="glass-card rounded-2xl p-7 text-center sm:rounded-3xl sm:p-10">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />

              <p className="font-semibold text-slate-700">
                Loading reminders...
              </p>
            </div>
          ) : reminders.length === 0 ? (
            /* Empty State */
            <div className="glass-card rounded-2xl p-7 text-center sm:rounded-3xl sm:p-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl sm:mb-5 sm:h-16 sm:w-16 sm:rounded-3xl">
                💊
              </div>

              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
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
                className="glass-card min-w-0 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]"
              >
                {/* =================================================
                    REMINDER CARD HEADER
                    ================================================= */}
                <div className="border-b border-slate-100 bg-white/70 px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl sm:h-14 sm:w-14 sm:rounded-3xl sm:text-2xl">
                          💊
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                            {r.medicationName}
                          </h3>

                          <p className="mt-1 break-words text-sm text-slate-500">
                            {r.dosage || "Dosage not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reminder Status */}
                    <span
                      className={`flex w-fit shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                        r.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          r.isActive
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    REMINDER CARD BODY
                    ================================================= */}
                <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-2 lg:gap-6">
                  {/* Left Column */}
                  <div className="min-w-0 space-y-5">
                    {/* Pill Details */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Pill Details
                      </p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3 sm:gap-3">
                        <div className="min-w-0 rounded-2xl bg-slate-50 p-3 sm:p-4">
                          <p className="text-xs font-semibold text-slate-400">
                            Shape
                          </p>

                          <p className="mt-1 break-words text-sm font-bold text-slate-800">
                            {r.pillShape || "Not set"}
                          </p>
                        </div>

                        <div className="min-w-0 rounded-2xl bg-slate-50 p-3 sm:p-4">
                          <p className="text-xs font-semibold text-slate-400">
                            Color
                          </p>

                          <p className="mt-1 break-words text-sm font-bold text-slate-800">
                            {r.pillColor || "Not set"}
                          </p>
                        </div>

                        <div className="min-w-0 rounded-2xl bg-slate-50 p-3 sm:p-4">
                          <p className="text-xs font-semibold text-slate-400">
                            Size
                          </p>

                          <p className="mt-1 break-words text-sm font-bold text-slate-800">
                            {r.pillSize || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Notes
                      </p>

                      <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                        {r.notes || "No notes added."}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="min-w-0 space-y-5">
                    {/* Daily Routine */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Daily Routine
                      </p>

                      <div className="mt-3 rounded-2xl bg-emerald-50 p-4 sm:rounded-3xl sm:p-5">
                        <p className="text-sm font-semibold text-emerald-700">
                          {r.frequencyPerDay
                            ? `${r.frequencyPerDay} time(s) per day`
                            : "Frequency not set"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                          {Array.isArray(r.reminderTimes) &&
                          r.reminderTimes.length > 0 ? (
                            r.reminderTimes.map((time, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-white px-3 py-2 text-xs font-bold text-emerald-700 shadow-sm sm:px-4"
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

                    {/* Reminder Channels */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Reminder Channels
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          r.inAppReminderEnabled ? "In-app" : null,
                          r.emailReminderEnabled ? "Email" : null,
                        ]
                          .filter(Boolean)
                          .map((channel) => (
                            <span
                              key={channel}
                              className="rounded-full bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 sm:px-4"
                            >
                              {channel}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid gap-2 pt-2 sm:flex sm:flex-wrap sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(r.id)}
                        disabled={togglingId === r.id}
                        className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                          r.isActive
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                      >
                        {togglingId === r.id
                          ? "Updating..."
                          : r.isActive
                            ? "Pause Reminder"
                            : "Resume Reminder"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="w-full rounded-2xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:w-auto"
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