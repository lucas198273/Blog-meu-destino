import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../components/common/ErrorState';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { useBlogCategories, usePosts } from '../hooks/usePosts';
import { trackEvent } from '../lib/analytics';
import type { BlogCategory } from '../types/blog';

function BlogCategoryCard({ category }: { category: BlogCategory }) {
  const posts = usePosts({ category: category.id, page: 1, limit: 1 });
  const count = category.post_count ?? category.posts_count ?? posts.data?.meta.total;

  return (
    <Link
      to={`/blog/categoria/${category.slug}`}
      onClick={() => trackEvent('click_blog_category')}
      className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-100 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-[var(--color-primary)]">
            {category.nome}
          </h2>
          {category.descricao ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
              {category.descricao}
            </p>
          ) : null}
        </div>
        <ArrowRight
          className="mt-1 h-5 w-5 shrink-0 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">
        {count === undefined
          ? 'Contagem indisponível'
          : `${count} ${count === 1 ? 'post' : 'posts'}`}
      </p>
    </Link>
  );
}

export function BlogCategoriesPage() {
  const categories = useBlogCategories();

  return (
    <>
      <Helmet>
        <title>Categorias do blog | Meu Destino</title>
        <meta
          name="description"
          content="Explore os artigos do Meu Destino por categoria."
        />
      </Helmet>
      <Container className="py-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">
          Explore nossos conteúdos
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Categorias do blog
        </h1>

        {categories.isLoading ? (
          <div className="mt-8">
            <PageLoader />
          </div>
        ) : categories.isError ? (
          <div className="mt-8">
            <ErrorState
              message="Não foi possível carregar as categorias do blog."
              onRetry={() => categories.refetch()}
            />
          </div>
        ) : categories.data?.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.data.map((category) => (
              <BlogCategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-500">Nenhuma categoria disponível.</p>
        )}
      </Container>
    </>
  );
}
