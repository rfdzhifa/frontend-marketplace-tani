import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Boxes, X } from "lucide-react";
import { Button } from "../../../components/atoms/Button";
import { Input } from "../../../components/atoms/Input";
import { Label } from "../../../components/atoms/Label";

function StockUpdateForm({ product, onSave, onClose, isPending }) {
  const [stockValue, setStockValue] = useState(String(product.stock ?? 0));
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(stockValue, 10);

    if (isNaN(parsed) || parsed < 0) {
      setError("Stok harus berupa bilangan bulat non-negatif");
      return;
    }

    onSave(parsed);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="quick-stock-input">
          Jumlah Stok Baru ({product.unit})
        </Label>
        <Input
          id="quick-stock-input"
          type="number"
          min="0"
          step="1"
          disabled={isPending}
          value={stockValue}
          onChange={(e) => {
            setStockValue(e.target.value);
            if (error) setError("");
          }}
          hasError={Boolean(error)}
          placeholder="0"
          autoFocus
        />
        {error ? (
          <p className="text-caption text-danger-600 font-medium">{error}</p>
        ) : (
          <p className="text-caption text-ink-muted">
            Stok 0 akan otomatis menandai produk sebagai "Stok habis".
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={onClose}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isPending}>
          Simpan Stok
        </Button>
      </div>
    </form>
  );
}

export function StockUpdateDialog({
  isOpen,
  onClose,
  product,
  onSave,
  isPending = false,
}) {
  if (!product) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-xs transition-opacity duration-150" />
        <Dialog.Content className="border-border bg-surface shadow-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border p-6 duration-150 focus:outline-none">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary-100 text-primary-700 flex h-9 w-9 items-center justify-center rounded-sm">
                <Boxes className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <Dialog.Title className="text-h4 text-ink font-semibold">
                  Perbarui Stok
                </Dialog.Title>
                <Dialog.Description className="text-caption text-ink-muted max-w-[200px] truncate">
                  {product.name}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isPending}
                className="text-ink-muted hover:text-ink focus-visible:ring-primary-600 rounded-sm p-1 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                aria-label="Tutup dialog"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <StockUpdateForm
            key={`${product.id}-${isOpen}`}
            product={product}
            onSave={onSave}
            onClose={onClose}
            isPending={isPending}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
