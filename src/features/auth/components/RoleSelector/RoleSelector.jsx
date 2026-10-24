import { ShoppingBag, Sprout } from "lucide-react";
import { ROLES } from "../../../../constants/roles";
import { cn } from "../../../../utils/cn";

const ROLE_OPTIONS = [
  {
    value: ROLES.BUYER,
    title: "Pembeli",
    description: "Belanja hasil panen segar langsung dari petani lokal",
    icon: ShoppingBag,
  },
  {
    value: ROLES.SELLER,
    title: "Petani / Penjual",
    description: "Jual produk pertanian dan kelola pesanan pembeli",
    icon: Sprout,
  },
];

export function RoleSelector({ value, onChange, error, disabled = false }) {
  return (
    <div className="space-y-1.5">
      <span className="text-body-sm text-ink-soft block font-medium">
        Daftar sebagai <span className="text-danger-600">*</span>
      </span>

      <div
        role="radiogroup"
        aria-label="Pilih peran akun"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {ROLE_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex cursor-pointer flex-col items-start rounded-md border p-4 text-left transition-colors duration-150 ease-out motion-reduce:transition-none",
                "focus-visible:ring-primary-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                isSelected
                  ? "border-primary-600 bg-primary-50"
                  : "border-border bg-surface hover:bg-canvas",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="mb-2 flex w-full items-center justify-between">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-sm",
                    isSelected
                      ? "bg-primary-600 text-surface"
                      : "bg-canvas text-ink-soft",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-primary-600 bg-primary-600"
                      : "border-border bg-surface",
                  )}
                >
                  {isSelected && (
                    <span className="bg-surface h-1.5 w-1.5 rounded-full" />
                  )}
                </span>
              </div>

              <span className="text-body-sm text-ink font-semibold">
                {option.title}
              </span>
              <span className="text-caption text-ink-soft mt-0.5">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-caption text-danger-600 font-medium">{error}</p>
      )}
    </div>
  );
}
