import { Skeleton } from '../../../components/atoms/Skeleton';
import { ProductCard } from './ProductCard';
import { cn } from '../../../utils/cn';

export function ProductGrid({
  products = [],
  isLoading = false,
  isEmpty = false,
  onProductClick,
  emptyMessage = 'Belum ada produk tersedia.',
  skeletonCount = 12,
  className,
}) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4',
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton aspectRatio={4 / 3} className="rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center py-12 text-center">
        <p className="text-body text-ink-soft">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4',
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
}
