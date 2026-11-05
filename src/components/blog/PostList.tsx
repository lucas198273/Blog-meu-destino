
import type { BlogPost } from '../../types/blog';
import { PostCard } from './PostCard';

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-[220px] min-w-[220px] shrink-0 snap-start md:w-auto md:min-w-0"
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
