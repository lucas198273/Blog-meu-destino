/** Espelho fiel de backend-cm-/src/modules/blog (posts.types.ts, categories.types.ts). */

export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
  id: string;
  tenant_id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  post_count?: number;
  posts_count?: number;
  parent_id: string | null;
  display_order: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

/** Campos retornados pela projeção de GET /api/blog/posts. */
export interface BlogPostSummary {
  id: string;
  category_id: string | null;
  location_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  status: PostStatus;
  featured: boolean;
  tags: string[];
  published_at: string | null;
  created_at: string;
  location: { id: string; nome: string; slug: string } | null;
}

/** Campos retornados por GET /api/blog/posts/:idOrSlug. */
export interface BlogPost extends Omit<BlogPostSummary, 'location'> {
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  updated_at: string;
  location?: { id: string; nome: string; slug: string } | null;
}

export interface ListBlogPostsParams {
  page?: number;
  limit?: number;
  /** UUID da categoria de blog. */
  category?: string;
  location_slug?: string;
  tag?: string;
  featured?: boolean;
}
