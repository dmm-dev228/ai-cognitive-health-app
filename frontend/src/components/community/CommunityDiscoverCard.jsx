import { useEffect, useState } from "react";
import { getCommunityHeadlines } from "../../services/api";

/*
 * CommunityDiscoverCard
 * ---------------------
 * Curated learning/discovery card for the Community sidebar.
 *
 * This uses Guardian headlines through the backend while keeping
 * the experience calm, useful, and non-doomscrolling.
 */
function CommunityDiscoverCard() {
  const [articles, setArticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e"
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getCommunityHeadlines();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch discover articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === articles.length - 1 ? 0 : currentIndex + 1
      );
    }, 7000);

    return () => clearInterval(intervalId);
  }, [articles]);

  const getArticleImage = (article, index) => {
    if (article?.imageUrl) {
      return article.imageUrl;
    }

    return fallbackImages[index % fallbackImages.length];
  };

  const activeArticle = articles[activeIndex];

  if (isLoading) {
    return (
      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">✨ Discover</p>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
          <p className="text-sm font-semibold text-slate-500">
            Loading interesting reads...
          </p>
        </div>
      </div>
    );
  }

  if (!activeArticle) {
    return (
      <div className="glass-card rounded-[2rem] p-5">
        <p className="text-sm font-bold text-slate-900">✨ Discover</p>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
          <img
            src={fallbackImages[0]}
            alt="Reading material"
            className="h-40 w-full rounded-2xl object-cover"
          />

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Discover articles are unavailable right now. Check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">✨ Discover</p>

        <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
          Guardian
        </span>
      </div>

      <div className="mt-4 rounded-3xl bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
        <img
          src={getArticleImage(activeArticle, activeIndex)}
          alt={activeArticle.title}
          className="h-40 w-full rounded-2xl object-cover"
        />

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
          {activeArticle.section || "Interesting Read"}
        </p>

        <h3 className="mt-2 text-sm font-bold leading-6 text-slate-800">
          {activeArticle.title}
        </h3>

        <a
          href={activeArticle.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-xs font-bold text-violet-700 hover:text-violet-900"
        >
          Read article →
        </a>
      </div>

      <div className="mt-4 flex gap-2">
        {articles.map((article, index) => (
          <button
            key={`${article.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition ${
              activeIndex === index
                ? "w-6 bg-violet-500"
                : "w-2 bg-slate-200 hover:bg-slate-300"
            }`}
            aria-label={`View article ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CommunityDiscoverCard;