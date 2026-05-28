/*
 * CommunityLoadingState
 * ---------------------
 * Calm loading state for the community feed.
 */
function CommunityLoadingState() {
  return (
    <div className="glass-card rounded-3xl p-10 text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />
      <p className="font-semibold text-slate-700">
        Loading supportive community posts...
      </p>
    </div>
  );
}

export default CommunityLoadingState;