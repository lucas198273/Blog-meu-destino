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
import { canonicalUrl } from '../lib/seo';
import { DynamicWidget } from '../components/widgets/DynamicWidget';
import { useLocations } from '../hooks/useLocations';

const PAGE_SIZE = 12;

const VEHICLE_TYPES: Record<string, string> = {
  suv: 'SUV',
  sedan: 'Sedan',
  economico: 'Econômico',
  luxo: 'Luxo',
};

export function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useNicheProductCategories('veiculos');
  const rawCategory = searchParams.get('category');
  const selectedCategory = categories.data?.find(
    (item) => item.id === rawCategory || item.slug === rawCategory,
  );
  const category = selectedCategory?.id ?? null;
  const categoryIds = useMemo(
    () => getCategoryTreeIds(categories.data ?? [], category),
    [categories.data, category],
  );
  const partner = searchParams.get('partner')?.toLowerCase() ?? '';
  const selectedType = searchParams.get('vehicle_type')?.toLowerCase() ?? '';
  const vehicleType = VEHICLE_TYPES[selectedType] ? selectedType : '';
  const location = searchParams.get('location_slug') ?? '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const params = useMemo<ListProductsParams>(
    () => ({
      kind: 'vehicle',
      page,
      limit: PAGE_SIZE,
      partner: partner || undefined,
      location_slug: location || undefined,
      tags: vehicleType ? VEHICLE_TYPES[vehicleType] : undefined,
    }),
    [page, partner, vehicleType, location],
  );
  // Widget de afiliado: o filtro trabalha com slug, a rota /api/widgets/resolve
  // espera o UUID da localizaÃ§Ã£o.
  const locations = useLocations();
  const selectedLocationId = useMemo(
    () => locations.data?.find((item) => item.slug === location)?.id ?? null,
    [locations.data, location],
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
    Number(Boolean(vehicleType)) +
    Number(Boolean(category)) +
    Number(Boolean(location));

  return (
    <>
      <Helmet>
        <title>Aluguel de Carros e Veículos para Viagem | Meu Destino</title>
        <meta
          name="description"
          content="Encontre carros para alugar nas melhores locadoras do Brasil e do mundo. Compare preços de SUVs, sedans e carros econômicos com nossos parceiros."
        />
        <link rel="canonical" href={canonicalUrl('/veiculos')} />
      </Helmet>

      <section className="bg-gradient-to-br from-[#073b3e] via-[#0d5556] to-[#18736c] text-white">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
            Liberdade para explorar
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Encontre o veículo ideal para sua viagem
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Compare ofertas de aluguel nas maiores locadoras através dos nossos parceiros.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <DestinationFilters
          pageType="vehicle"
          partner={partner}
          category={category}
          location={location}
          categories={categories.data ?? []}
          categoriesLoading={categories.isLoading}
          vehicleType={vehicleType}
          activeCount={activeCount}
          onPartnerChange={(value) => updateParams({ partner: value || null })}
          onCategoryChange={(value) => updateParams({ category: value })}
          onLocationChange={(value) =>
            updateParams({ location_slug: value || null })
          }
          onVehicleTypeChange={(value) =>
            updateParams({ vehicle_type: value || null })
          }
          onClear={clearFilters}
          className="lg:mb-0"
        />

        <section className="min-w-0">
        <DynamicWidget niche="aluguel-veiculos" locationId={selectedLocationId} />
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Carros para sua próxima viagem
            </h2>
            <p className="mt-1 text-sm text-slate-500" aria-live="polite">
              {meta
                ? `${meta.total} ${meta.total === 1 ? 'opção disponível' : 'opções disponíveis'}`
                : 'Encontre sua próxima opção'}
            </p>
          </div>
        </div>

        {products.isLoading ? (
          <PageLoader />
        ) : products.isError ? (
          <ErrorState
            message="Não foi possível carregar os veículos."
            onRetry={() => products.refetch()}
          />
        ) : products.data?.items.length ? (
          <>
            <ProductGrid
              products={products.data.items}
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
            title="Nenhum veículo encontrado"
            description="Experimente outro parceiro ou tipo de veículo."
          />
        )}
        </section>
        </div>
      </Container>
    </>
  );
}


