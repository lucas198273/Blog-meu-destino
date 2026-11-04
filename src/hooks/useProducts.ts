import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import type { ListProductsParams, ProductNiche } from '../types/product';
import { listCategoryTreeItems } from '../lib/categoryTree';

/**
 * Hooks do domínio produtos. Queries anônimas — o backend
 * só devolve `status='active'` para visitantes.
 * `keepPreviousData` evita piscar a tela durante paginação/filtragem.
 */
export function useProducts(params: ListProductsParams = {}) {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => productsApi.listProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useProductsForCategoryTree(
  params: ListProductsParams,
  categoryIds: string[],
) {
  return useQuery({
    queryKey: ['products', 'list', params, 'category-tree', categoryIds],
    queryFn: () =>
      categoryIds.length
        ? listCategoryTreeItems(
            (requestParams) => productsApi.listProducts(requestParams),
            params,
            categoryIds,
          )
        : productsApi.listProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ['products', 'detail', idOrSlug],
    queryFn: () => productsApi.getProduct(idOrSlug),
    enabled: idOrSlug !== '',
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => productsApi.listCategories(),
  });
}

export function useNicheProductCategories(niche?: ProductNiche) {
  return useQuery({
    queryKey: ['products', 'categories', niche],
    queryFn: () => productsApi.listNicheCategories(niche),
  });
}

export function useRelatedProducts(niche: ProductNiche | undefined) {
  return useQuery({
    queryKey: ['products', 'related', niche],
    queryFn: () => productsApi.listProducts({ niche, page: 1, limit: 5 }),
    enabled: niche !== undefined,
  });
}
