import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  useBlogCategories,
  useBlogCategory,
  usePostsForCategoryTree,
} from '../hooks/usePosts';
import { getCategoryTreeIds } from '../lib/categoryTree';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { PostList } from '../components/blog/PostList';
import { BlogFiltersSidebar } from '../components/blog/BlogFiltersSidebar';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { canonicalUrl } from '../lib/seo';
import { useLocations } from '../hooks/useLocations';

const PAGE_SIZE = 9;

export function BlogListPage() {
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useBlogCategories();
  const locations = useLocations();

  const activeSlug = searchParams.get('category') ?? slugParam ?? null;
  const activeLocation = searchParams.get('location_slug');
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const activeCategory = categories.data?.find((cat) => cat.slug === activeSlug);
  const activeId = activeCategory?.id ?? null;
  const isSlugValid =
    !activeSlug || activeCategory !== undefined || categories.isLoading;
  const categoryIds = useMemo(
    () => getCategoryTreeIds(categories.data ?? [], activeId),
    [activeId, categories.data],
  );

  const categoryDetail = useBlogCategory(slugParam ?? '');

  const posts = usePostsForCategoryTree(
    {
      page,
      limit: PAGE_SIZE,
      location_slug: activeLocation ?? undefined,
    },
    categoryIds,
  );
  const meta = posts.data?.meta;

  function updateFilters(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!Object.prototype.hasOwnProperty.call(changes, 'page')) {
      next.delete('page');
    }

    if (slugParam && Object.prototype.hasOwnProperty.call(changes, 'category')) {
      navigate(`/blog${next.size ? `?${next.toString()}` : ''}`, {
        replace: true,
        preventScrollReset: true,
      });
      return;
    }

    setSearchParams(
      (current) => {
        const updated = new URLSearchParams(current);
        for (const [key, value] of Object.entries(changes)) {
          if (value) updated.set(key, value);
          else updated.delete(key);
        }
        if (!Object.prototype.hasOwnProperty.call(changes, 'page')) {
          updated.delete('page');
        }
        return updated;
      },
      { replace: true, preventScrollReset: true },
    );
  }

  function currentName() {
    if (activeCategory) return activeCategory.nome;
    if (categoryDetail.data) return categoryDetail.data.nome;
    return activeSlug;
  }

  const name = currentName();
  const canonicalPath = activeCategory ? `/blog/categoria/${activeCategory.slug}` : '/blog';
  const activeLocationName =
    locations.data?.find((location) => location.slug === activeLocation)?.nome ??
    activeLocation;

  return (
    <>
      <Helmet>
        <title>{name ? `${name} | Blog de Viagens` : 'Blog | Blog de Viagens'}</title>
        <meta name="description" content="Todos os posts do blog: roteiros, destinos e dicas." />
        <link rel="canonical" href={canonicalUrl(canonicalPath)} />
      </Helmet>
      <Container className="py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {name ? `Tipo: ${name}` : 'Blog'}
          </h1>
          <Link
            to="/blog/categorias"
            className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
          >
            Todas as categorias
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <BlogFiltersSidebar
            categories={categories.data ?? []}
            locations={locations.data ?? []}
            selectedCategory={activeSlug}
            selectedLocation={activeLocation}
            categoriesLoading={categories.isLoading}
            locationsLoading={locations.isLoading}
            categoriesError={categories.isError}
            locationsError={locations.isError}
            onSelectCategory={(slug) => updateFilters({ category: slug })}
            onSelectLocation={(slug) => updateFilters({ location_slug: slug })}
            onRetryCategories={() => categories.refetch()}
            onRetryLocations={() => locations.refetch()}
          />
          <section aria-label="Posts do blog">
            {activeSlug || activeLocation ? (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-sm font-medium text-slate-600">
                  Filtros ativos:
                </span>
                {activeSlug ? (
                  <button
                    type="button"
                    onClick={() => updateFilters({ category: null })}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-900"
                  >
                    {name ?? activeSlug} <span aria-hidden="true">×</span>
                  </button>
                ) : null}
                {activeLocation ? (
                  <button
                    type="button"
                    onClick={() => updateFilters({ location_slug: null })}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900"
                  >
                    {activeLocationName} <span aria-hidden="true">×</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() =>
                    updateFilters({ category: null, location_slug: null })
                  }
                  className="ml-1 text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : null}
            {!isSlugValid ? (
              <EmptyState
                title="Categoria não encontrada"
                description="Verifique o endereço ou escolha outro tipo."
              />
            ) : isSlugValid && posts.isLoading ? (
              <PageLoader />
            ) : isSlugValid && posts.isError ? (
              <ErrorState
                message="Não foi possível carregar os posts."
                onRetry={() => posts.refetch()}
              />
            ) : isSlugValid && posts.data && posts.data.items.length > 0 ? (
              <>
                <PostList posts={posts.data.items} />
                {meta ? (
                  <Pagination
                    className="mt-10"
                    page={meta.page}
                    totalPages={meta.totalPages}
                    onChange={(nextPage) =>
                      updateFilters({ page: String(nextPage) })
                    }
                  />
                ) : null}
              </>
            ) : isSlugValid ? (
              <EmptyState
                title="Nenhum post encontrado"
                description="Tente outro tipo ou destino."
              />
            ) : null}
          </section>
        </div>
      </Container>
    </>
  );
}
