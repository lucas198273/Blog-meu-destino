import type { PaginatedData } from '../types/api';

interface HierarchicalCategory {
  id: string;
  parent_id: string | null;
}

export function getCategoryTreeIds(
  categories: HierarchicalCategory[],
  parentId: string | null,
): string[] {
  if (!parentId) return [];

  const ids = new Set([parentId]);
  let foundDescendant = true;

  while (foundDescendant) {
    foundDescendant = false;
    for (const category of categories) {
      if (category.parent_id && ids.has(category.parent_id) && !ids.has(category.id)) {
        ids.add(category.id);
        foundDescendant = true;
      }
    }
  }

  return [...ids];
}

type CategoryListParams = {
  category?: string;
  page?: number;
  limit?: number;
};

export async function listCategoryTreeItems<T extends { id: string }, P extends CategoryListParams>(
  fetchPage: (params: P) => Promise<PaginatedData<T>>,
  params: P,
  categoryIds: string[],
): Promise<PaginatedData<T>> {
  const requestedPage = params.page ?? 1;
  const requestedLimit = params.limit ?? 12;
  const itemsByCategory = await Promise.all(
    categoryIds.map(async (category) => {
      const firstPage = await fetchPage({
        ...params,
        category,
        page: 1,
        limit: 100,
      });
      const items = [...firstPage.items];

      for (let page = 2; page <= firstPage.meta.totalPages; page += 1) {
        const result = await fetchPage({
          ...params,
          category,
          page,
          limit: 100,
        });
        items.push(...result.items);
      }

      return items;
    }),
  );

  const uniqueItems = new Map<string, T>();
  for (const items of itemsByCategory) {
    for (const item of items) uniqueItems.set(item.id, item);
  }

  const allItems = [...uniqueItems.values()];
  allItems.sort((left, right) => {
    const leftOrder = 'display_order' in left ? left.display_order : undefined;
    const rightOrder = 'display_order' in right ? right.display_order : undefined;
    if (typeof leftOrder === 'number' && typeof rightOrder === 'number' && leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftCreatedAt = 'created_at' in left ? left.created_at : undefined;
    const rightCreatedAt = 'created_at' in right ? right.created_at : undefined;
    const leftDate = typeof leftCreatedAt === 'string' ? Date.parse(leftCreatedAt) : NaN;
    const rightDate = typeof rightCreatedAt === 'string' ? Date.parse(rightCreatedAt) : NaN;
    return Number.isNaN(leftDate) || Number.isNaN(rightDate) ? 0 : rightDate - leftDate;
  });

  const start = (requestedPage - 1) * requestedLimit;
  return {
    items: allItems.slice(start, start + requestedLimit),
    meta: {
      page: requestedPage,
      limit: requestedLimit,
      total: allItems.length,
      totalPages: Math.ceil(allItems.length / requestedLimit),
    },
  };
}
