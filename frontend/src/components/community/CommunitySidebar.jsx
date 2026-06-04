import CommunityDiscoverCard from "./CommunityDiscoverCard";
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
   <CommunityDiscoverCard />

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