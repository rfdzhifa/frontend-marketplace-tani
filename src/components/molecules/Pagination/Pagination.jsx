import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../atoms/Button";
import { cn } from "../../../utils/cn";

export function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Navigasi halaman"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={!canGoPrevious}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Sebelumnya
      </Button>

      <span className="text-body-sm text-ink-soft px-2">
        Halaman <span className="text-ink font-semibold">{page}</span> dari{" "}
        {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={!canGoNext}
        aria-label="Halaman berikutnya"
      >
        Berikutnya
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
