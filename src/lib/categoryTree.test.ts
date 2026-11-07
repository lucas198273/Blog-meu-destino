import { describe, expect, it, vi } from 'vitest';
import type { PaginatedData } from '../types/api';
import { getCategoryTreeIds, listCategoryTreeItems } from './categoryTree';

describe('category tree filtering', () => {
  it('resolves every descendant, including nested children', () => {
    const categories = [
      { id: 'parent', parent_id: null },
      { id: 'child', parent_id: 'parent' },
      { id: 'grandchild', parent_id: 'child' },
      { id: 'unrelated', parent_id: null },
    ];

    expect(getCategoryTreeIds(categories, 'parent')).toEqual([
      'parent',
      'child',
      'grandchild',
    ]);
  });

  it('combines and paginates items from all selected category IDs', async () => {
    const responses: Record<string, PaginatedData<{ id: string; display_order: number }>> = {
      parent: {
        items: [
          { id: 'parent-item', display_order: 2 },
          { id: 'shared-item', display_order: 3 },
        ],
        meta: { page: 1, limit: 100, total: 2, totalPages: 1 },
      },
      child: {
        items: [
          { id: 'child-item', display_order: 1 },
          { id: 'shared-item', display_order: 3 },
        ],
        meta: { page: 1, limit: 100, total: 2, totalPages: 1 },
      },
    };
    const fetchPage = vi.fn(async ({ category }: { category?: string; page?: number; limit?: number }) => {
      if (!category) throw new Error('Expected category ID');
      return responses[category];
    });

    const result = await listCategoryTreeItems(
      fetchPage,
      { page: 1, limit: 2 },
      ['parent', 'child'],
    );

    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(result.items.map((item) => item.id)).toEqual([
      'child-item',
      'parent-item',
    ]);
    expect(result.meta).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
  });
});
