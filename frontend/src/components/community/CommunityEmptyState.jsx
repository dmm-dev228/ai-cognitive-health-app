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
    <div className="glass-card rounded-3xl p-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-3xl">
        💬
      </div>

      <h3 className="text-2xl font-bold text-slate-900">
        No posts here yet.
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default CommunityEmptyState;