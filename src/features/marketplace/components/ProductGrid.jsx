import { Sprout } from 'lucide-react';
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
          <div
            key={i}
            className="space-y-3 rounded-2xl border border-border bg-surface p-3"
          >
            <Skeleton aspectRatio={1} className="rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-canvas/60 px-6 py-12 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <Sprout className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="text-h4 font-semibold text-ink">
          Belum Ada Produk yang Ditampilkan
        </h3>
        <p className="mt-1.5 max-w-md text-body-sm text-ink-soft">
          {emptyMessage}
        </p>
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
