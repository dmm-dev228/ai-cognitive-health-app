/*
 * CommunitySidebar
 * ----------------
 * Right-side support panel for the Community page.
 *
 * This keeps the community tone visible:
 * - daily prompt
 * - safety guidelines
 * - supportive spaces
 */
function CommunitySidebar() {
  const trendingSpaces = [
    "#reflection",
    "#routines",
    "#memory",
    "#encouragement"
  ];

  return (
    <aside className="hidden space-y-5 xl:block xl:sticky xl:top-28 xl:h-fit">
      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">
          Today’s Community Prompt
        </p>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
          <p className="text-2xl">🌤️</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            What is one small routine that helped you feel more grounded today?
          </p>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">
          Community Guidelines
        </p>

        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>💜 Be supportive and respectful.</p>
          <p>🌿 Share wellness experiences, not medical advice.</p>
          <p>✨ Encourage progress and consistency.</p>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">
          Trending Spaces
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {trendingSpaces.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default CommunitySidebar;