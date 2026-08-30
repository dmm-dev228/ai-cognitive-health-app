import { useEffect, useState } from "react";
import CommunityDiscoverCard from "./CommunityDiscoverCard";
import { getCommunityTrends } from "../../services/api";

/*
 * CommunitySidebar
 * ----------------
 * Right-side support panel for the Community page.
 *
 * This keeps the community tone visible:
 * - curated Discover articles
 * - safety guidelines
 * - dynamic community trends
 */
function CommunitySidebar() {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getCommunityTrends();
        setTrends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load community trends:", err);
      }
    };

    fetchTrends();
  }, []);

  const getTrendMeta = (category) => {
    const trendStyles = {
      REFLECTION: {
        label: "Reflections",
        icon: "💭",
        style: "bg-violet-50 text-violet-700",
      },
      ROUTINE: {
        label: "Routines",
        icon: "🌿",
        style: "bg-emerald-50 text-emerald-700",
      },
      ENCOURAGEMENT: {
        label: "Encouragement",
        icon: "💜",
        style: "bg-pink-50 text-pink-700",
      },
      WELLNESS_TIP: {
        label: "Wellness Tips",
        icon: "✨",
        style: "bg-sky-50 text-sky-700",
      },
    };

    return (
      trendStyles[category] || {
        label: category || "Community",
        icon: "💬",
        style: "bg-slate-50 text-slate-700",
      }
    );
  };

  return (
    <aside className="min-w-0 space-y-4 sm:space-y-5 xl:sticky xl:top-28 xl:h-fit">
      <CommunityDiscoverCard />

      <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
        <p className="text-sm font-bold text-slate-900">
          Community Guidelines
        </p>

        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <p className="break-words">
            💜 Be supportive and respectful.
          </p>

          <p className="break-words">
            🌿 Share wellness experiences, not medical advice.
          </p>

          <p className="break-words">
            ✨ Encourage progress and consistency.
          </p>
        </div>
      </div>

      <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="min-w-0 text-sm font-bold text-slate-900">
            Community Trends
          </p>

          <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
            Live
          </span>
        </div>

        <div className="mt-4 min-w-0 space-y-3">
          {trends.length === 0 ? (
            <div className="break-words rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm leading-6 text-slate-500">
              Trends will appear as the community grows.
            </div>
          ) : (
            trends.map((trend) => {
              const meta = getTrendMeta(trend.category);

              return (
                <div
                  key={trend.category}
                  className="flex min-w-0 flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${meta.style}`}
                    >
                      {meta.icon}
                    </span>

                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-slate-800">
                        {meta.label}
                      </p>

                      <p className="text-xs font-medium text-slate-400">
                        {trend.count} posts
                      </p>
                    </div>
                  </div>

                  <span className="w-fit shrink-0 break-all text-xs font-bold text-violet-600">
                    #{meta.label.toLowerCase().replaceAll(" ", "")}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

export default CommunitySidebar;