import { useEffect, useState } from "react";
import CommunityHero from "../components/community/CommunityHero";
import CommunityComposer from "../components/community/CommunityComposer";
import CommunityPostCard from "../components/community/CommunityPostCard";
import CommunityLoadingState from "../components/community/CommunityLoadingState";
import CommunityEmptyState from "../components/community/CommunityEmptyState";
import CommunitySidebar from "../components/community/CommunitySidebar";
import {
  createCommunityPost,
  getCommunityPosts
} from "../services/api";

/*
 * CommunityPage
 * -------------
 * Supportive wellness community feed.
 *
 * This is NOT a medical forum.
 * It is a space for:
 * - reflections
 * - routines
 * - encouragement
 * - wellness experiences
 */
function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("REFLECTION");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  // Controls the feed filter without changing backend behavior.
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Controls whether the social-style composer is expanded.
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  /*
   * Loads the community feed newest first.
   */
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getCommunityPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch community posts:", err);
      setError("Could not load community posts.");
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Frontend validation gives immediate user feedback.
   * Backend validation still protects the API.
   */
  const validateForm = () => {
    if (!title.trim()) {
      return "Post title is required.";
    }

    if (!content.trim()) {
      return "Post content is required.";
    }

    if (!category.trim()) {
      return "Please choose a category.";
    }

    return "";
  };

  /*
   * Creates a new community post and refreshes the feed.
   */
  const handleSubmit = async () => {
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setIsPosting(true);
      setError("");

      await createCommunityPost({
        title,
        content,
        category
      });

      setTitle("");
      setContent("");
      setCategory("REFLECTION");
      setIsComposerOpen(false);

      await fetchPosts();
    } catch (err) {
      console.error("Failed to create community post:", err);
      setError("Could not create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const categoryStyles = {
    REFLECTION: {
      label: "Reflection",
      icon: "💭",
      badge: "bg-violet-50 text-violet-700",
      ring: "border-violet-100"
    },
    ROUTINE: {
      label: "Routine",
      icon: "🌿",
      badge: "bg-emerald-50 text-emerald-700",
      ring: "border-emerald-100"
    },
    ENCOURAGEMENT: {
      label: "Encouragement",
      icon: "💜",
      badge: "bg-pink-50 text-pink-700",
      ring: "border-pink-100"
    },
    WELLNESS_TIP: {
      label: "Wellness Tip",
      icon: "✨",
      badge: "bg-sky-50 text-sky-700",
      ring: "border-sky-100"
    }
  };

  const filters = [
    { key: "ALL", label: "All", icon: "🌎" },
    { key: "REFLECTION", label: "Reflections", icon: "💭" },
    { key: "ROUTINE", label: "Routines", icon: "🌿" },
    { key: "ENCOURAGEMENT", label: "Encouragement", icon: "💜" },
    { key: "WELLNESS_TIP", label: "Tips", icon: "✨" }
  ];

  const filteredPosts =
    activeFilter === "ALL"
      ? posts
      : posts.filter((post) => post.category === activeFilter);

  const getInitial = (username) => {
    return (username || "Community Member").charAt(0).toUpperCase();
  };

  const getCategoryMeta = (categoryKey) => {
    return categoryStyles[categoryKey] || {
      label: categoryKey || "Community",
      icon: "💬",
      badge: "bg-slate-100 text-slate-700",
      ring: "border-slate-100"
    };
  };

  return (
    <section className="animate-fade-in">
      <CommunityHero onCreatePost={() => setIsComposerOpen(true)} />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[260px_1fr_300px]">
        {/* Left community navigation */}
        <aside className="space-y-5 xl:sticky xl:top-28 xl:h-fit">
          <div className="glass-card rounded-[2rem] p-5">
            <p className="text-sm font-bold text-slate-900">
              Community Spaces
            </p>

            <div className="mt-4 space-y-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeFilter === filter.key
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white/70 text-slate-600 hover:bg-white hover:text-indigo-700"
                    }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-5">
            <p className="text-sm font-bold text-slate-900">
              Community Snapshot
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-2xl font-black text-violet-700">
                  {posts.length}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  total posts
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-2xl font-black text-emerald-700">
                  {posts.filter((post) => post.category === "ROUTINE").length}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  shared routines
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main social feed */}
        <main className="space-y-5">
          <CommunityComposer
            title={title}
            content={content}
            category={category}
            isPosting={isPosting}
            isComposerOpen={isComposerOpen}
            onOpen={() => setIsComposerOpen(true)}
            onClose={() => setIsComposerOpen(false)}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onCategoryChange={setCategory}
            onSubmit={handleSubmit}
          />

          <div className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Community Feed
              </h3>
              <p className="text-sm text-slate-500">
                {activeFilter === "ALL"
                  ? "Newest supportive posts appear first."
                  : `Showing ${getCategoryMeta(
                    activeFilter
                  ).label.toLowerCase()} posts.`}
              </p>
            </div>

            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
              {filteredPosts.length} posts
            </span>
          </div>

          {isLoading ? (
            <CommunityLoadingState />
          ) : filteredPosts.length === 0 ? (
            <CommunityEmptyState activeFilter={activeFilter} />
          ) : (
            filteredPosts.map((post) => {
              const meta = getCategoryMeta(post.category);

              return (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  meta={meta}
                  getInitial={getInitial}
                />
              );
            })
          )}
        </main>

        {/* Right community panel */}
       <CommunitySidebar />
      </div>
    </section>
  );
}

export default CommunityPage;