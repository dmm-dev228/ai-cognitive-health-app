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
 * - AI moderation
 * - AI writing assistance
 * - reporting
 * - threading
 */
function CommunityCommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const commentsBottomRef = useRef(null);

    // Automatically scrolls to the newest comment when comments are visible.
    useEffect(() => {
        if (showComments && commentsBottomRef.current) {
            commentsBottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    }, [comments, showComments]);
    const fetchComments = async () => {
        try {
            const data = await getCommunityComments(postId);
            setComments(data);
        } catch (err) {
            console.error("Failed to load comments:", err);
        }
    };

    // Loads comments when the post card renders.
    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async () => {
        if (!content.trim()) {
            return;
        }

        try {
            setIsLoading(true);

            await createCommunityComment(
                postId,
                content.trim()
            );

            setContent("");

            await fetchComments();

            // Keeps focus in the discussion flow
            setShowComments(true);
        } catch (err) {
            console.error("Failed to create comment:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-5 border-t border-slate-100 pt-5">
            <button
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

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="3"
                            placeholder="Share something supportive..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="mt-3 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            {isLoading ? "Posting..." : "Post Comment"}
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-2xl border border-slate-100 bg-white p-4"
                            >
                                <p className="font-semibold text-slate-900">
                                    {comment.username}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {comment.content}
                                </p>
                            </div>
                        ))}

                        {/* Auto-scroll target */}
                        <div ref={commentsBottomRef} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityCommentSection;