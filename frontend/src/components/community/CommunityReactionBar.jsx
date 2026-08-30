import { useEffect, useState } from "react";
import {
  getCommunityPostReactions,
  toggleCommunityReaction,
} from "../../services/api";

/*
 * CommunityReactionBar
 * --------------------
 * Soft, supportive reaction buttons for community posts.
 *
 * Now connected to backend reaction endpoints.
 * Users can select, remove, or change their supportive reaction.
 */
function CommunityReactionBar({ postId }) {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const reactions = [
    {
      reactionType: "SUPPORT",
      label: "Support",
      icon: "💜",
      style: "bg-violet-50 text-violet-700 hover:bg-violet-100",
      activeStyle: "bg-violet-600 text-white shadow-violet-200",
    },
    {
      reactionType: "GROWTH",
      label: "Growth",
      icon: "🌱",
      style: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      activeStyle: "bg-emerald-600 text-white shadow-emerald-200",
    },
    {
      reactionType: "ENCOURAGING",
      label: "Encouraging",
      icon: "✨",
      style: "bg-amber-50 text-amber-700 hover:bg-amber-100",
      activeStyle: "bg-amber-500 text-white shadow-amber-200",
    },
    {
      reactionType: "RELATABLE",
      label: "Relatable",
      icon: "🫶",
      style: "bg-sky-50 text-sky-700 hover:bg-sky-100",
      activeStyle: "bg-sky-600 text-white shadow-sky-200",
    },
    {
      reactionType: "PROUD_OF_YOU",
      label: "Proud of You",
      icon: "👏",
      style: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      activeStyle: "bg-pink-600 text-white shadow-pink-200",
    },
    {
      reactionType: "THOUGHTFUL",
      label: "Thoughtful",
      icon: "🧠",
      style: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      activeStyle: "bg-indigo-600 text-white shadow-indigo-200",
    },
  ];

  /*
   * Loads reaction counts when each post card renders.
   */
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const data = await getCommunityPostReactions(postId);

        const counts = {};
        let selected = null;

        data.forEach((reaction) => {
          counts[reaction.reactionType] = reaction.count;

          if (reaction.selectedByCurrentUser) {
            selected = reaction.reactionType;
          }
        });

        setReactionCounts(counts);
        setSelectedReaction(selected);
      } catch (err) {
        console.error("Failed to load community reactions:", err);
      }
    };

    if (postId) {
      fetchReactions();
    }
  }, [postId]);

  /*
   * Toggles the user's reaction and refreshes counts from backend response.
   */
  const handleReactionClick = async (reactionType) => {
    try {
      setIsLoading(true);

      const data = await toggleCommunityReaction(postId, reactionType);

      const counts = {};
      let selected = null;

      data.forEach((reaction) => {
        counts[reaction.reactionType] = reaction.count;

        if (reaction.selectedByCurrentUser) {
          selected = reaction.reactionType;
        }
      });

      setReactionCounts(counts);
      setSelectedReaction(selected);
    } catch (err) {
      console.error("Failed to toggle community reaction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5 min-w-0 border-t border-slate-100 pt-4 sm:mt-6">
      <p className="mb-3 break-words text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">
        Send gentle support
      </p>

      <div className="flex min-w-0 flex-wrap gap-2 sm:gap-3">
        {reactions.map((reaction) => {
          const isSelected =
            selectedReaction === reaction.reactionType;

          const count =
            reactionCounts[reaction.reactionType] || 0;

          return (
            <button
              key={reaction.reactionType}
              type="button"
              disabled={isLoading}
              onClick={() =>
                handleReactionClick(reaction.reactionType)
              }
              className={`inline-flex min-h-10 max-w-full items-center justify-center rounded-full px-3 py-2 text-[11px] font-bold leading-4 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-11 sm:px-4 sm:text-xs ${
                isSelected
                  ? reaction.activeStyle
                  : reaction.style
              }`}
            >
              <span className="mr-1 shrink-0">
                {reaction.icon}
              </span>

              <span className="break-words">
                {reaction.label}
              </span>

              {count > 0 && (
                <span className="ml-1 shrink-0">
                  · {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CommunityReactionBar;