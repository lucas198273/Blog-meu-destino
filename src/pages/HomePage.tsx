import { useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useBlogCategories, usePosts } from '../hooks/usePosts';
import { useProducts } from '../hooks/useProducts';
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
const PRODUCTS_LIMIT = 3;

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

  const filteredParams = useMemo(
    () => ({ limit: POSTS_LIMIT, category: activeSlug ?? undefined }),
    [activeSlug],
  );
  const featuredParams = useMemo(
    () => ({ limit: FEATURED_LIMIT, featured: true }),
    [],
  );
  const productsParams = useMemo(
    () => ({ featured: true, limit: PRODUCTS_LIMIT }),
    [],
  );

  const filteredPosts = usePosts(filteredParams);
  const featuredPosts = usePosts(featuredParams);
  const products = useProducts(productsParams);

  const handleSelect = useCallback(
    (slug: string | null) => {
      setSearchParams(slug ? { category: slug } : {});
    },
    [setSearchParams],
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
          {filteredPosts.isLoading ? (
            <PageLoader />
          ) : filteredPosts.isError ? (
            <ErrorState
              message="Não foi possível carregar os posts."
              onRetry={() => filteredPosts.refetch()}
            />
          ) : filteredPosts.data && filteredPosts.data.items.length > 0 ? (
            <PostList posts={filteredPosts.data.items} />
          ) : (
            <EmptyState
              title="Nenhum post encontrado"
              description="Tente outra categoria."
            />
          )}
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold text-[var(--color-primary)]">
            Ofertas em destaque
          </h2>
          {products.isLoading ? (
            <PageLoader />
          ) : products.isError ? (
            <ErrorState
              message="Não foi possível carregar as ofertas."
              onRetry={() => products.refetch()}
            />
          ) : products.data && products.data.items.length > 0 ? (
            <ProductGrid products={products.data.items} />
          ) : (
            <EmptyState title="Nenhuma oferta em destaque ainda" />
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