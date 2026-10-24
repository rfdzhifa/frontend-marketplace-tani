import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const alertVariants = cva(
  "flex items-start gap-3 rounded-sm border p-3.5 text-body-sm",
  {
    variants: {
      variant: {
        error: "border-danger-600/20 bg-danger-50 text-danger-600",
        warning: "border-warning-600/20 bg-warning-50 text-warning-600",
        info: "border-info-600/20 bg-info-50 text-info-600",
        success: "border-primary-600/20 bg-primary-50 text-primary-800",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  },
);

const ICONS = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

export function Alert({
  variant = "error",
  title,
  children,
  action,
  className,
}) {
  const IconComponent = ICONS[variant] || AlertCircle;

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)}>
      <IconComponent className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-1")}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
