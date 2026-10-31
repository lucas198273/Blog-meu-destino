import { apiGet, apiGetList } from '../lib/http';
import type { BlogCategory, BlogPost, ListBlogPostsParams } from '../types/blog';
import type { Product } from '../types/product';

/**
 * Rotas públicas do backend-cm- (somente GET, anônimas):
 * - GET /api/blog/posts               (paginado: category, tag, featured, page, limit)
 * - GET /api/blog/posts/:idOrSlug     (aceita UUID ou slug)
 * - GET /api/blog/posts/:id/products  (produtos ativos associados ao post)
 * - GET /api/blog/categories          (ativas)
 * - GET /api/blog/categories/:slugOrId
 */
export const blogApi = {
  listPosts: (params: ListBlogPostsParams = {}) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, String(value));
      }
    }
    const query = search.toString();
    return apiGetList<BlogPost>(`/api/blog/posts${query ? `?${query}` : ''}`);
  },

  getPost: (idOrSlug: string) =>
    apiGet<BlogPost>(`/api/blog/posts/${encodeURIComponent(idOrSlug)}`),

  listPostProducts: async (postId: string): Promise<Product[]> => {
    const data = await apiGet<unknown>(
      `/api/blog/posts/${encodeURIComponent(postId)}/products`,
    );
    // Backend pode devolver array puro OU envelope paginado ({ items: [...] }).
    // Normaliza para sempre trabalhar com o array de produtos.
    if (Array.isArray(data)) return data as Product[];
    if (
      data &&
      typeof data === 'object' &&
      Array.isArray((data as { items?: unknown }).items)
    ) {
      return (data as { items: Product[] }).items;
    }
    return [];
  },

  listCategories: () => apiGet<BlogCategory[]>('/api/blog/categories'),

  getCategory: (slugOrId: string) =>
    apiGet<BlogCategory>(`/api/blog/categories/${encodeURIComponent(slugOrId)}`),
};
