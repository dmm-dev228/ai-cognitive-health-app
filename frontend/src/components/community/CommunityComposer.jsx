/*
 * CommunityComposer
 * -----------------
 * Handles the UI for creating a supportive community post.
 *
 * This component does not call the API directly.
 * CommunityPage owns the data logic and passes handlers down.
 */
function CommunityComposer({
  title,
  content,
  category,
  isPosting,
  isComposerOpen,
  onOpen,
  onClose,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onSubmit
}) {
  const categoryGuidance = {
    REFLECTION: "What helped you feel grounded today?",
    ROUTINE: "What healthy habit helped your day feel calmer?",
    ENCOURAGEMENT: "Share something uplifting that may help someone else.",
    WELLNESS_TIP: "Share a gentle tip that supports daily wellness."
  };

  return (
    <div className="glass-card rounded-[2rem] p-5">
      {!isComposerOpen ? (
        <button
          onClick={onOpen}
          className="flex w-full items-center gap-4 rounded-3xl border border-slate-100 bg-white/75 p-4 text-left transition hover:bg-white hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 font-black text-white">
            +
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              What would you like to share today?
            </p>
            <p className="text-sm text-slate-500">
              Reflection, routine, encouragement, or wellness tip
            </p>
          </div>
        </button>
      ) : (
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Create a supportive post
              </p>
              <p className="text-sm text-slate-500">
                Share something helpful with the community.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Give your post a title"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="REFLECTION">Reflection</option>
              <option value="ROUTINE">Routine</option>
              <option value="ENCOURAGEMENT">Encouragement</option>
              <option value="WELLNESS_TIP">Wellness Tip</option>
            </select>

            <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-medium leading-6 text-violet-700">
              {categoryGuidance[category]}
            </div>

            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Share in a way that feels supportive, kind, and safe..."
              rows="5"
              className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <button
              onClick={onSubmit}
              disabled={isPosting}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPosting ? "Posting..." : "Share with Community"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityComposer;