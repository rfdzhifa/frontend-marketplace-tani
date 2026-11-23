import { useState } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { Input } from "../../../components/atoms/Input";
import { cn } from "../../../utils/cn";
import { MARKETPLACE_CATEGORIES } from "../constants/categories";

function FilterAccordion({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border py-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left text-body-sm font-semibold text-ink hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-ink-muted transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

function PriceRangeForm({ minPrice, maxPrice, onApplyPriceRange }) {
  const [minInput, setMinInput] = useState(minPrice || "");
  const [maxInput, setMaxInput] = useState(maxPrice || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyPriceRange?.({
      minPrice: minInput.trim(),
      maxPrice: maxInput.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="filter-min-price"
            className="mb-1 block text-caption font-medium text-ink-muted"
          >
            Min (Rp)
          </label>
          <Input
            id="filter-min-price"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="0"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="h-9 rounded-xl px-2.5 text-body-sm tabular"
          />
        </div>
        <div>
          <label
            htmlFor="filter-max-price"
            className="mb-1 block text-caption font-medium text-ink-muted"
          >
            Maks (Rp)
          </label>
          <Input
            id="filter-max-price"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="500000"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="h-9 rounded-xl px-2.5 text-body-sm tabular"
          />
        </div>
      </div>
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        className="w-full"
      >
        Terapkan Harga
      </Button>
    </form>
  );
}

export function ProductFilterSidebar({
  selectedCategory = "",
  minPrice = "",
  maxPrice = "",
  inStockOnly = false,
  onSelectCategory,
  onApplyPriceRange,
  onToggleInStock,
  onResetFilters,
  className,
}) {
  const hasActiveFilter = Boolean(
    selectedCategory || minPrice || maxPrice || inStockOnly,
  );

  return (
    <aside
      aria-label="Filter katalog produk"
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary-600" aria-hidden="true" />
          <h3 className="text-body font-semibold text-ink">Filter Produk</h3>
        </div>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-caption font-semibold text-primary-600 hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Atur Ulang
          </button>
        )}
      </div>

      {/* Category Filter */}
      <FilterAccordion title="Kategori">
        <ul className="space-y-1">
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onSelectCategory?.(cat.value)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-body-sm transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary-50 font-semibold text-primary-700"
                      : "text-ink-soft hover:bg-canvas hover:text-ink",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
                  )}
                >
                  <span>{cat.label}</span>
                  {isSelected && (
                    <span
                      className="h-2 w-2 rounded-full bg-primary-600"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterAccordion>

      {/* Price Range Filter */}
      <FilterAccordion title="Rentang Harga">
        <PriceRangeForm
          key={`${minPrice}-${maxPrice}`}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onApplyPriceRange={onApplyPriceRange}
        />
      </FilterAccordion>

      {/* Stock Availability Filter */}
      <FilterAccordion title="Ketersediaan Stok">
        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl px-1 py-1 text-body-sm text-ink hover:text-primary-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock?.(e.target.checked)}
            className="h-4 w-4 rounded-sm border-border text-primary-600 focus:ring-primary-600 cursor-pointer accent-primary-600"
          />
          <span>Hanya Stok Tersedia</span>
        </label>
      </FilterAccordion>
    </aside>
  );
}

