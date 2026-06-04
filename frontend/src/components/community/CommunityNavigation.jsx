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
  posts
}) {
  const routinePostCount = posts.filter(
    (post) => post.category === "ROUTINE"
  ).length;

  return (
    <aside className="space-y-5 xl:sticky xl:top-28 xl:h-fit">
      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">
          Community Spaces
        </p>

        <div className="mt-4 space-y-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeFilter === filter.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-indigo-700"
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">
          Community Snapshot
        </p>

        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-2xl font-black text-violet-700">
              {posts.length}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              total posts
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-2xl font-black text-emerald-700">
              {routinePostCount}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              shared routines
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CommunityNavigation;