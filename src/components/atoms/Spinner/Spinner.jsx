import { Loader2 } from "lucide-react";
import { cn } from "../../../utils/cn";

export function Spinner({ className, label = "Memuat..." }) {
  return (
    <Loader2
      aria-label={label}
      role="status"
      className={cn("h-4 w-4 animate-spin", className)}
    />
  );
}
