import type { Product } from '../../types/product';
import { cn } from '../../lib/cn';
import { ProductCard } from './ProductCard';
import { HorizontalCarousel } from '../common/HorizontalCarousel';

export function ProductGrid({
  products,
  className,
  layout = 'grid',
}: {
  products: Product[];
  className?: string;
  layout?: 'grid' | 'carousel';
}) {
  const items = products.map((product) => (
    <div
      key={product.id}
      className={
        layout === 'carousel'
          ? 'w-[calc((100%_-_1rem)/2)] max-w-[220px] shrink-0 snap-start'
          : 'min-w-0 w-full'
      }
    >
      <ProductCard product={product} />
    </div>
  ));

  if (layout === 'carousel') {
    return (
      <HorizontalCarousel ariaLabel="Ofertas de produtos" className={className}>
        {items}
      </HorizontalCarousel>
    );
  }

  // Cards largos e padronizados: 1 coluna no mobile (100% da largura),
  // 2 no tablet/desktop e no MÁXIMO 3 em telas muito largas — nunca 4 ou 5.
  // Gap generoso para respiro entre cards.
  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3 xl:gap-8',
        className,
      )}
    >
      {items}
    </div>
  );
}
