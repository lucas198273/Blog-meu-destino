import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useProductCategories, useProducts } from '../hooks/useProducts';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/Spinner';
import { ProductGrid } from '../components/products/ProductGrid';
import {
  DestinationFilters,
  DestinationFiltersFields,
  DestinationFiltersToggle,
} from '../components/products/DestinationFilters';
import {
  DEFAULT_SORT,
  KIND_VALUES,
  SORT_VALUES,
  parseEnumList,
  parseProviderList,
} from '../components/products/destinationFilterOptions';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { ApiError } from '../lib/errors';
import type { ListProductsParams, ProductKind, ProductSort } from '../types/product';

// Catálogo de destinos/ofertas: veículos, pacotes, equipamentos,
// experiências e destinos vindos de GET /api/products.

const PAGE_SIZE = 12;

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useProductCategories();

  // A URL manda: os filtros são lidos direto da query string.
  const kind = parseEnumList(searchParams.get('kind'), KIND_VALUES);
  const provider = parseProviderList(searchParams.get('provider'));
  const rawCategory = searchParams.get('category');
  const category =
    rawCategory && categories.data?.some((cat) => cat.slug === rawCategory)
      ? rawCategory
      : null;
  const rawSort = searchParams.get('sort');
  const sort =
    rawSort && SORT_VALUES.includes(rawSort as ProductSort)
      ? (rawSort as ProductSort)
      : DEFAULT_SORT;
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1;

  const params: ListProductsParams = {
    page,
    limit: PAGE_SIZE,
    kind: kind.length > 0 ? (kind[0] as ProductKind) : undefined,
    provider: provider.length > 0 ? provider.join(',') : undefined,
    category: category ?? undefined,
    sort: sort === DEFAULT_SORT ? undefined : sort,
  };

  const products = useProducts(params);
  const meta = products.data?.meta;

  const activeCount =
    (kind.length > 0 ? 1 : 0) +
    (provider.length > 0 ? 1 : 0) +
    (category ? 1 : 0) +
    (sort !== DEFAULT_SORT ? 1 : 0);

  /** Atualiza a query string e sempre volta para a página 1. */
  function updateParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
    }
    next.delete('page');
    setSearchParams(next);
  }

  function toggleInList<T extends string>(key: string, current: T[], value: T) {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateParams({ [key]: next.length > 0 ? next.join(',') : null });
  }

  function clearFilters() {
    setSearchParams({});
  }

  const filtersValue = {
    kind,
    provider,
    category,
    sort,
  };

  const filterHandlers = {
    categories: categories.data ?? [],
    categoriesLoading: categories.isLoading,
    activeCount,
    onToggleKind: (value: ProductKind) => toggleInList('kind', kind, value),
    onToggleProvider: (value: string) => toggleInList('provider', provider, value),
    onCategory: (slug: string | null) => updateParams({ category: slug }),
    onSort: (value: ProductSort) =>
      updateParams({ sort: value === DEFAULT_SORT ? null : value }),
    onClear: clearFilters,
  };

  const isBadRequest = products.error instanceof ApiError && products.error.status === 400;

  return (
    <>
      <Helmet>
        <title>Destinos e Ofertas | Meu Destino</title>
        <meta
          name="description"
          content="Explore destinos, pacotes, veículos e ofertas selecionadas para sua próxima viagem."
        />
      </Helmet>

      <Container className="py-12">
        <h1 className="mb-6 text-3xl font-bold text-[var(--color-primary)]">Destinos & Ofertas</h1>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600" aria-live="polite">
            {products.isSuccess && meta
              ? `${meta.total} ${meta.total === 1 ? 'destino encontrado' : 'destinos encontrados'}`
              : 'Buscando destinos...'}
          </p>
          <div className="lg:hidden">
            <DestinationFiltersToggle
              open={filtersOpen}
              activeCount={activeCount}
              onClick={() => setFiltersOpen((open) => !open)}
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Desktop: sempre visível */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-24">
              <DestinationFilters {...filtersValue} {...filterHandlers} />
            </div>
          </aside>

          {/* Mobile: accordion */}
          {filtersOpen ? (
            <div id="destinos-filtros" className="mb-8 lg:hidden">
              <DestinationFiltersFields {...filtersValue} {...filterHandlers} />
              <Button
                variant="primary"
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full"
              >
                Aplicar
              </Button>
            </div>
          ) : null}

          <div>
            {products.isLoading ? (
              <PageLoader />
            ) : products.isError ? (
              <ErrorState
                message={
                  isBadRequest
                    ? 'Algum filtro tem um valor inválido. Ajuste os filtros e tente de novo.'
                    : 'Não foi possível carregar os destinos.'
                }
                onRetry={() => products.refetch()}
              />
            ) : products.data && products.data.items.length > 0 ? (
              <>
                <ProductGrid products={products.data.items} />
                {meta ? (
                  <Pagination
                    className="mt-10"
                    page={meta.page}
                    totalPages={meta.totalPages}
                    onChange={(nextPage) => updateParams({ page: String(nextPage) })}
                  />
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <EmptyState
                  title="Nenhum destino encontrado"
                  description="Tente ajustar os filtros."
                />
                {activeCount > 0 ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
