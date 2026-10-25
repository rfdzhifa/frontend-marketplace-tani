import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useAuth } from '../../auth';
import { ImageWithFallback } from '../../../components/atoms/ImageWithFallback';
import { Skeleton } from '../../../components/atoms/Skeleton';
import { Alert } from '../../../components/atoms/Alert';
import { Button } from '../../../components/atoms/Button';
import { ProductDetailInfo } from '../components/ProductDetailInfo';
import { ROUTES } from '../../../constants/routes';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { data, isLoading, isError, error, refetch } = useProduct(id);

  const product = data?.data;
  const is404 = error?.response?.status === 404;

  const handleAddToCart = ({ productId, quantity }) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${productId}`);
      return;
    }

    // Temporary: Cart module not yet implemented
    // TODO: Connect to actual cart functionality when Cart module is ready
    console.log('Add to cart:', { productId, quantity });
  };

  const handleBackToCatalog = () => {
    navigate(ROUTES.HOME);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Skeleton aspectRatio={1} className="rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  // Error State: 404
  if (is404) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Alert
          variant="error"
          title="Produk tidak ditemukan"
          className="text-left"
        >
          Produk yang Anda cari tidak tersedia atau sudah tidak dijual.
        </Alert>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={handleBackToCatalog}
            className="inline-flex"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Kembali ke katalog
          </Button>
        </div>
      </div>
    );
  }

  // Error State: Other errors
  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Alert
          variant="error"
          title="Gagal memuat detail produk"
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Coba lagi
            </Button>
          }
        >
          {error?.message || 'Terjadi kesalahan saat memuat produk.'}
        </Alert>
      </div>
    );
  }

  // Success: Product Loaded
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
      {/* Back Button */}
      <button
        onClick={handleBackToCatalog}
        className="mb-6 inline-flex items-center gap-2 text-body-sm font-medium text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:rounded-sm"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke katalog
      </button>

      {/* Product Detail Grid */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div>
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            aspectRatio={1}
            className="rounded-lg"
          />
        </div>

        {/* Product Info */}
        <ProductDetailInfo
          product={product}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
