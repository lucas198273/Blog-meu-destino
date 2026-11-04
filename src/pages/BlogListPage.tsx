import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useBlogCategories,
  useBlogCategory,
  usePostsForCategoryTree,
} from '../hooks/usePosts';
import { getCategoryTreeIds } from '../lib/categoryTree';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { PostList } from '../components/blog/PostList';
import { CategoryFilter } from '../components/blog/CategoryFilter';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { canonicalUrl } from '../lib/seo';

const PAGE_SIZE = 9;

export function BlogListPage() {
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const categories = useBlogCategories();

  const activeSlug = slugParam ?? null;
  const activeCategory = categories.data?.find((cat) => cat.slug === activeSlug);
  const activeId = activeCategory?.id ?? null;
  const isSlugValid = !slugParam || activeCategory !== undefined;
  const categoryIds = useMemo(
    () => getCategoryTreeIds(categories.data ?? [], activeId),
    [activeId, categories.data],
  );

  const categoryDetail = useBlogCategory(slugParam ?? '');

  const posts = usePostsForCategoryTree({ page, limit: PAGE_SIZE }, categoryIds);
  const meta = posts.data?.meta;

  function handleCategory(nextId: string | null) {
    setPage(1);
    const nextCategory = categories.data?.find((cat) => cat.id === nextId);
    navigate(
      nextCategory ? `/blog/categoria/${nextCategory.slug}` : '/blog',
      { replace: true, preventScrollReset: true },
    );
  }

  function currentName() {
    if (activeCategory) return activeCategory.nome;
    if (categoryDetail.data) return categoryDetail.data.nome;
    return slugParam ?? null;
  }

  const name = currentName();
  const canonicalPath = activeCategory
    ? `/blog/categoria/${activeCategory.slug}`
    : '/blog';

  return (
    <>
      <Helmet>
        <title>{name ? `${name} | Blog de Viagens` : 'Blog | Blog de Viagens'}</title>
        <meta name="description" content="Todos os posts do blog: roteiros, destinos e dicas." />
        <link rel="canonical" href={canonicalUrl(canonicalPath)} />
      </Helmet>
      <Container className="py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">
            {name ? `Categoria: ${name}` : 'Blog'}
          </h1>
          <Link
            to="/blog/categorias"
            className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
          >
            Todas as categorias
          </Link>
        </div>
        {!isSlugValid ? (
          <EmptyState
            title="Categoria não encontrada"
            description="Verifique o endereço ou escolha outra categoria abaixo."
          />
        ) : null}
        {categories.data ? (
          <div className="mb-8">
            <CategoryFilter
              categories={categories.data}
              selected={activeId}
              onSelect={handleCategory}
            />
          </div>
        ) : null}
        {isSlugValid && posts.isLoading ? (
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
                onChange={setPage}
              />
            ) : null}
          </>
        ) : isSlugValid ? (
          <EmptyState title="Nenhum post encontrado" description="Tente outra categoria." />
        ) : null}
      </Container>
    </>
  );
}
