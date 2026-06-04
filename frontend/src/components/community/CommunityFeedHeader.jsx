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
  getCategoryMeta
}) {
  const feedMessage =
    activeFilter === "ALL"
      ? "Newest supportive posts appear first."
      : `Showing ${getCategoryMeta(activeFilter).label.toLowerCase()} posts.`;

  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          Community Feed
        </h3>

        <p className="text-sm text-slate-500">
          {feedMessage}
        </p>
      </div>

      <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
        {filteredPostCount} posts
      </span>
    </div>
  );
}

export default CommunityFeedHeader;