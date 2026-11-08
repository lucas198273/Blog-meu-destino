import { MobileFilterDrawer } from '../common/MobileFilterDrawer';
import { cn } from '../../lib/cn';
import type { BlogCategory } from '../../types/blog';
import type { Location } from '../../types/location';

interface BlogFiltersSidebarProps {
  categories: BlogCategory[];
  locations: Location[];
  selectedCategory: string | null;
  selectedLocation: string | null;
  categoriesLoading: boolean;
  locationsLoading: boolean;
  categoriesError: boolean;
  locationsError: boolean;
  onSelectCategory: (slug: string | null) => void;
  onSelectLocation: (slug: string | null) => void;
  onRetryCategories: () => void;
  onRetryLocations: () => void;
}

export function BlogFiltersSidebar({
  categories,
  locations,
  selectedCategory,
  selectedLocation,
  categoriesLoading,
  locationsLoading,
  categoriesError,
  locationsError,
  onSelectCategory,
  onSelectLocation,
  onRetryCategories,
  onRetryLocations,
}: BlogFiltersSidebarProps) {
  const childrenByParent = new Map<string | null, BlogCategory[]>();
  const categoryIds = new Set(categories.map((category) => category.id));
  for (const category of categories) {
    const parentId =
      category.parent_id && categoryIds.has(category.parent_id)
        ? category.parent_id
        : null;
    const siblings = childrenByParent.get(parentId) ?? [];
    siblings.push(category);
    childrenByParent.set(parentId, siblings);
  }

  function renderCategories(parentId: string | null, depth = 0) {
    const children = childrenByParent.get(parentId) ?? [];
    if (!children.length) return null;

    return (
      <ul className={cn('space-y-1', depth > 0 && 'ml-4 border-l border-slate-100 pl-2')}>
        {children.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              aria-pressed={selectedCategory === category.slug}
              onClick={() =>
                onSelectCategory(
                  selectedCategory === category.slug ? null : category.slug,
                )
              }
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50',
                selectedCategory === category.slug
                  ? 'bg-teal-50 font-semibold text-teal-900'
                  : 'text-slate-600',
              )}
            >
              {category.nome}
            </button>
            {renderCategories(category.id, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }

  const filters = (
    <div className="space-y-5" aria-label="Filtros do blog">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Explore por Tipo</h2>
        <p className="mt-1 text-xs text-slate-500">Escolha a categoria do conteúdo.</p>
        <div className="mt-3">
          <button
            type="button"
            aria-pressed={selectedCategory === null}
            onClick={() => onSelectCategory(null)}
            className={cn(
              'mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium',
              selectedCategory === null
                ? 'bg-teal-50 text-teal-900'
                : 'text-slate-600 hover:bg-slate-50',
            )}
          >
            Todos os tipos
          </button>
          {categoriesLoading ? (
            <p className="px-3 py-2 text-sm text-slate-500">Carregando tipos…</p>
          ) : categoriesError ? (
            <button
              type="button"
              onClick={onRetryCategories}
              className="px-3 py-2 text-left text-sm text-red-700 underline"
            >
              Não foi possível carregar os tipos. Tentar novamente
            </button>
          ) : (
            renderCategories(null)
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Explore por Destino</h2>
        <p className="mt-1 text-xs text-slate-500">Filtre pelo local da viagem.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={selectedLocation === null}
            onClick={() => onSelectLocation(null)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium',
              selectedLocation === null
                ? 'border-teal-800 bg-teal-800 text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50',
            )}
          >
            Todos
          </button>
          {locationsLoading ? (
            <span className="text-sm text-slate-500">Carregando destinos…</span>
          ) : locationsError ? (
            <button
              type="button"
              onClick={onRetryLocations}
              className="text-left text-sm text-red-700 underline"
            >
              Não foi possível carregar os destinos. Tentar novamente
            </button>
          ) : (
            locations.map((location) => (
              <button
                key={location.id}
                type="button"
                aria-pressed={selectedLocation === location.slug}
                onClick={() =>
                  onSelectLocation(
                    selectedLocation === location.slug ? null : location.slug,
                  )
                }
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  selectedLocation === location.slug
                    ? 'border-teal-800 bg-teal-800 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-teal-700 hover:text-teal-900',
                )}
              >
                {location.nome}
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );

  return (
    <>
      <MobileFilterDrawer title="Filtros do blog" closeOnSelect>
        {filters}
      </MobileFilterDrawer>
      <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block">
        {filters}
      </aside>
    </>
  );
}
