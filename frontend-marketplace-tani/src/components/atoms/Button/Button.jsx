import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { Spinner } from "../Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700",
        secondary: "border border-border bg-surface text-ink hover:bg-canvas",
        charcoal: "rounded-full bg-ink text-white hover:bg-ink-soft",
        ghost: "bg-transparent text-ink-soft hover:bg-canvas hover:text-ink",
        danger: "bg-danger-600 text-white hover:opacity-90",
      },
      size: {
        sm: "h-9 rounded-sm px-3 text-body-sm",
        md: "h-11 rounded-sm px-4 text-body-sm",
        lg: "h-[52px] rounded-sm px-6 text-body",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export const Button = forwardRef(function Button(
  {
    className,
    variant = "primary",
    size,
    isLoading = false,
    disabled = false,
    type = "button",
    children,
    style,
    ...props
  },
  ref,
) {
  const isWhiteTextVariant =
    variant === "primary" || variant === "charcoal" || variant === "danger";

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size }), className)}
      style={isWhiteTextVariant ? { color: "#ffffff", ...style } : style}
      {...props}
    >
      {isLoading && <Spinner className="shrink-0" />}
      {children}
    </button>
  );
});
