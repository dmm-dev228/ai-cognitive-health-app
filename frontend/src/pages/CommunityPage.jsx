import { useEffect, useState } from "react";
import CommunityHero from "../components/community/CommunityHero";
import CommunityComposer from "../components/community/CommunityComposer";
import CommunitySidebar from "../components/community/CommunitySidebar";
import CommunityNavigation from "../components/community/CommunityNavigation";
import CommunityFeedHeader from "../components/community/CommunityFeedHeader";
import CommunityFeed from "../components/community/CommunityFeed";
import CommunityGuidelinesModal from "../components/community/CommunityGuidelinesModal";
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

  const [showGuidelines, setShowGuidelines] = useState(() => {
  return sessionStorage.getItem("communityGuidelinesAccepted") !== "true";
});

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
setError(err.message || "Could not create post. Please try again.");    } finally {
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
  const handleAcceptGuidelines = () => {
  sessionStorage.setItem("communityGuidelinesAccepted", "true");
  setShowGuidelines(false);
};

  return (
    <section className="animate-fade-in">
      
<CommunityGuidelinesModal
  isOpen={showGuidelines}
  onAccept={handleAcceptGuidelines}
/>
      <CommunityHero onCreatePost={() => setIsComposerOpen(true)} />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[260px_1fr_300px]">
        {/* Left community navigation */}
        <CommunityNavigation
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          posts={posts}
        />

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
          
<CommunityFeedHeader
  activeFilter={activeFilter}
  filteredPostCount={filteredPosts.length}
  getCategoryMeta={getCategoryMeta}
/>

<CommunityFeed
  isLoading={isLoading}
  filteredPosts={filteredPosts}
  activeFilter={activeFilter}
  getCategoryMeta={getCategoryMeta}
  getInitial={getInitial}
/>
        </main>

        {/* Right community panel */}
        <CommunitySidebar />
      </div>
    </section>
  );
}

export default CommunityPage;