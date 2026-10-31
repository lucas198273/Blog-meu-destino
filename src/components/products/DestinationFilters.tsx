import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { CategoryPills } from '../blog/CategoryPills';
import { FilterPillGroup } from './FilterPillGroup';
import { KIND_OPTIONS, PROVIDER_OPTIONS, SORT_OPTIONS } from './destinationFilterOptions';
import type { ProductCategory, ProductKind, ProductSort } from '../../types/product';

/** Valores ativos dos filtros de destinos (arrays vazios = sem filtro). */
export interface DestinationFiltersValue {
  kind: ProductKind[];
  provider: string[];
  category: string | null;
  sort: ProductSort;
}

interface DestinationFiltersProps extends DestinationFiltersValue {
  categories: ProductCategory[];
  categoriesLoading: boolean;
  activeCount: number;
  onToggleKind: (value: ProductKind) => void;
  onToggleProvider: (value: string) => void;
  onCategory: (slug: string | null) => void;
  onSort: (value: ProductSort) => void;
  onClear: () => void;
  className?: string;
}

/**
 * Painel de filtros do catálogo de destinos/ofertas.
 * No desktop fica sempre visível na sidebar; no mobile abre em accordion.
 */
export function DestinationFilters(props: DestinationFiltersProps) {
  return (
    <div className={props.className}>
      <DestinationFiltersFields {...props} />
    </div>
  );
}

/** Botão que alterna o painel no mobile (visível só abaixo de `lg`). */
export function DestinationFiltersToggle({
  open,
  activeCount,
  onClick,
}: {
  open: boolean;
  activeCount: number;
  onClick: () => void;
}) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="destinos-filtros"
      className="w-full lg:hidden"
    >
      <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
      {open ? 'Ocultar filtros' : 'Filtros'}
      {activeCount > 0 ? (
        <span className="ml-2 rounded-full bg-teal-700 px-2 py-0.5 text-xs text-white">
          {activeCount}
        </span>
      ) : null}
    </Button>
  );
}

export function DestinationFiltersFields({
  kind,
  provider,
  category,
  sort,
  categories,
  categoriesLoading,
  activeCount,
  onToggleKind,
  onToggleProvider,
  onCategory,
  onSort,
  onClear,
}: DestinationFiltersProps) {
  return (
    <div className="space-y-7">
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Tipo de oferta
        </h2>
        <FilterPillGroup
          label="Tipo"
          options={KIND_OPTIONS}
          selected={kind}
          onToggle={onToggleKind}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Fornecedor
        </h2>
        <FilterPillGroup
          label="Fornecedor"
          options={PROVIDER_OPTIONS}
          selected={provider}
          onToggle={onToggleProvider}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Categoria
        </h2>
        <CategoryPills
          categories={categories}
          activeSlug={category}
          onSelect={onCategory}
          loading={categoriesLoading}
          ariaLabel="Filtrar destinos por categoria"
          allLabel="Todas"
        />
      </section>

      <section>
        <label
          htmlFor="destinos-sort"
          className="mb-3 block text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Ordenar por
        </label>
        <select
          id="destinos-sort"
          value={sort}
          onChange={(event) => onSort(event.target.value as ProductSort)}
          className={cn(
            'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none',
            'focus-visible:border-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]',
          )}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      {activeCount > 0 ? (
        <Button variant="ghost" onClick={onClear} className="w-full justify-start">
          <X className="mr-2 h-4 w-4" aria-hidden="true" />
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
}
