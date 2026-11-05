
import type { BlogPost } from '../../types/blog';
import { PostCard } from './PostCard';
import { HorizontalCarousel } from '../common/HorizontalCarousel';

export function PostList({
  posts,
  layout = 'grid',
}: {
  posts: BlogPost[];
  layout?: 'grid' | 'carousel';
}) {
  const items = posts.map((post) => (
    <div
      key={post.id}
      className={
        layout === 'carousel'
          ? 'w-[min(85vw,340px)] shrink-0 snap-start'
          : 'min-w-0'
      }
    >
      <PostCard post={post} />
    </div>
  ));

  if (layout === 'carousel') {
    return (
      <HorizontalCarousel ariaLabel="Artigos do blog">
        {items}
      </HorizontalCarousel>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items}
    </div>
  );
}
