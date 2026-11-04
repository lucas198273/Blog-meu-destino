import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { DestinationFilters } from '../components/products/DestinationFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { PageLoader } from '../components/ui/Spinner';
import { Pagination } from '../components/common/Pagination';
import {
  useNicheProductCategories,
  useProductsForCategoryTree,
} from '../hooks/useProducts';
import type { ListProductsParams } from '../types/product';
import { getCategoryTreeIds } from '../lib/categoryTree';

const PAGE_SIZE = 16;

function parsePrice(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function GearPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useNicheProductCategories('equipamentos');
  const rawCategory = searchParams.get('category');
  const selectedCategory = categories.data?.find(
    (item) => item.id === rawCategory || item.slug === rawCategory,
  );
  const category = selectedCategory?.id ?? null;
  const categoryIds = useMemo(
    () => getCategoryTreeIds(categories.data ?? [], category),
    [categories.data, category],
  );
  const selectedPartner = searchParams.get('partner')?.toLowerCase() ?? '';
  const partner = selectedPartner;
  const minPriceValue = searchParams.get('min_price') ?? '';
  const maxPriceValue = searchParams.get('max_price') ?? '';
  const minPrice = parsePrice(minPriceValue);
  const maxPrice = parsePrice(maxPriceValue);
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const params = useMemo<ListProductsParams>(
    () => ({
      kind: 'gear',
      page,
      limit: PAGE_SIZE,
      partner: partner || undefined,
      min_price: minPrice,
      max_price: maxPrice,
    }),
    [page, partner, minPrice, maxPrice],
  );
  const products = useProductsForCategoryTree(params, categoryIds);
  const meta = products.data?.meta;

  function updateParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete('page');
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  function clearFilters() {
    setSearchParams({}, { replace: true, preventScrollReset: true });
  }

  const activeCount =
    Number(Boolean(partner)) +
    Number(Boolean(category)) +
    Number(minPrice !== undefined) +
    Number(maxPrice !== undefined);

  return (
    <>
      <Helmet>
        <title>Equipamentos de viagem | Meu Destino</title>
        <meta
          name="description"
          content="Encontre malas, acessórios e equipamentos essenciais para viajar melhor."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-[#fff8ed] via-[#fff3df] to-[#f8e6c6]">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
            Prepare-se para ir mais longe
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Equipamentos essenciais para sua viagem
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Escolhas práticas para fazer as malas, explorar e aproveitar cada
            destino.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <DestinationFilters
          pageType="gear"
          partner={partner}
          category={category}
          categories={categories.data ?? []}
          categoriesLoading={categories.isLoading}
          minPrice={minPriceValue}
          maxPrice={maxPriceValue}
          activeCount={activeCount}
          onPartnerChange={(value) => updateParams({ partner: value || null })}
          onCategoryChange={(value) => updateParams({ category: value })}
          onMinPriceChange={(value) =>
            updateParams({ min_price: value || null })
          }
          onMaxPriceChange={(value) =>
            updateParams({ max_price: value || null })
          }
          onClear={clearFilters}
          className="mb-8"
        />

        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Itens para viajar melhor
          </h2>
          <p className="mt-1 text-sm text-slate-500" aria-live="polite">
            {meta
              ? `${meta.total} ${meta.total === 1 ? 'produto' : 'produtos'}`
              : 'Explore nossa seleção'}
          </p>
        </div>

        {products.isLoading ? (
          <PageLoader />
        ) : products.isError ? (
          <ErrorState
            message="Não foi possível carregar os equipamentos."
            onRetry={() => products.refetch()}
          />
        ) : products.data?.items.length ? (
          <>
            <ProductGrid
              products={products.data.items}
              className="lg:grid-cols-4"
            />
            {meta ? (
              <Pagination
                className="mt-10"
                page={meta.page}
                totalPages={meta.totalPages}
                onChange={(nextPage) =>
                  setSearchParams((current) => {
                    current.set('page', String(nextPage));
                    return current;
                  }, { preventScrollReset: true })
                }
              />
            ) : null}
          </>
        ) : (
          <EmptyState
            title="Nenhum equipamento encontrado"
            description="Ajuste os filtros de parceiro ou faixa de preço."
          />
        )}
      </Container>
    </>
  );
}
