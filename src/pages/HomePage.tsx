import { useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import {
  useBlogCategories,
  usePosts,
  usePostsForCategoryTree,
} from '../hooks/usePosts';
import { useProducts } from '../hooks/useProducts';
import { getCategoryTreeIds } from '../lib/categoryTree';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { ButtonLink } from '../components/ui/Button';
import { CategoryPills } from '../components/blog/CategoryPills';
import { PostList } from '../components/blog/PostList';
import { ProductGrid } from '../components/products/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

const POSTS_LIMIT = 9;
const FEATURED_LIMIT = 3;
/** Caminho do banner do hero. */
const HERO_BANNER_SRC = '/assets/bloghero.png';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slugFromUrl = searchParams.get('category');
  const categories = useBlogCategories();

  // Só aceita slug que existe no backend — evita request inútil.
  const activeSlug = useMemo(() => {
    if (!slugFromUrl) return null;
    const exists = categories.data?.some((cat) => cat.slug === slugFromUrl);
    return exists ? slugFromUrl : null;
  }, [slugFromUrl, categories.data]);

  const activeCategory = categories.data?.find((cat) => cat.slug === activeSlug);
  const categoryIds = useMemo(
    () => getCategoryTreeIds(categories.data ?? [], activeCategory?.id ?? null),
    [activeCategory?.id, categories.data],
  );
  const filteredParams = useMemo(
    () => ({ limit: POSTS_LIMIT }),
    [],
  );
  const featuredParams = useMemo(
    () => ({ limit: FEATURED_LIMIT, featured: true }),
    [],
  );
  const treeFilteredPosts = usePostsForCategoryTree(filteredParams, categoryIds);
  const featuredPosts = usePosts(featuredParams);
  const vehicleFeatured = useProducts({ niche: 'veiculos', featured: true, limit: 1 });
  const vehicleFallback = useProducts({ niche: 'veiculos', limit: 1 });
  const gearFeatured = useProducts({ niche: 'equipamentos', featured: true, limit: 1 });
  const gearFallback = useProducts({ niche: 'equipamentos', limit: 1 });
  const travelFeatured = useProducts({ niche: 'viagens', featured: true, limit: 1 });
  const travelFallback = useProducts({ niche: 'viagens', limit: 1 });
  const offerQueries = [
    vehicleFeatured,
    vehicleFallback,
    gearFeatured,
    gearFallback,
    travelFeatured,
    travelFallback,
  ];
  const productsLoading = offerQueries.some((query) => query.isLoading);
  const failedNiches = [
    [vehicleFeatured, vehicleFallback],
    [gearFeatured, gearFallback],
    [travelFeatured, travelFallback],
  ].filter((queries) => queries.every((query) => query.isError));
  const featuredProducts = [
    vehicleFeatured.data?.items[0] ?? vehicleFallback.data?.items[0],
    gearFeatured.data?.items[0] ?? gearFallback.data?.items[0],
    travelFeatured.data?.items[0] ?? travelFallback.data?.items[0],
  ].filter((product) => product !== undefined);

  const handleSelect = useCallback(
    (slug: string | null) => {
      const next = new URLSearchParams(searchParams);
      if (slug) next.set('category', slug);
      else next.delete('category');
      setSearchParams(next, { replace: true, preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  return (
    <>
      <Helmet>
        <title>Início | Meu Destino</title>
        <meta
          name="description"
          content="Roteiros, destinos e pontos turísticos — planeje sua próxima viagem com o Meu Destino."
        />
      </Helmet>

      {/* Hero — banner fixo de fundo (1200×400) */}
      <section className="relative isolate overflow-hidden bg-[#0F2A12]">
        <img
          src={HERO_BANNER_SRC}
          alt=""
          aria-hidden="true"
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />

        {/* Overlay para legibilidade do texto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06393c]/95 via-[#06393c]/70 to-[#06393c]/20"
        />

        <Container className="relative min-h-[340px] py-16 sm:min-h-[460px] sm:py-24">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Sua próxima <span className="text-[var(--color-accent)]">viagem</span> começa aqui
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
              Roteiros, pontos turísticos e dicas reais para explorar o Brasil e
              o mundo — com pacotes e aluguel de carros na palma da mão.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/blog">Explorar Destinos</ButtonLink>
              <ButtonLink to="/pacotes-de-viagem" variant="secondary">
                Ver Pacotes CVC
              </ButtonLink>
              <ButtonLink
                to="/aluguel-de-veiculos"
                className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
              >
                Alugar Veículo
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <section>
          <h2 className="mb-8 text-2xl font-bold text-[var(--color-primary)]">
            Ofertas em destaque
          </h2>
          {productsLoading ? (
            <PageLoader />
          ) : failedNiches.length > 0 ? (
            <ErrorState
              message="Não foi possível carregar as ofertas."
              onRetry={() => offerQueries.forEach((query) => void query.refetch())}
            />
          ) : null}
          {!productsLoading && featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : !productsLoading && failedNiches.length === 0 ? (
            <EmptyState title="Nenhuma oferta em destaque ainda" />
          ) : null}
        </section>

        <section>
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Posts em destaque
          </h2>
          {featuredPosts.isLoading ? (
            <PageLoader />
          ) : featuredPosts.isError ? (
            <ErrorState
              message="Não foi possível carregar os posts."
              onRetry={() => featuredPosts.refetch()}
            />
          ) : featuredPosts.data && featuredPosts.data.items.length > 0 ? (
            <PostList posts={featuredPosts.data.items} />
          ) : (
            <EmptyState title="Nenhum post em destaque ainda" />
          )}
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Últimos Posts
          </h2>
          <div className="mb-8">
            <CategoryPills
              categories={categories.data ?? []}
              activeSlug={activeSlug}
              onSelect={handleSelect}
              loading={categories.isLoading}
            />
          </div>
          {treeFilteredPosts.isLoading ? (
            <PageLoader />
          ) : treeFilteredPosts.isError ? (
            <ErrorState
              message="Não foi possível carregar os posts."
              onRetry={() => treeFilteredPosts.refetch()}
            />
          ) : treeFilteredPosts.data?.items.length ? (
            <PostList posts={treeFilteredPosts.data.items} />
          ) : (
            <EmptyState
              title="Nenhum post encontrado"
              description="Tente outra categoria."
            />
          )}
        </section>

      </Container>

      {/* Seção institucional — contraste de marca com CTA para /sobre */}
      <section className="bg-gradient-to-br from-[#073b3e] via-[#0d5556] to-[#18736c] text-white">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <img
              src="/assets/logo.webp"
              alt="Meu Destino"
              loading="lazy"
              className="mx-auto h-24 w-auto rounded-2xl bg-white p-3 shadow-lg"
            />
            <p className="mt-8 text-base leading-relaxed text-white/90 sm:text-lg">
              O Meu Destino é o seu guia definitivo de viagens. Nós conectamos
              você aos melhores conteúdos e às ofertas exclusivas dos nossos
              parceiros para que sua próxima aventura seja inesquecível.
            </p>
            <ButtonLink
              to="/sobre"
              variant="secondary"
              className="mt-8 bg-white/10 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20 hover:text-white"
            >
              Saiba mais sobre nós
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}