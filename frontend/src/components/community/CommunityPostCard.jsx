import CommunityReactionBar from "./CommunityReactionBar";

/*
 * CommunityPostCard
 * -----------------
 * Displays one community post.
 *
 * Keeps the feed calm, readable, and emotionally safe.
 * Later this component will also contain:
 * - comments
 * - report button
 * - moderation notices
 * - saved posts
 */
function CommunityPostCard({ post, meta, getInitial }) {
  return (
    <article
      className={`group rounded-[2rem] border bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl ${meta.ring}`}
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-lg font-black text-white shadow-md">
          {getInitial(post.username)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-slate-900">
              {post.username || "Community Member"}
            </p>

            <span className="text-xs font-semibold text-slate-400">•</span>

            <p className="text-xs font-semibold text-slate-400">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleString()
                : "Just now"}
            </p>
          </div>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${meta.badge}`}
          >
            {meta.icon} {meta.label}
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900">{post.title}</h3>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
        {post.content}
      </p>

      <CommunityReactionBar />
    </article>
  );
}

export default CommunityPostCard;