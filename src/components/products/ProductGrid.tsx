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

  // Cards largos: 1 coluna no mobile (largura total), 2 no tablet,
  // 3 no desktop (era lg:4 / xl:5 — cards ficavam comprimidos).
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8',
        className,
      )}
    >
      {items}
    </div>
  );
}
