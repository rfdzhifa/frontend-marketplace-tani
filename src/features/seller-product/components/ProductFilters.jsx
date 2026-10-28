import { cn } from "../../../utils/cn";

const FILTER_TABS = [
  { id: "all", label: "Semua" },
  { id: "available", label: "Tersedia" },
  { id: "out_of_stock", label: "Stok habis" },
];

export function ProductFilters({ currentStatus = "all", onStatusChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter status produk"
      className="bg-canvas border-border inline-flex rounded-sm border p-1"
    >
      {FILTER_TABS.map((tab) => {
        const isActive = currentStatus === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onStatusChange(tab.id)}
            className={cn(
              "text-caption focus-visible:ring-primary-600 rounded-sm px-3.5 py-1.5 font-semibold transition-all focus-visible:ring-2 focus-visible:outline-none",
              isActive
                ? "bg-surface text-primary-800 border-border/80 border shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-surface/50",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
