/*
 * CommunityReactionBar
 * --------------------
 * Soft, supportive reaction buttons for community posts.
 *
 * For now, this component is frontend-only.
 * The reactionType values are intentionally backend-ready so we can later
 * connect this directly to CommunityReaction endpoints.
 */
function CommunityReactionBar() {
  const reactions = [
    {
      reactionType: "SUPPORT",
      label: "Support",
      icon: "💜",
      style: "bg-violet-50 text-violet-700 hover:bg-violet-100"
    },
    {
      reactionType: "GROWTH",
      label: "Growth",
      icon: "🌱",
      style: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
    },
    {
      reactionType: "ENCOURAGING",
      label: "Encouraging",
      icon: "✨",
      style: "bg-amber-50 text-amber-700 hover:bg-amber-100"
    },
    {
      reactionType: "RELATABLE",
      label: "Relatable",
      icon: "🫶",
      style: "bg-sky-50 text-sky-700 hover:bg-sky-100"
    },
    {
      reactionType: "PROUD_OF_YOU",
      label: "Proud of You",
      icon: "👏",
      style: "bg-pink-50 text-pink-700 hover:bg-pink-100"
    },
    {
      reactionType: "THOUGHTFUL",
      label: "Thoughtful",
      icon: "🧠",
      style: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
    }
  ];

  const handleReactionClick = (reactionType) => {
    console.log("Selected community reaction:", reactionType);

    /*
     * Future backend integration:
     *
     * toggleCommunityReaction(postId, reactionType)
     *
     * This will allow users to gently support posts without creating
     * toxic like/dislike dynamics.
     */
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Send gentle support
      </p>

      <div className="flex flex-wrap gap-3">
        {reactions.map((reaction) => (
          <button
            key={reaction.reactionType}
            type="button"
            onClick={() => handleReactionClick(reaction.reactionType)}
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