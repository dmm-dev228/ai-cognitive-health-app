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
    "https://images.unsplash.com/photo-1495020689067-958852a7765e",
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
      <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
        <p className="text-sm font-bold text-slate-900">✨ Discover</p>

        <div className="mt-3 rounded-2xl bg-gradient-to-br from-violet-50 to-emerald-50 p-4 sm:mt-4 sm:rounded-3xl sm:p-5">
          <p className="text-sm font-semibold leading-6 text-slate-500">
            Loading interesting reads...
          </p>
        </div>
      </div>
    );
  }

  if (!activeArticle) {
    return (
      <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
        <p className="text-sm font-bold text-slate-900">✨ Discover</p>

        <div className="mt-3 rounded-2xl bg-gradient-to-br from-violet-50 to-emerald-50 p-4 sm:mt-4 sm:rounded-3xl sm:p-5">
          <img
            src={fallbackImages[0]}
            alt="Reading material"
            className="h-36 w-full rounded-xl object-cover sm:h-40 sm:rounded-2xl"
          />

          <p className="mt-3 break-words text-sm leading-6 text-slate-600 sm:leading-7">
            Discover articles are unavailable right now. Check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card min-w-0 rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="min-w-0 text-sm font-bold text-slate-900">✨ Discover</p>

        <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
          Guardian
        </span>
      </div>

      <div className="mt-3 min-w-0 rounded-2xl bg-gradient-to-br from-violet-50 to-emerald-50 p-4 sm:mt-4 sm:rounded-3xl sm:p-5">
        <img
          src={getArticleImage(activeArticle, activeIndex)}
          alt={activeArticle.title}
          className="h-36 w-full rounded-xl object-cover sm:h-40 sm:rounded-2xl"
        />

        <p className="mt-3 break-words text-[11px] font-bold uppercase leading-5 tracking-[0.12em] text-emerald-700 sm:text-xs sm:tracking-[0.15em]">
          {activeArticle.section || "Interesting Read"}
        </p>

        <h3 className="mt-2 break-words text-sm font-bold leading-6 text-slate-800">
          {activeArticle.title}
        </h3>

        <a
          href={activeArticle.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-xs font-bold text-violet-700 transition hover:text-violet-900"
        >
          Read article →
        </a>
      </div>

      {articles.length > 1 && (
        <div className="mt-4 flex min-w-0 items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() =>
              setActiveIndex((currentIndex) =>
                currentIndex === 0 ? articles.length - 1 : currentIndex - 1
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-50"
            aria-label="Previous article"
          >
            ←
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-hidden sm:gap-2">
            {articles.map((article, index) => (
              <button
                key={`${article.url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 shrink-0 rounded-full transition ${
                  activeIndex === index
                    ? "w-5 bg-violet-500 sm:w-6"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`View article ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveIndex((currentIndex) =>
                currentIndex === articles.length - 1 ? 0 : currentIndex + 1
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-50"
            aria-label="Next article"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default CommunityDiscoverCard;
