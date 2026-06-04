import { useEffect, useState } from "react";
import { getCommunityHeadlines } from "../../services/api";

/*
 * CommunityNewsCarousel
 * ---------------------
 * Displays headline-only Guardian content in a calm rotating card.
 *
 * Purpose:
 * - demonstrate third-party API integration
 * - keep API keys protected on backend
 * - avoid doom-scrolling by showing one headline at a time
 */
function CommunityNewsCarousel() {
  const [headlines, setHeadlines] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Loads headlines from the backend Guardian API integration.
  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const data = await getCommunityHeadlines();
        setHeadlines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch community headlines:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeadlines();
  }, []);

  // Rotates headlines gently like a calm news carousel.
  useEffect(() => {
    if (headlines.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === headlines.length - 1 ? 0 : currentIndex + 1
      );
    }, 6000);

    return () => clearInterval(intervalId);
  }, [headlines]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">
          Today’s Headlines
        </p>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
          <p className="text-sm font-semibold text-slate-500">
            Loading calm headlines...
          </p>
        </div>
      </div>
    );
  }

if (headlines.length === 0) {
  return (
    <div className="glass-card rounded-[2rem] p-5">
      <p className="text-sm font-bold text-slate-900">
        Today’s Headlines
      </p>

      <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
        <p className="text-2xl">📰</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Headlines are unavailable right now. Check back soon for calm updates.
        </p>
      </div>
    </div>
  );
}

  const activeHeadline = headlines[activeIndex];

  return (
    <div className="glass-card rounded-[2rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">
          Today’s Headlines
        </p>

        <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
          Guardian
        </span>
      </div>

      <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
        <p className="text-2xl">📰</p>

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
          {activeHeadline.section || "Headline"}
        </p>

        <h3 className="mt-2 text-sm font-bold leading-6 text-slate-800">
          {activeHeadline.title}
        </h3>

        <a
          href={activeHeadline.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-xs font-bold text-violet-700 hover:text-violet-900"
        >
          Read on The Guardian →
        </a>
      </div>

      <div className="mt-4 flex gap-2">
        {headlines.map((headline, index) => (
          <button
            key={`${headline.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition ${
              activeIndex === index
                ? "w-6 bg-violet-500"
                : "w-2 bg-slate-200 hover:bg-slate-300"
            }`}
            aria-label={`View headline ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CommunityNewsCarousel;