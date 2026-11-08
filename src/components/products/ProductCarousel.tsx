import { useProducts } from '../../hooks/useProducts';
import type { Product, ProductNiche } from '../../types/product';
import { cn } from '../../lib/cn';
import { ProductCard } from './ProductCard';
import { HorizontalCarousel } from '../common/HorizontalCarousel';

export const NICHE_LABELS: Record<ProductNiche, string> = {
  veiculos: 'Aluguel de Veículos',
  equipamentos: 'Equipamentos',
  viagens: 'Pacotes de Viagem',
};

/**
 * Carrossel horizontal (scroll snap) dos produtos de um nicho.
 * Busca os produtos do nicho na API e exibe um ao lado do outro com
 * rolagem lateral (barra de rolagem padrão oculta via CSS).
 * Vazio/erro: renderiza null — a seção simplesmente não aparece.
 */
export function ProductCarousel({
  niche,
  title,
  limit = 8,
  className,
}: {
  niche: ProductNiche;
  /** Título da seção; usa o rótulo padrão do nicho quando omitido. */
  title?: string;
  limit?: number;
  className?: string;
}) {
  const products = useProducts({ niche, page: 1, limit, sort: 'display_order' });

  if (products.isLoading) {
    return (
      <section className={cn('min-w-0', className)} aria-busy="true">
        <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
          {title ?? NICHE_LABELS[niche]}
        </h2>
        <ProductCarouselSkeleton />
      </section>
    );
  }

  if (products.isError) return null;

  const items: Product[] = products.data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className={cn('min-w-0', className)} aria-label={title ?? NICHE_LABELS[niche]}>
      <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
        {title ?? NICHE_LABELS[niche]}
      </h2>
      <HorizontalCarousel ariaLabel={title ?? NICHE_LABELS[niche]}>
        {items.map((product) => (
          <div
            key={product.id}
            className="w-[calc((100%-1.5rem)/1.5)] max-w-[260px] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] lg:max-w-none"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </HorizontalCarousel>
    </section>
  );
}

function ProductCarouselSkeleton() {
  return (
    <HorizontalCarousel ariaLabel="Carregando produtos">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-[260px] shrink-0 snap-start">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="h-48 w-full animate-pulse bg-slate-100" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </HorizontalCarousel>
  );
}
