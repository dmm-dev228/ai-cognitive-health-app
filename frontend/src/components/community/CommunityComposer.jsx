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
  onSubmit,
}) {
  const categoryGuidance = {
    REFLECTION: "What helped you feel grounded today?",
    ROUTINE: "What healthy habit helped your day feel calmer?",
    ENCOURAGEMENT: "Share something uplifting that may help someone else.",
    WELLNESS_TIP: "Share a gentle tip that supports daily wellness.",
  };

  return (
    <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
      {!isComposerOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white/75 p-3 text-left transition hover:bg-white hover:shadow-md sm:gap-4 sm:rounded-3xl sm:p-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-lg font-black text-white sm:h-12 sm:w-12 sm:rounded-2xl">
            +
          </div>

          <div className="min-w-0">
            <p className="break-words text-sm font-bold leading-5 text-slate-900">
              What would you like to share today?
            </p>

            <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
              Reflection, routine, encouragement, or wellness tip
            </p>
          </div>
        </button>
      ) : (
        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="break-words text-sm font-bold text-slate-900">
                Create a supportive post
              </p>

              <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                Share something helpful with the community.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-fit shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
            >
              Close
            </button>
          </div>

          <div className="min-w-0 space-y-4">
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Give your post a title"
              className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
            />

            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
              <option value="REFLECTION">Reflection</option>
              <option value="ROUTINE">Routine</option>
              <option value="ENCOURAGEMENT">Encouragement</option>
              <option value="WELLNESS_TIP">Wellness Tip</option>
            </select>

            <div className="break-words rounded-2xl bg-violet-50 px-4 py-3 text-sm font-medium leading-6 text-violet-700">
              {categoryGuidance[category]}
            </div>

            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Share in a way that feels supportive, kind, and safe..."
              rows="5"
              className="w-full min-w-0 resize-none rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 sm:rounded-[1.5rem]"
            />

            <button
              type="button"
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
