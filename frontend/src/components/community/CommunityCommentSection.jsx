import { useEffect, useRef, useState } from "react";
import {
    createCommunityComment,
    getCommunityComments
} from "../../services/api";

/*
 * CommunityCommentSection
 * -----------------------
 * Displays and creates supportive comments.
 *
 * Future:
 * - AI writing assistance
 * - reporting
 * - threading
 * - richer moderation feedback
 */
function CommunityCommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [error, setError] = useState("");

    const commentsBottomRef = useRef(null);

    // Loads comments for the current post.
    const fetchComments = async () => {
        try {
            const data = await getCommunityComments(postId);
            setComments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load comments:", err);
        }
    };

    // Loads comments when the post card renders.
    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    // Automatically scrolls to the newest comment when comments are visible.
    useEffect(() => {
        if (showComments && commentsBottomRef.current) {
            commentsBottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    }, [comments, showComments]);

    // Creates a new supportive comment.
    const handleSubmit = async () => {
        if (!content.trim()) {
            setError("Comment content is required.");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            await createCommunityComment(postId, content.trim());

            setContent("");
            setShowComments(true);

            await fetchComments();
        } catch (err) {
            console.error("Failed to create comment:", err);
            setError(err.message || "Could not create comment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-5 border-t border-slate-100 pt-5">
            <button
                type="button"
                onClick={() => setShowComments(!showComments)}
                className="text-sm font-semibold text-violet-700 hover:text-violet-900"
            >
                💬 {comments.length === 1 ? "1 comment" : `${comments.length} comments`}
            </button>

            {showComments && (
                <div className="mt-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                            Respond with encouragement, support, or shared experience.
                        </p>

                        {error && (
                            <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                                {error}
                            </div>
                        )}

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="3"
                            placeholder="Share something supportive..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
                        />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="mt-3 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Posting..." : "Post Comment"}
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        {comments.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-500">
                                No comments yet. You can be the first to offer support.
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="rounded-2xl border border-slate-100 bg-white p-4"
                                >
                                    <p className="font-semibold text-slate-900">
                                        {comment.username || "Community Member"}
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        )}

                        {/* Auto-scroll target */}
                        <div ref={commentsBottomRef} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityCommentSection;