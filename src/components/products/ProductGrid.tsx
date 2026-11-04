import type { Product } from '../../types/product';
import { cn } from '../../lib/cn';
import { ProductCard } from './ProductCard';

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4',
        className,
      )}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="w-[280px] min-w-[280px] shrink-0 snap-start md:w-auto md:min-w-0"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
