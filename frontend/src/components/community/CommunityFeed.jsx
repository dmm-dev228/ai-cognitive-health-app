import CommunityEmptyState from "./CommunityEmptyState";
import CommunityLoadingState from "./CommunityLoadingState";
import CommunityPostCard from "./CommunityPostCard";

/*
 * CommunityFeed
 * -------------
 * Renders the community feed state:
 * - loading
 * - empty
 * - post list
 *
 * CommunityPage still owns the data and filtering logic.
 */
function CommunityFeed({
  isLoading,
  filteredPosts,
  activeFilter,
  getCategoryMeta,
  getInitial
}) {
  if (isLoading) {
    return <CommunityLoadingState />;
  }

  if (filteredPosts.length === 0) {
    return <CommunityEmptyState activeFilter={activeFilter} />;
  }

  return (
    <>
      {filteredPosts.map((post) => {
        const meta = getCategoryMeta(post.category);

        return (
          <CommunityPostCard
            key={post.id}
            post={post}
            meta={meta}
            getInitial={getInitial}
          />
        );
      })}
    </>
  );
}

export default CommunityFeed;