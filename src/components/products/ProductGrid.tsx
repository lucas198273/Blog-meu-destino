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
        '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5 xl:grid-cols-6',
        className,
      )}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="w-[180px] min-w-[180px] shrink-0 snap-start md:w-auto md:min-w-0"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
