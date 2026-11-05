import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useBlogCategories, usePost } from '../hooks/usePosts';
import { formatDate } from '../lib/format';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import {
  CategorySidebarList,
  CategorySidebarListSkeleton,
} from '../components/blog/CategorySidebarList';
import { RecentPostsList } from '../components/blog/RecentPostsList';
import { RelatedProductsSection } from '../components/blog/RelatedProductsSection';
import { canonicalUrl } from '../lib/seo';
import { LocationBadge } from '../components/common/LocationBadge';

/** Estima tempo de leitura a partir do HTML do conteúdo (200 wpm). */
function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = usePost(slug);
  const categories = useBlogCategories();

  if (post.isLoading) return <PageLoader />;
  if (post.isError) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Post não encontrado"
          message="Verifique o endereço ou volte ao blog."
        />
        <Link
          to="/blog"
          className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          ← Voltar para o blog
        </Link>
      </Container>
    );
  }

  const data = post.data;
  if (!data) return null;

  // Debug temporário — confirmar UUID do post e payload completo.
  console.log('POST ID:', data.id);
  console.log('DADOS DO POST:', data);

  const cover = data.cover_image_url ?? data.og_image_url;
  const readingMinutes = estimateReadingMinutes(data.content);

  // Resolve nome da categoria pelo ID (campo é `nome`, não `name`)
  const activeCategory = data.category_id
    ? categories.data?.find((c) => c.id === data.category_id) ?? null
    : null;

  return (
    <>
      <Helmet>
        <title>{data.meta_title ?? `${data.title} | Meu Destino`}</title>
        <meta
          name="description"
          content={data.meta_description ?? data.excerpt ?? `Leia ${data.title} no guia de viagens Meu Destino.`}
        />
        <link rel="canonical" href={canonicalUrl(`/blog/${data.slug}`)} />
        {cover ? <meta property="og:image" content={cover} /> : null}
      </Helmet>

      <Container className="max-w-7xl py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          ← Voltar para o blog
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {cover ? (
              <img
                src={cover}
                alt={data.title}
                loading="lazy"
                decoding="async"
                className="aspect-video w-full rounded-xl object-cover"
              />
            ) : null}

            <h1 className="font-heading mt-3 text-3xl font-bold leading-tight tracking-tight text-[var(--color-primary)] sm:text-[34px]">
              {data.title}
            </h1>

            {data.excerpt ? (
              <p className="mt-4 max-w-3xl font-body text-[15px] leading-relaxed text-[#666666]">
                {data.excerpt}
              </p>
            ) : null}

            {/* Meta: data · tempo de leitura */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#666666]">
              {data.published_at ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon />
                  {formatDate(data.published_at)}
                </span>
              ) : null}
              {activeCategory ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  {activeCategory.nome}
                </span>
              ) : null}
              {data.location_id ? (
                <LocationBadge locationId={data.location_id} inline />
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon />
                {readingMinutes} min de leitura
              </span>
            </div>

            <article
              className="prose prose-slate mx-auto mt-8 max-w-3xl
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-[var(--color-primary)]
                prose-p:font-body prose-p:text-[var(--color-text)] prose-p:leading-relaxed
                prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[var(--color-text)]"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />

            {/* Bloco para comparar ofertas relacionadas ao destino */}
            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-start gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E7F5F6]">
                  <CarIcon />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[var(--color-text)]">
                    Vai viajar para cá? Compare preços de aluguel de carro
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">
                    Compare ofertas de locadoras e consulte as condições
                    diretamente com cada parceiro.
                  </p>
                </div>
              </div>
              <Link
                to="/veiculos"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
              >
                Comparar veículos
                <ArrowRightIcon />
              </Link>
            </div>

            <RelatedProductsSection postId={data.id} />
          </div>

          <aside className="lg:col-span-1">
            <div className="space-y-8 lg:sticky lg:top-24">
              {categories.isLoading ? (
                <CategorySidebarListSkeleton />
              ) : (
                <CategorySidebarList
                  categories={categories.data ?? []}
                  activeCategoryId={data.category_id}
                />
              )}
              <RecentPostsList currentPostId={data.id} />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Ícones                                                             */
/* ------------------------------------------------------------------ */

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="11" width="18" height="6" rx="2" />
      <path d="M6 17v2M18 17v2" strokeLinecap="round" />
      <circle cx="7.5" cy="14" r="0.5" fill="currentColor" />
      <circle cx="16.5" cy="14" r="0.5" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}