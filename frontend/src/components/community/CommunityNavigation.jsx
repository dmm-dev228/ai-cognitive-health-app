/*
 * CommunityNavigation
 * -------------------
 * Left-side navigation for filtering community spaces.
 *
 * Also displays a simple snapshot of community activity.
 */
function CommunityNavigation({
  filters,
  activeFilter,
  onFilterChange,
  posts,
}) {
  const routinePostCount = posts.filter(
    (post) => post.category === "ROUTINE"
  ).length;

  return (
    <aside className="min-w-0 space-y-4 sm:space-y-5 xl:sticky xl:top-28 xl:h-fit">
      <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
        <p className="text-sm font-bold text-slate-900">
          Community Spaces
        </p>

        <div className="mt-4 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`flex min-h-11 min-w-0 items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition sm:gap-3 sm:px-4 ${
                activeFilter === filter.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-indigo-700"
              }`}
            >
              <span className="shrink-0">
                {filter.icon}
              </span>

              <span className="min-w-0 break-words">
                {filter.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
        <p className="text-sm font-bold text-slate-900">
          Community Snapshot
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-1">
          <div className="min-w-0 rounded-2xl bg-violet-50 p-4">
            <p className="break-words text-xl font-black text-violet-700 sm:text-2xl">
              {posts.length}
            </p>

            <p className="mt-1 break-words text-xs font-semibold text-slate-500">
              total posts
            </p>
          </div>

          <div className="min-w-0 rounded-2xl bg-emerald-50 p-4">
            <p className="break-words text-xl font-black text-emerald-700 sm:text-2xl">
              {routinePostCount}
            </p>

            <p className="mt-1 break-words text-xs font-semibold text-slate-500">
              shared routines
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CommunityNavigation;