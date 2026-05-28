/*
 * CommunityReactionBar
 * --------------------
 * Soft, supportive reaction buttons for community posts.
 *
 * For now these are frontend-only UI buttons.
 * Later, this component will call backend reaction endpoints.
 */
function CommunityReactionBar() {
  const reactions = [
    { label: "Support", icon: "💜", style: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
    { label: "Growth", icon: "🌱", style: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
    { label: "Encouraging", icon: "✨", style: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
    { label: "Relatable", icon: "🫶", style: "bg-sky-50 text-sky-700 hover:bg-sky-100" },
    { label: "Proud of You", icon: "👏", style: "bg-pink-50 text-pink-700 hover:bg-pink-100" },
    { label: "Thoughtful", icon: "🧠", style: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" }
  ];

  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Send gentle support
      </p>

      <div className="flex flex-wrap gap-3">
        {reactions.map((reaction) => (
          <button
            key={reaction.label}
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${reaction.style}`}
          >
            {reaction.icon} {reaction.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CommunityReactionBar;