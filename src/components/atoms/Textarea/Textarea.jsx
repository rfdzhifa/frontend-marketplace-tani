import { forwardRef } from "react";
import { cn } from "../../../utils/cn";

export const Textarea = forwardRef(function Textarea(
  { className, hasError = false, readOnly = false, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      readOnly={readOnly}
      aria-invalid={hasError ? "true" : "false"}
      className={cn(
        "bg-surface text-body text-ink placeholder:text-ink-muted w-full rounded-sm border px-3.5 py-2.5 transition-colors duration-150 ease-out motion-reduce:transition-none",
        "focus-visible:border-primary-600 focus-visible:ring-primary-100 focus-visible:ring-2 focus-visible:outline-none",
        hasError
          ? "border-danger-600 focus-visible:border-danger-600 focus-visible:ring-danger-50"
          : "border-border",
        (readOnly || props.disabled) &&
          "bg-canvas text-ink-soft focus-visible:border-border cursor-not-allowed focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
});
