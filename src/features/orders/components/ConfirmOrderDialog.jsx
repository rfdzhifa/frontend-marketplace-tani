import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "../../../components/atoms/Button";

export function ConfirmOrderDialog({
  isOpen,
  onClose,
  orderNumber,
  onConfirm,
  isPending = false,
}) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink/40 fixed inset-0 z-50 backdrop-blur-xs transition-opacity duration-150" />
        <Dialog.Content className="border-border bg-surface shadow-overlay fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 focus:outline-none">
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-h4 text-ink font-semibold">
                Konfirmasi Pesanan Diterima
              </Dialog.Title>
              <Dialog.Description className="text-body-sm text-ink-soft mt-2">
                Pastikan Anda telah menerima produk untuk pesanan{" "}
                <span className="text-ink font-semibold tabular">{orderNumber}</span>{" "}
                dalam kondisi baik. Status pesanan akan berubah menjadi{" "}
                <span className="text-ink font-semibold">Selesai</span>.
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isPending}
                className="text-ink-muted hover:text-ink focus-visible:ring-primary-600 rounded-sm p-1 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 cursor-pointer"
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
              variant="primary"
              size="sm"
              isLoading={isPending}
              onClick={onConfirm}
            >
              Ya, Pesanan Diterima
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
