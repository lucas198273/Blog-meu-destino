import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import type { ListProductsParams } from '../types/product';

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
