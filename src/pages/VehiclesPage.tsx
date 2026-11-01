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
import { useProducts } from '../hooks/useProducts';
import type { ListProductsParams } from '../types/product';

const PAGE_SIZE = 12;

const VEHICLE_PROVIDERS: Record<string, string> = {
  rentcars: 'Rentcars',
  localiza: 'Localiza',
  movida: 'Movida',
};

const VEHICLE_TYPES: Record<string, string> = {
  suv: 'SUV',
  sedan: 'Sedan',
  economico: 'Econômico',
  luxo: 'Luxo',
};

export function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProvider = searchParams.get('provider')?.toLowerCase() ?? '';
  const selectedType = searchParams.get('vehicle_type')?.toLowerCase() ?? '';
  const provider = VEHICLE_PROVIDERS[selectedProvider] ? selectedProvider : '';
  const vehicleType = VEHICLE_TYPES[selectedType] ? selectedType : '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const params = useMemo<ListProductsParams>(
    () => ({
      kind: 'vehicle',
      page,
      limit: PAGE_SIZE,
      provider: provider ? VEHICLE_PROVIDERS[provider] : undefined,
      tags: vehicleType ? VEHICLE_TYPES[vehicleType] : undefined,
    }),
    [page, provider, vehicleType],
  );
  const products = useProducts(params);
  const meta = products.data?.meta;

  function updateParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete('page');
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams({});
  }

  const activeCount = Number(Boolean(provider)) + Number(Boolean(vehicleType));

  return (
    <>
      <Helmet>
        <title>Aluguel de carros | Meu Destino</title>
        <meta
          name="description"
          content="Compare parceiros e encontre o carro ideal para sua próxima viagem."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-[#073b3e] via-[#0d5556] to-[#18736c] text-white">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
            Liberdade para explorar
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Encontre o carro ideal para sua viagem
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Compare opções de parceiros confiáveis e siga viagem no seu ritmo.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <DestinationFilters
          pageType="vehicle"
          provider={provider}
          vehicleType={vehicleType}
          activeCount={activeCount}
          onProviderChange={(value) => updateParams({ provider: value || null })}
          onVehicleTypeChange={(value) =>
            updateParams({ vehicle_type: value || null })
          }
          onClear={clearFilters}
          className="mb-8"
        />

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
              className="lg:grid-cols-3 2xl:grid-cols-4"
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
                  })
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
      </Container>
    </>
  );
}
