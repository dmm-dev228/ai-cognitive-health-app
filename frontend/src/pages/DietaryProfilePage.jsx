import { useEffect, useState } from "react";
import { getDietaryProfile, saveDietaryProfile } from "../services/api";

/*
 * DietaryProfilePage
 * ------------------
 * Allows users to:
 * - View their dietary profile
 * - Edit/update preferences
 * - Track completion progress
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

  /*
   * Calculates how complete the user's dietary profile is.
   * This is used to make the profile feel more like a guided wellness setup.
   */
  const completedFields = Object.values(formData).filter(
    (value) => value && value.trim() !== ""
  ).length;

  const totalFields = Object.keys(formData).length;

  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100
  );

  const isProfileEmpty = completedFields === 0;

  useEffect(() => {
    fetchDietaryProfile();
  }, []);

  /*
   * Fetch dietary profile for current user.
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
   * Handle form field updates.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /*
   * Save dietary profile.
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
    return (
      <section className="animate-fade-in">
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />

          <p className="font-semibold text-slate-700">
            Loading dietary profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-in">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
            Wellness Nutrition
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Dietary Profile
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Build a gentle nutrition support profile that helps CogniHaven
            personalize hydration reminders, food preferences, and wellness
            reflections.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {isProfileEmpty ? "Create Dietary Profile" : "Edit Dietary Profile"}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Success message */}
      {message && (
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}

      {/* Wellness completion snapshot */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Daily Wellness Snapshot
          </p>

          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Your nutrition support profile is {completionPercentage}% complete
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            CogniHaven uses this information to make hydration reminders, food
            preferences, and wellness reflections feel more personal,
            supportive, and calm.
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {isProfileEmpty && (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              Start with just one or two sections. This profile is meant to
              support your daily wellness, not pressure you to be perfect.
            </p>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm font-semibold text-slate-500">
            Completed Sections
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-900">
            {completedFields}/{totalFields}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Small updates help CogniHaven better support your daily wellness
            routine.
          </p>
        </div>
      </div>

      {/* Gentle wellness insight cards */}
      {!isEditing && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
            <p className="text-2xl">💧</p>
            <h4 className="mt-3 font-bold text-slate-900">
              Hydration Awareness
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Hydration reminders can help support a steady daily routine.
            </p>
          </div>

          <div className="rounded-3xl border border-teal-100 bg-teal-50/70 p-5">
            <p className="text-2xl">🥗</p>
            <h4 className="mt-3 font-bold text-slate-900">
              Food Preferences
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Favorite foods and foods to avoid help personalize future wellness
              suggestions.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-5">
            <p className="text-2xl">🌤️</p>
            <h4 className="mt-3 font-bold text-slate-900">
              Gentle Consistency
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              CogniHaven focuses on supportive habits, not strict dieting or
              pressure.
            </p>
          </div>
        </div>
      )}

      {isEditing ? (
        /* Edit mode */
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Update Your Wellness Preferences
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your nutrition and hydration preferences up to date so
              CogniHaven can better personalize your experience.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Favorite Foods
              </span>

              <textarea
                name="favoriteFoods"
                value={formData.favoriteFoods}
                onChange={handleChange}
                rows="5"
                placeholder="Foods you enjoy most..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Foods to Avoid
              </span>

              <textarea
                name="foodsToAvoid"
                value={formData.foodsToAvoid}
                onChange={handleChange}
                rows="5"
                placeholder="Foods you'd prefer to avoid..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Allergies
              </span>

              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="4"
                placeholder="List any allergies..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Dietary Notes
              </span>

              <textarea
                name="dietaryNotes"
                value={formData.dietaryNotes}
                onChange={handleChange}
                rows="4"
                placeholder="Additional dietary preferences or wellness notes..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          <div className="mt-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Hydration Reminder Preference
              </span>

              <input
                type="text"
                name="hydrationReminderPreference"
                value={formData.hydrationReminderPreference}
                onChange={handleChange}
                placeholder="Example: Every 2 hours"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Save Dietary Profile
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View mode */
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🍎
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Favorite Foods
                </h3>

                <p className="text-sm text-slate-500">
                  Foods you enjoy regularly
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.favoriteFoods ||
                "Not set yet. Add foods you enjoy so CogniHaven can better personalize your wellness experience."}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                🚫
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Foods to Avoid
                </h3>

                <p className="text-sm text-slate-500">
                  Preferences and restrictions
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.foodsToAvoid ||
                "Not set yet. You can add foods you prefer to avoid for a more respectful experience."}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                ⚠️
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Allergies
                </h3>

                <p className="text-sm text-slate-500">
                  Important allergy information
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.allergies ||
                "Not set yet. Add allergy information if you want CogniHaven to keep it in mind."}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                💧
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Hydration Preference
                </h3>

                <p className="text-sm text-slate-500">
                  Reminder schedule preference
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.hydrationReminderPreference ||
                "Not set yet. Example: Every 2 hours, morning and evening, or gentle daily reminders."}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                📝
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Dietary Notes
                </h3>

                <p className="text-sm text-slate-500">
                  Additional wellness and nutrition notes
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.dietaryNotes ||
                "Not set yet. Add any extra notes that would help CogniHaven support your routine in a calm, personalized way."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default DietaryProfilePage;