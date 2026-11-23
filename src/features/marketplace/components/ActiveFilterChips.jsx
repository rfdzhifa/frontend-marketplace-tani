import { X } from "lucide-react";
import { MARKETPLACE_CATEGORIES } from "../constants/categories";
import { formatRupiah } from "../utils/formatPrice";
import { cn } from "../../../utils/cn";

export function ActiveFilterChips({
  searchQuery = "",
  selectedCategory = "",
  minPrice = "",
  maxPrice = "",
  inStockOnly = false,
  onRemoveSearch,
  onRemoveCategory,
  onRemovePriceRange,
  onRemoveInStock,
  onClearAll,
  className,
}) {
  const activeCategory = MARKETPLACE_CATEGORIES.find(
    (c) => c.value === selectedCategory && c.value !== "",
  );

  const hasPriceFilter = Boolean(minPrice || maxPrice);
  const hasAnyFilter = Boolean(
    searchQuery || activeCategory || hasPriceFilter || inStockOnly,
  );

  if (!hasAnyFilter) {
    return null;
  }

  const formatPriceRangeLabel = () => {
    const formattedMin = minPrice ? formatRupiah(Number(minPrice)) : "Rp 0";
    const formattedMax = maxPrice ? formatRupiah(Number(maxPrice)) : "Tak terbatas";
    return `${formattedMin} – ${formattedMax}`;
  };

  const chipClass =
    "inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-caption font-semibold text-primary-800";
  const removeBtnClass =
    "rounded-full p-0.5 text-primary-700 hover:bg-primary-100 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 cursor-pointer";

  return (
    <div
      aria-label="Filter aktif"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <span className="text-caption font-medium text-ink-muted">
        Filter aktif:
      </span>

      {searchQuery && (
        <span className={chipClass}>
          <span>Cari: &ldquo;{searchQuery}&rdquo;</span>
          <button
            type="button"
            onClick={onRemoveSearch}
            aria-label={`Hapus filter pencarian ${searchQuery}`}
            className={removeBtnClass}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      )}

      {activeCategory && (
        <span className={chipClass}>
          <span>Kategori: {activeCategory.label}</span>
          <button
            type="button"
            onClick={onRemoveCategory}
            aria-label={`Hapus filter kategori ${activeCategory.label}`}
            className={removeBtnClass}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      )}

      {hasPriceFilter && (
        <span className={chipClass}>
          <span className="tabular">Harga: {formatPriceRangeLabel()}</span>
          <button
            type="button"
            onClick={onRemovePriceRange}
            aria-label="Hapus filter rentang harga"
            className={removeBtnClass}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      )}

      {inStockOnly && (
        <span className={chipClass}>
          <span>Stok Tersedia</span>
          <button
            type="button"
            onClick={onRemoveInStock}
            aria-label="Hapus filter stok tersedia"
            className={removeBtnClass}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 text-caption font-semibold text-ink-soft hover:text-danger-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm cursor-pointer"
      >
        Hapus Semua Filter
      </button>
    </div>
  );
}

