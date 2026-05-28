import { useState } from "react";

/*
 * CommunityReactionBar
 * --------------------
 * Soft, supportive reaction buttons for community posts.
 *
 * For now, this component stores selected reaction locally.
 * Later, selectedReaction and counts will come from the backend.
 */
function CommunityReactionBar() {
  const [selectedReaction, setSelectedReaction] = useState(null);

  const reactions = [
    {
      reactionType: "SUPPORT",
      label: "Support",
      icon: "💜",
      style: "bg-violet-50 text-violet-700 hover:bg-violet-100",
      activeStyle: "bg-violet-600 text-white shadow-violet-200"
    },
    {
      reactionType: "GROWTH",
      label: "Growth",
      icon: "🌱",
      style: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      activeStyle: "bg-emerald-600 text-white shadow-emerald-200"
    },
    {
      reactionType: "ENCOURAGING",
      label: "Encouraging",
      icon: "✨",
      style: "bg-amber-50 text-amber-700 hover:bg-amber-100",
      activeStyle: "bg-amber-500 text-white shadow-amber-200"
    },
    {
      reactionType: "RELATABLE",
      label: "Relatable",
      icon: "🫶",
      style: "bg-sky-50 text-sky-700 hover:bg-sky-100",
      activeStyle: "bg-sky-600 text-white shadow-sky-200"
    },
    {
      reactionType: "PROUD_OF_YOU",
      label: "Proud of You",
      icon: "👏",
      style: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      activeStyle: "bg-pink-600 text-white shadow-pink-200"
    },
    {
      reactionType: "THOUGHTFUL",
      label: "Thoughtful",
      icon: "🧠",
      style: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      activeStyle: "bg-indigo-600 text-white shadow-indigo-200"
    }
  ];

  const handleReactionClick = (reactionType) => {
    const nextReaction =
      selectedReaction === reactionType ? null : reactionType;

    setSelectedReaction(nextReaction);

    console.log("Selected community reaction:", nextReaction);

    /*
     * Future backend integration:
     *
     * toggleCommunityReaction(postId, reactionType)
     *
     * If user clicks the same reaction again, backend should remove it.
     * If user clicks a different reaction, backend should replace it.
     */
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Send gentle support
      </p>

      <div className="flex flex-wrap gap-3">
        {reactions.map((reaction) => {
          const isSelected = selectedReaction === reaction.reactionType;

          return (
            <button
              key={reaction.reactionType}
              type="button"
              onClick={() => handleReactionClick(reaction.reactionType)}
              className={`rounded-full px-4 py-2 text-xs font-bold shadow-sm transition ${
                isSelected ? reaction.activeStyle : reaction.style
              }`}
            >
              {reaction.icon} {reaction.label}
            </button>
          );
        })}
      </div>

      {selectedReaction && (
        <p className="mt-3 text-xs font-medium text-slate-500">
          Your support has been added locally. Backend syncing comes next.
        </p>
      )}
    </div>
  );
}

export default CommunityReactionBar;