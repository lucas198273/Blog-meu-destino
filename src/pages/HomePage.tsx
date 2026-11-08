import { useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import {
  useBlogCategories,
  usePosts,
  usePostsForCategoryTree,
} from '../hooks/usePosts';
import { getCategoryTreeIds } from '../lib/categoryTree';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { ButtonLink } from '../components/ui/Button';
import { CategoryPills } from '../components/blog/CategoryPills';
import { PostList } from '../components/blog/PostList';
import { ProductCarousel } from '../components/products/ProductCarousel';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { canonicalUrl } from '../lib/seo';

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
        <title>Meu Destino - Guia de Viagens, Aluguel de Carros e Pacotes</title>
        <meta
          name="description"
          content="Encontre as melhores ofertas de viagens. Compare aluguel de veículos, pacotes nacionais, internacionais e equipamentos essenciais para sua aventura."
        />
        <link rel="canonical" href={canonicalUrl('/')} />
      </Helmet>

      {/* Hero — banner fixo de fundo (1200×400) */}
      <section className="relative isolate overflow-hidden bg-[#0F2A12]">
        <img
          src={HERO_BANNER_SRC}
          alt=""
          aria-hidden="true"
          {...({ fetchpriority: "high" } as Record<string, string>)}
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
              Encontre as melhores ofertas para a sua próxima viagem
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
              Seu guia definitivo para comparar veículos, descobrir pacotes e
              encontrar equipamentos junto aos nossos parceiros.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/blog">Explorar Destinos</ButtonLink>
              <ButtonLink to="/pacotes-de-viagem" variant="secondary">
                Encontrar Pacotes
              </ButtonLink>
              <ButtonLink
                to="/aluguel-de-veiculos"
                className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
              >
                Comparar Veículos
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="space-y-10 py-10 sm:space-y-14 sm:py-16">
        {/* Posts em destaque primeiro, ofertas de produtos logo abaixo. */}
        <section>
          <h2 className="mb-5 text-xl font-bold text-slate-900 sm:mb-8 sm:text-2xl">
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
            <PostList posts={featuredPosts.data.items} layout="carousel" />
          ) : (
            <EmptyState title="Nenhum post em destaque ainda" />
          )}
        </section>

        {/* Resumo de cada nicho em carrossel horizontal. */}
        <ProductCarousel niche="veiculos" limit={6} />
        <ProductCarousel niche="viagens" limit={6} />
        <ProductCarousel niche="equipamentos" limit={6} />

        <section>
          <h2 className="mb-5 text-xl font-bold text-slate-900 sm:mb-8 sm:text-2xl">
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
            <PostList posts={treeFilteredPosts.data.items} layout="carousel" />
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
        <Container className="py-12 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <img
              src="/assets/logo.webp"
              alt="Meu Destino"
              loading="lazy"
              decoding="async"
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