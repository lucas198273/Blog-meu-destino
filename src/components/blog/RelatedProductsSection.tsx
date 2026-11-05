import { usePostProducts } from '../../hooks/usePosts';
import { ExternalLink } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPrice } from '../../lib/format';
import { HorizontalCarousel } from '../common/HorizontalCarousel';

interface RelatedProductsSectionProps {
  postId: string;
  title?: string;
}

/**
 * Seção "Destinos relacionados" no Post Detail.
 * Busca GET /api/blog/posts/:id/products (data é array puro).
 * Loading: 3 skeleton cards. Vazio/erro: omitir silenciosamente.
 */
export function RelatedProductsSection({
  postId,
  title = 'Vai viajar para cá? Confira as ofertas:',
}: RelatedProductsSectionProps) {
  // enabled só com post.id real — nunca chamar /products antes.
  const products = usePostProducts(postId);

  // Debug temporário: confirmar que a API devolve array puro de produtos.
  console.log('Produtos do Post:', products.data);

  if (products.isLoading) {
    return (
      <section aria-labelledby="cursos-relacionados" className="mt-16">
        <h2
          id="cursos-relacionados"
          className="mb-6 text-2xl font-bold text-slate-900"
        >
          {title}
        </h2>
        <ProductGridSkeleton />
      </section>
    );
  }

  if (products.isError || !products.data || products.data.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="cursos-relacionados" className="mt-16">
      <h2
        id="cursos-relacionados"
        className="mb-6 text-2xl font-bold text-slate-900"
      >
        {title}
      </h2>
      <HorizontalCarousel ariaLabel="Ofertas relacionadas">
        {products.data.map((product) => (
          <div
            key={product.id}
            className="w-[min(85vw,300px)] shrink-0 snap-start"
          >
            <RelatedProductCard product={product} />
          </div>
        ))}
      </HorizontalCarousel>
    </section>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm">
      {cover?.url ? (
        <img
          src={cover.url}
          alt={cover.alt?.trim() || `Imagem de ${product.nome}`}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {product.nome}
        </h3>
        {product.partner ? (
          <p className="text-sm text-slate-600">{product.partner.nome}</p>
        ) : null}
        <p className="mt-auto text-sm font-semibold text-slate-900">
          {product.preco !== null ? formatPrice(product.preco) : 'Consulte'}
          {product.price_unit ? ` / ${product.price_unit}` : ''}
        </p>
        {product.affiliate_url ? (
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-[var(--color-accent)] px-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
          >
            Ver oferta
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function ProductGridSkeleton() {
  return (
    <HorizontalCarousel ariaLabel="Carregando ofertas relacionadas">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="w-[min(85vw,300px)] shrink-0 snap-start"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="aspect-square w-full animate-pulse bg-slate-100" />
            <div className="flex flex-col gap-2 p-3 md:p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </HorizontalCarousel>
  );
}
