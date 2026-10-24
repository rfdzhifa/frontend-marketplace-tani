import { forwardRef } from "react";
import { Input } from "../../atoms/Input";
import { Label } from "../../atoms/Label";
import { cn } from "../../../utils/cn";

export const FormField = forwardRef(function FormField(
  {
    id,
    label,
    isRequired = false,
    error,
    helperText,
    className,
    inputClassName,
    children,
    ...inputProps
  },
  ref,
) {
  const errorId = id && error ? `${id}-error` : undefined;
  const helperId = id && helperText ? `${id}-helper` : undefined;
  const describedBy =
    [errorId, helperId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} isRequired={isRequired}>
          {label}
        </Label>
      )}

      {children ? (
        children
      ) : (
        <Input
          ref={ref}
          id={id}
          hasError={Boolean(error)}
          aria-describedby={describedBy}
          className={inputClassName}
          {...inputProps}
        />
      )}

      {error ? (
        <p id={errorId} className="text-caption text-danger-600 font-medium">
          {error}
        </p>
      ) : (
        helperText && (
          <p id={helperId} className="text-caption text-ink-muted">
            {helperText}
          </p>
        )
      )}
    </div>
  );
});
