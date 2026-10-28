import { LayoutGrid, Table } from "lucide-react";
import { cn } from "../../../utils/cn";

export function ProductViewToggle({ view = "grid", onViewChange }) {
  return (
    <div
      role="group"
      aria-label="Tampilan produk"
      className="bg-canvas border-border inline-flex rounded-sm border p-1"
    >
      <button
        type="button"
        onClick={() => onViewChange("grid")}
        aria-label="Tampilan grid"
        aria-pressed={view === "grid"}
        className={cn(
          "focus-visible:ring-primary-600 rounded-sm p-1.5 transition-all focus-visible:ring-2 focus-visible:outline-none",
          view === "grid"
            ? "bg-surface text-primary-700 border-border/80 border shadow-xs"
            : "text-ink-muted hover:text-ink hover:bg-surface/50",
        )}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => onViewChange("table")}
        aria-label="Tampilan tabel"
        aria-pressed={view === "table"}
        className={cn(
          "focus-visible:ring-primary-600 rounded-sm p-1.5 transition-all focus-visible:ring-2 focus-visible:outline-none",
          view === "table"
            ? "bg-surface text-primary-700 border-border/80 border shadow-xs"
            : "text-ink-muted hover:text-ink hover:bg-surface/50",
        )}
      >
        <Table className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
