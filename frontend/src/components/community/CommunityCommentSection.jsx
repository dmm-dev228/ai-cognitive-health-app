import { useEffect, useRef, useState } from "react";
import {
  createCommunityComment,
  getCommunityComments,
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
        block: "end",
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
    <div className="mt-4 min-w-0 border-t border-slate-100 pt-4 sm:mt-5 sm:pt-5">
      <button
        type="button"
        onClick={() => setShowComments(!showComments)}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
      >
        <span aria-hidden="true">💬</span>
        <span>
          {comments.length === 1 ? "1 comment" : `${comments.length} comments`}
        </span>
      </button>

      {showComments && (
        <div className="mt-3 min-w-0 sm:mt-4">
          <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
            <p className="mb-3 text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-slate-400 sm:tracking-[0.15em]">
              Respond with encouragement, support, or shared experience.
            </p>

            {error && (
              <div className="mb-3 break-words rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-600">
                {error}
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="3"
              placeholder="Share something supportive..."
              className="w-full min-w-0 resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:py-2"
            >
              {isLoading ? "Posting..." : "Post Comment"}
            </button>
          </div>

          <div className="mt-3 min-w-0 space-y-3 sm:mt-4">
            {comments.length === 0 ? (
              <div className="break-words rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm leading-6 text-slate-500">
                No comments yet. You can be the first to offer support.
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3 sm:p-4"
                >
                  <p className="break-words font-semibold text-slate-900">
                    {comment.username || "Community Member"}
                  </p>

                  <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
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
