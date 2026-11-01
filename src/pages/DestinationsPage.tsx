import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { PostCard } from '../components/blog/PostCard';
import { DestinationFilters } from '../components/products/DestinationFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { usePosts } from '../hooks/usePosts';
import { useProductCategories, useProducts } from '../hooks/useProducts';
import type { ListProductsParams } from '../types/product';

const PAGE_SIZE = 12;

export function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useProductCategories();
  const rawCategory = searchParams.get('category');
  const category =
    rawCategory && categories.data?.some((item) => item.slug === rawCategory)
      ? rawCategory
      : null;
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const posts = usePosts({ limit: 3 });
  const params = useMemo<ListProductsParams>(
    () => ({
      kind: 'package',
      category: category ?? undefined,
      page,
      limit: PAGE_SIZE,
      sort: 'display_order',
    }),
    [category, page],
  );
  const packages = useProducts(params);
  const meta = packages.data?.meta;

  function updateParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete('page');
    setSearchParams(next);
  }

  const activeCount = Number(Boolean(category));

  return (
    <>
      <Helmet>
        <title>Destinos e pacotes | Meu Destino</title>
        <meta
          name="description"
          content="Inspire-se com guias de viagem e encontre pacotes para sua próxima aventura."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-[#073b3e] via-[#0d5556] to-[#18736c] text-white">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
            Descubra seu próximo lugar favorito
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Destinos para sonhar. Viagens para viver.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Histórias, dicas e ofertas para transformar inspiração em roteiro.
          </p>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <section aria-labelledby="guides-heading">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">
                Inspire-se
              </p>
              <h2
                id="guides-heading"
                className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                Guias e inspirações
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
            >
              Ver todos os guias
            </Link>
          </div>

          {posts.isLoading ? (
            <PageLoader />
          ) : posts.isError ? (
            <ErrorState
              message="Não foi possível carregar os guias de viagem."
              onRetry={() => posts.refetch()}
            />
          ) : posts.data?.items.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.data.items.map((post, index) => (
                <div
                  key={post.id}
                  className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Novos guias em breve"
              description="Enquanto isso, explore nossos pacotes em destaque."
            />
          )}
        </section>

        <section aria-labelledby="packages-heading" className="mt-14 sm:mt-20">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
              Sua próxima viagem começa aqui
            </p>
            <h2
              id="packages-heading"
              className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Pacotes e passagens em destaque
            </h2>
          </div>

          <DestinationFilters
            pageType="destination"
            category={category}
            categories={categories.data ?? []}
            categoriesLoading={categories.isLoading}
            activeCount={activeCount}
            onCategoryChange={(value) => updateParams({ category: value })}
            onClear={() => setSearchParams({})}
            className="mb-7"
          />

          <p className="mb-5 text-sm text-slate-500" aria-live="polite">
            {meta
              ? `${meta.total} ${meta.total === 1 ? 'pacote disponível' : 'pacotes disponíveis'}`
              : 'Seleção de ofertas para sua próxima viagem'}
          </p>

          {packages.isLoading ? (
            <PageLoader />
          ) : packages.isError ? (
            <ErrorState
              message="Não foi possível carregar os pacotes."
              onRetry={() => packages.refetch()}
            />
          ) : packages.data?.items.length ? (
            <>
              <ProductGrid
                products={packages.data.items}
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
              title="Nenhum pacote encontrado"
              description="Confira outra região ou volte em breve para novas ofertas."
            />
          )}
        </section>
      </Container>
    </>
  );
}
