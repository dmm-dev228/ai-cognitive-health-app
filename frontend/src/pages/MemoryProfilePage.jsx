import { useEffect, useState } from "react";
import { getMemoryProfile, saveMemoryProfile } from "../services/api";

/*
 * MemoryProfilePage
 * -----------------
 * Allows users to personalize supportive AI experiences
 * by storing meaningful memories, people, places,
 * music, and calming activities.
 */
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

  /*
   * Loads memory profile for current authenticated user.
   */
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

  /*
   * Updates local form state while user types.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  /*
   * Saves memory profile updates to backend.
   */
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
      <section className="animate-fade-in">
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />

          <p className="font-semibold text-slate-700">
            Loading memory profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
            Personalized Wellness
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Memory Profile
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Help CogniHaven better understand the people, places, activities,
            and memories that feel meaningful and comforting to you.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Edit Memory Profile
          </button>
        )}
      </div>

      {/* Error / Success states */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {saveMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {saveMessage}
        </div>
      )}

      {/* Edit Mode */}
      {isEditing ? (
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Update Your Memory Profile
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add supportive information that helps personalize reflections and
              wellness experiences.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Favorite People
              </span>

              <textarea
                name="favoritePeople"
                value={formData.favoritePeople}
                onChange={handleChange}
                rows="5"
                placeholder="Family, friends, or meaningful people..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Favorite Places
              </span>

              <textarea
                name="favoritePlaces"
                value={formData.favoritePlaces}
                onChange={handleChange}
                rows="5"
                placeholder="Places that feel meaningful or calming..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Calming Memories
              </span>

              <textarea
                name="calmingMemories"
                value={formData.calmingMemories}
                onChange={handleChange}
                rows="5"
                placeholder="Positive memories or experiences..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Favorite Music
              </span>

              <textarea
                name="favoriteMusic"
                value={formData.favoriteMusic}
                onChange={handleChange}
                rows="5"
                placeholder="Artists, songs, or music genres..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Comforting Activities
              </span>

              <textarea
                name="comfortingActivities"
                value={formData.comfortingActivities}
                onChange={handleChange}
                rows="5"
                placeholder="Activities that feel relaxing or grounding..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Triggers to Avoid
              </span>

              <textarea
                name="triggersToAvoid"
                value={formData.triggersToAvoid}
                onChange={handleChange}
                rows="5"
                placeholder="Situations or topics you'd prefer to avoid..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Save Memory Profile
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
        /* View Mode */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                👨‍👩‍👧
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Favorite People
                </h3>

                <p className="text-sm text-slate-500">
                  Meaningful relationships
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.favoritePeople || "Not added yet"}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                🏞️
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Favorite Places
                </h3>

                <p className="text-sm text-slate-500">
                  Comfortable environments
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.favoritePlaces || "Not added yet"}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🌿
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Calming Memories
                </h3>

                <p className="text-sm text-slate-500">
                  Positive reflections
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.calmingMemories || "Not added yet"}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                🎵
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Favorite Music
                </h3>

                <p className="text-sm text-slate-500">
                  Music and sound preferences
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.favoriteMusic || "Not added yet"}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                ☀️
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Comforting Activities
                </h3>

                <p className="text-sm text-slate-500">
                  Activities that feel grounding
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.comfortingActivities || "Not added yet"}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                ⚠️
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Triggers to Avoid
                </h3>

                <p className="text-sm text-slate-500">
                  Supportive preference awareness
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {formData.triggersToAvoid || "Not added yet"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default MemoryProfilePage;