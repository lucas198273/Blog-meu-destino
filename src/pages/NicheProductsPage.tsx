import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { NicheTabs } from '../components/products/NicheTabs';
import { ProductGrid } from '../components/products/ProductGrid';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import {
  useNicheProductCategories,
  useProductsForCategoryTree,
} from '../hooks/useProducts';
import { trackEvent } from '../lib/analytics';
import type { ListProductsParams, ProductNiche } from '../types/product';
import { getCategoryTreeIds } from '../lib/categoryTree';
import { canonicalUrl } from '../lib/seo';
import { useLocations } from '../hooks/useLocations';

const PAGE_SIZE = 12;

const nicheContent: Record<
  ProductNiche,
  { title: string; description: string }
> = {
  veiculos: {
    title: 'Encontre o veículo ideal para sua viagem',
    description:
      'Compare ofertas de aluguel nas maiores locadoras através dos nossos parceiros.',
  },
  equipamentos: {
    title: 'Equipamentos essenciais para sua próxima aventura',
    description: 'Descubra malas, eletrônicos e itens de viagem em lojas parceiras.',
  },
  viagens: {
    title: 'Descubra pacotes de viagens inesquecíveis',
    description:
      'Encontre ofertas nacionais e internacionais e reserve diretamente com nossos parceiros.',
  },
};

export function NicheProductsPage({ niche }: { niche: ProductNiche }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useNicheProductCategories(niche);
  const locations = useLocations(niche !== 'equipamentos');
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
  const location = searchParams.get('location_slug') ?? '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const content = nicheContent[niche];
  const canonicalPath =
    niche === 'veiculos'
      ? '/veiculos'
      : niche === 'equipamentos'
        ? '/equipamentos'
        : '/pacotes-de-viagem';

  const params = useMemo<ListProductsParams>(
    () => ({
      niche,
      partner: partner || undefined,
      location_slug:
        niche === 'equipamentos' ? undefined : location || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [niche, page, partner, location],
  );
  const products = useProductsForCategoryTree(params, categoryIds);
  const meta = products.data?.meta;

  function applyFilters(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete('page');
    setSearchParams(next, { replace: true, preventScrollReset: true });
    const nextCategory = Object.prototype.hasOwnProperty.call(changes, 'category')
      ? changes.category
      : category;
    trackEvent('filter_products', {
      niche,
      category: nextCategory ?? '',
      page: 1,
    });
  }

  function changePage(nextPage: number) {
    setSearchParams((current) => {
      current.set('page', String(nextPage));
      return current;
    }, { preventScrollReset: true });
    trackEvent('filter_products', { niche, category: category ?? '', page: nextPage });
  }

  return (
    <>
      <Helmet>
        <title>
          {niche === 'veiculos'
            ? 'Aluguel de Carros e Veículos para Viagem | Meu Destino'
            : niche === 'equipamentos'
              ? 'Equipamentos de Viagem e Acessórios | Meu Destino'
              : 'Pacotes de Viagens Nacionais e Internacionais | Meu Destino'}
        </title>
        <meta
          name="description"
          content={
            niche === 'veiculos'
              ? 'Encontre carros para alugar nas melhores locadoras do Brasil e do mundo. Compare preços de SUVs, sedans e carros econômicos com nossos parceiros.'
              : niche === 'equipamentos'
                ? 'Encontre malas, eletrônicos e itens de camping com os melhores preços. Descubra equipamentos essenciais para sua aventura nas lojas parceiras.'
                : 'Descubra pacotes de viagens, passagens e hospedagens para os melhores destinos. Encontre ofertas exclusivas em nossas agências parceiras.'
          }
        />
        <link rel="canonical" href={canonicalUrl(canonicalPath)} />
      </Helmet>

      <section className="bg-gradient-to-br from-[#073b3e] via-[#0d5556] to-[#18736c] text-white">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
            Explore por categoria
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {content.description}
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <NicheTabs
          onChange={(nextNiche) =>
            trackEvent('filter_products', {
              niche: nextNiche,
              category: '',
              page: 1,
            })
          }
        />

        <label className="mb-7 flex max-w-sm flex-col gap-2 text-sm font-medium text-slate-700">
          Categoria
          <select
            value={category ?? ''}
            onChange={(event) =>
              applyFilters({ category: event.currentTarget.value || null })
            }
            disabled={categories.isLoading}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          >
            <option value="">Todas as categorias</option>
            {(categories.data ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        {niche !== 'equipamentos' ? (
          <label className="mb-7 flex max-w-sm flex-col gap-2 text-sm font-medium text-slate-700">
            Localização (destino)
            <select
              value={location}
              onChange={(event) =>
                applyFilters({ location_slug: event.currentTarget.value || null })
              }
              disabled={locations.isLoading}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
            >
              <option value="">
                {locations.isLoading ? 'Carregando destinos…' : 'Todos os destinos'}
              </option>
              {(locations.data ?? []).map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.nome}
                </option>
              ))}
            </select>
            {locations.isError ? (
              <button
                type="button"
                onClick={() => locations.refetch()}
                className="text-left text-xs text-red-700 underline"
              >
                Não foi possível carregar os destinos. Tentar novamente
              </button>
            ) : null}
          </label>
        ) : null}

        <p className="mb-5 text-sm text-slate-500" aria-live="polite">
          {meta
            ? `${meta.total} ${meta.total === 1 ? 'produto disponível' : 'produtos disponíveis'}`
            : 'Explore nossa seleção'}
        </p>

        {products.isLoading ? (
          <PageLoader />
        ) : products.isError ? (
          <ErrorState
            message="Não foi possível carregar os produtos."
            onRetry={() => products.refetch()}
          />
        ) : products.data?.items.length ? (
          <>
            <ProductGrid products={products.data.items} />
            {meta ? (
              <Pagination
                className="mt-10"
                page={meta.page}
                totalPages={meta.totalPages}
                onChange={changePage}
              />
            ) : null}
          </>
        ) : (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Experimente outra categoria ou volte em breve para conferir novas ofertas."
          />
        )}
      </Container>
    </>
  );
}
