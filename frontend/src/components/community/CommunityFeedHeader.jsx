/*
 * CommunityFeedHeader
 * -------------------
 * Header above the community feed.
 *
 * Shows the current filter context and post count.
 */
function CommunityFeedHeader({
  activeFilter,
  filteredPostCount,
  getCategoryMeta,
}) {
  const feedMessage =
    activeFilter === "ALL"
      ? "Newest supportive posts appear first."
      : `Showing ${getCategoryMeta(activeFilter).label.toLowerCase()} posts.`;

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-3xl sm:px-5">
      <div className="min-w-0">
        <h3 className="break-words text-lg font-bold text-slate-900 sm:text-xl">
          Community Feed
        </h3>

        <p className="mt-1 break-words text-sm leading-5 text-slate-500">
          {feedMessage}
        </p>
      </div>

      <span className="w-fit shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 sm:px-4 sm:py-2 sm:text-sm">
        {filteredPostCount} {filteredPostCount === 1 ? "post" : "posts"}
      </span>
    </div>
  );
}

export default CommunityFeedHeader;