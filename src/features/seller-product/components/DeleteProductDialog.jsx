import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../../../components/atoms/Button";

export function DeleteProductDialog({
  isOpen,
  onClose,
  product,
  onConfirm,
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
        <Dialog.Content className="border-border bg-surface shadow-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border p-6 duration-150 focus:outline-none">
          <div className="flex items-start gap-4">
            <div className="bg-danger-50 text-danger-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-h4 text-ink font-semibold">
                Hapus Produk
              </Dialog.Title>
              <Dialog.Description className="text-body-sm text-ink-soft mt-2">
                Apakah Anda yakin ingin menghapus{" "}
                <span className="text-ink font-semibold">{product.name}</span>?
                Produk ini tidak akan lagi tampil di etalase Anda maupun katalog
                publik pembeli.
              </Dialog.Description>
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

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isPending}
              onClick={onConfirm}
            >
              Hapus Produk
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
