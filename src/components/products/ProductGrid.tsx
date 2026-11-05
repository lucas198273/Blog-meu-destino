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
          : 'min-w-0'
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

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        className,
      )}
    >
      {items}
    </div>
  );
}
