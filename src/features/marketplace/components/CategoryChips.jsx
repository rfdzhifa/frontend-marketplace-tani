import { Apple, Carrot, Leaf, Sparkles, Sprout, Wheat } from "lucide-react";
import { cn } from "../../../utils/cn";
import { MARKETPLACE_CATEGORIES } from "../constants/categories";

const CATEGORY_STYLES = {
  all: {
    icon: Sparkles,
    active: "border-primary-600 bg-primary-600 text-white shadow-card",
    iconActive: "bg-harvest-lime text-white",
    iconIdle: "bg-primary-100 text-primary-700",
  },
  sayuran: {
    icon: Leaf,
    active: "border-harvest-lime bg-harvest-lime text-white shadow-card",
    iconActive: "bg-white/25 text-white",
    iconIdle: "bg-harvest-lime-soft text-harvest-lime",
  },
  buah: {
    icon: Apple,
    active: "border-harvest-amber bg-harvest-amber text-ink shadow-card",
    iconActive: "bg-white/40 text-ink",
    iconIdle: "bg-harvest-amber-soft text-harvest-amber-ink",
  },
  umbi: {
    icon: Carrot,
    active: "border-harvest-coral bg-harvest-coral text-white shadow-card",
    iconActive: "bg-white/25 text-white",
    iconIdle: "bg-harvest-coral-soft text-harvest-coral",
  },
  beras: {
    icon: Wheat,
    active: "border-warning-600 bg-warning-600 text-white shadow-card",
    iconActive: "bg-white/25 text-white",
    iconIdle: "bg-warning-50 text-warning-600",
  },
  bumbu: {
    icon: Sprout,
    active: "border-primary-700 bg-primary-700 text-white shadow-card",
    iconActive: "bg-harvest-amber text-ink",
    iconIdle: "bg-primary-50 text-primary-600",
  },
};

export function CategoryChips({
  selectedCategory = "",
  onSelectCategory,
  className,
}) {
  return (
    <div
      role="group"
      aria-label="Filter kategori produk"
      className={cn(
        "flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar",
        className,
      )}
    >
      {MARKETPLACE_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.value;
        const theme = CATEGORY_STYLES[cat.id] || CATEGORY_STYLES.all;
        const Icon = theme.icon;
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelectCategory?.(cat.value)}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2 text-body-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap",
              isSelected
                ? theme.active
                : "border border-border bg-surface text-ink hover:border-primary-600/40 hover:bg-canvas",
              "focus-visible:ring-primary-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                isSelected ? theme.iconActive : theme.iconIdle,
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
