import { useEffect, useState } from "react";
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

            await fetchPosts();
        } catch (err) {
            console.error("Failed to create community post:", err);
            setError("Could not create post. Please try again.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <section className="animate-fade-in">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-500">
                    Community Wellness
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    Share encouragement, routines, and reflections.
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    A supportive space for cognitive wellness, daily routines,
                    reflection, and shared encouragement. This is not a medical
                    forum.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
                <div className="glass-card h-fit rounded-[2rem] p-6 xl:sticky xl:top-28">
                    <p className="text-sm font-semibold text-violet-600">
                        New Community Post
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        Share something supportive
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Post a reflection, wellness routine, encouragement, or
                        helpful experience.
                    </p>

                    <div className="mt-6 space-y-5">
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Title <span className="text-red-500">*</span>
                            </span>

                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Morning routine that helped me"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Category <span className="text-red-500">*</span>
                            </span>

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                            >
                                <option value="REFLECTION">Reflection</option>
                                <option value="ROUTINE">Routine</option>
                                <option value="ENCOURAGEMENT">
                                    Encouragement
                                </option>
                                <option value="WELLNESS_TIP">
                                    Wellness Tip
                                </option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Post <span className="text-red-500">*</span>
                            </span>

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share something encouraging or helpful..."
                                rows="8"
                                className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                            />
                        </label>

                        <button
                            onClick={handleSubmit}
                            disabled={isPosting}
                            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isPosting ? "Posting..." : "Share Post"}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Community Feed
                            </h3>

                            <p className="text-sm text-slate-500">
                                Newest supportive posts appear first.
                            </p>
                        </div>

                        <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                            {posts.length} posts
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="glass-card rounded-3xl p-10 text-center">
                            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500" />

                            <p className="font-semibold text-slate-700">
                                Loading community posts...
                            </p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="glass-card rounded-3xl p-10 text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-3xl">
                                💬
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900">
                                No posts yet.
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                                Be the first to share a supportive reflection,
                                routine, or encouragement.
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <article
                                key={post.id}
                                className="glass-card rounded-[2rem] p-6 transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-violet-700">
                                            {post.category}
                                        </span>

                                        <h3 className="mt-3 text-2xl font-bold text-slate-900">
                                            {post.title}
                                        </h3>
                                    </div>

                                    <p className="text-xs font-semibold text-slate-400">
                                        {post.createdAt
                                            ? new Date(
                                                post.createdAt
                                            ).toLocaleString()
                                            : "Just now"}
                                    </p>
                                </div>

                                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                    {post.content}
                                </p>

                                <div className="mt-5 border-t border-slate-100 pt-4">
                                    <p className="text-sm font-semibold text-slate-500">
                                        Shared by{" "}
                                        <span className="text-violet-600">
                                            {post.username || "Community Member"}
                                        </span>
                                    </p>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default CommunityPage;