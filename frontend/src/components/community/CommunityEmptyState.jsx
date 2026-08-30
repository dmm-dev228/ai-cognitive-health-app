/*
 * CommunityEmptyState
 * -------------------
 * Empty feed state for a calm, supportive community space.
 */
function CommunityEmptyState({ activeFilter }) {
  const message =
    activeFilter === "ALL"
      ? "Be the first to share something supportive in this space."
      : "No posts are here yet. You can help start this space with something kind, helpful, or encouraging.";

  return (
    <div className="glass-card min-w-0 rounded-2xl p-6 text-center sm:rounded-3xl sm:p-10">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl sm:mb-5 sm:h-16 sm:w-16 sm:rounded-3xl sm:text-3xl">
        💬
      </div>

      <h3 className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
        No posts here yet.
      </h3>

      <p className="mx-auto mt-3 max-w-md break-words text-sm leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default CommunityEmptyState;