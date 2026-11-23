import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronDown,
  ExternalLink,
  Leaf,
  MapPin,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "../../../components/atoms/Badge";
import { Button } from "../../../components/atoms/Button";
import { RatingStars } from "../../../components/molecules/RatingStars";
import { PriceTag } from "../../../components/molecules/PriceTag";
import { QuantityStepper } from "../../../components/molecules/QuantityStepper";
import { ROLES } from "../../../constants/roles";
import { getFarmerProfilePath } from "../../../constants/routes";
import { cn } from "../../../utils/cn";

function getSellerInitials(name = "Petani Lokal") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function FreshnessAccordionItem({ title, icon: Icon, isOpen, onToggle, children }) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-body-sm font-semibold text-ink transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
          <span>{title}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="border-t border-border bg-canvas/50 px-4 py-3.5 text-body-sm leading-relaxed text-ink-soft">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductDetailInfo({
  product,
  isAuthenticated = false,
  userRole = null,
  onAddToCart,
  isAddingToCart = false,
}) {
  const [quantity, setQuantity] = useState(1);
  const [openGuide, setOpenGuide] = useState("storage");

  const isOutOfStock = !product.isAvailable;
  const isSeller = userRole === ROLES.SELLER;
  const sellerName = product.seller?.name || "Petani Lokal";
  const sellerLocation =
    product.seller?.location || product.seller?.city || "Mitra Kebun Lokal";

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ productId: product.id, quantity });
    }
  };

  const getButtonState = () => {
    if (isOutOfStock) {
      return {
        disabled: true,
        label: "Stok habis",
        helpText: null,
      };
    }

    if (!isAuthenticated) {
      return {
        disabled: false,
        label: "Tambah ke keranjang",
        helpText: "Anda akan diarahkan ke halaman login",
      };
    }

    if (isSeller) {
      return {
        disabled: true,
        label: "Tidak tersedia",
        helpText: "Hanya akun pembeli yang dapat membeli produk",
      };
    }

    return {
      disabled: false,
      label: "Tambah ke keranjang",
      helpText: null,
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="space-y-6">
      {/* Title and Stock Status */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-h3 font-semibold text-ink lg:text-h2">
            {product.name}
          </h1>
          {isOutOfStock && <Badge tone="danger">Stok habis</Badge>}
        </div>

        {/* Rating */}
        <div className="mt-2.5">
          {product.reviewCount > 0 ? (
            <RatingStars value={product.avgRating} count={product.reviewCount} />
          ) : (
            <p className="text-body-sm text-ink-muted">Belum ada rating</p>
          )}
        </div>
      </div>

      {/* Price */}
      <PriceTag price={product.price} unit={product.unit} size="lg" />

      {/* Farm Origin Trust Card */}
      <div className="rounded-2xl border border-primary-100 bg-primary-50/70 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-body font-semibold text-white"
              aria-hidden="true"
            >
              {getSellerInitials(sellerName)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-body font-semibold text-ink">{sellerName}</p>
                <Badge tone="success" withDot>
                  Petani Lokal Terverifikasi
                </Badge>
              </div>
              <p className="flex items-center gap-1 text-caption text-ink-soft">
                <MapPin
                  className="h-3.5 w-3.5 shrink-0 text-primary-600"
                  aria-hidden="true"
                />
                <span>{sellerLocation}</span>
              </p>
            </div>
          </div>

          {product.seller?.id && (
            <Link
              to={getFarmerProfilePath(product.seller.id)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary-600/20 bg-surface px-4 py-2 text-caption font-semibold text-primary-700 transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none shrink-0"
            >
              <span>Kunjungi Kebun Ini</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {/* Stock Info */}
      <div className="rounded-2xl border border-border bg-canvas p-4">
        <p className="text-body-sm text-ink-soft">
          Stok tersedia:{" "}
          <span className="font-semibold text-ink tabular">
            {product.stock} {product.unit}
          </span>
        </p>
      </div>

      {/* Quantity Stepper and Add to Cart */}
      {!isOutOfStock && (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-body-sm font-medium text-ink-soft"
            >
              Jumlah
            </label>
            <QuantityStepper
              id="quantity"
              value={quantity}
              min={1}
              max={product.stock}
              onChange={setQuantity}
              disabled={isOutOfStock}
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={buttonState.disabled || isAddingToCart}
            isLoading={isAddingToCart}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {buttonState.label}
          </Button>

          {buttonState.helpText && (
            <p className="text-caption text-ink-muted">
              {buttonState.helpText}
            </p>
          )}
        </div>
      )}

      {/* Freshness & Storage Guide Accordion */}
      <div className="space-y-2.5 pt-2">
        <FreshnessAccordionItem
          title="Tips Penyimpanan Sayur Segar"
          icon={Leaf}
          isOpen={openGuide === "storage"}
          onToggle={() =>
            setOpenGuide((prev) => (prev === "storage" ? "" : "storage"))
          }
        >
          Simpan hasil panen di wadah kedap udara atau bungkus dengan tisu dapur
          lembap di laci pendingin (suhu 2–4°C). Hindari mencuci sayuran daun
          sebelum disimpan agar kesegarannya bertahan 4–7 hari.
        </FreshnessAccordionItem>

        <FreshnessAccordionItem
          title="Garansi Kesegaran PasarTani"
          icon={ShieldCheck}
          isOpen={openGuide === "guarantee"}
          onToggle={() =>
            setOpenGuide((prev) => (prev === "guarantee" ? "" : "guarantee"))
          }
        >
          Garansi Kesegaran 24 Jam: Produk dipanen sesuai pesanan langsung dari
          kebun mitra. Apabila ditemukan produk layu atau rusak saat diterima,
          tim PasarTani siap membantu penggantian atau pengembalian dana penuh.
        </FreshnessAccordionItem>
      </div>

      {/* Description */}
      {product.description && (
        <div className="border-t border-border pt-6">
          <h2 className="mb-3 text-h4 font-semibold text-ink">Deskripsi</h2>
          <p className="whitespace-pre-line text-body text-ink-soft">
            {product.description}
          </p>
        </div>
      )}

      {/* Reviews Placeholder */}
      <div className="border-t border-border pt-6">
        <h2 className="mb-3 text-h4 font-semibold text-ink">Ulasan</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div>{/* Reviews list will be implemented in Review module */}</div>
        ) : (
          <p className="text-body-sm text-ink-muted">Belum ada ulasan.</p>
        )}
      </div>
    </div>
  );
}
