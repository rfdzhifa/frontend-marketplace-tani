import { cn } from "../../../utils/cn";

export function Label({
  className,
  htmlFor,
  isRequired = false,
  children,
  ...props
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-body-sm text-ink-soft block font-medium", className)}
      {...props}
    >
      {children}
      {isRequired && (
        <span className="text-danger-600 ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
