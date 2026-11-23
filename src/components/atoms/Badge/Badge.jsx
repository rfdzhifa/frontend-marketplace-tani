import { cva } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold leading-none select-none',
  {
    variants: {
      tone: {
        neutral: 'bg-canvas text-ink-soft border border-border',
        default: 'bg-canvas text-ink-soft border border-border',
        danger: 'bg-danger-50 text-danger-600',
        warning: 'bg-warning-50 text-warning-600',
        success: 'bg-primary-100 text-primary-800',
        info: 'bg-info-50 text-info-600',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  }
);

const dotToneClasses = {
  neutral: 'bg-ink-muted',
  default: 'bg-ink-muted',
  danger: 'bg-danger-600',
  warning: 'bg-warning-600',
  success: 'bg-primary-600',
  info: 'bg-info-600',
};

export function Badge({
  children,
  tone = 'neutral',
  withDot = false,
  dot = false,
  className,
  ...props
}) {
  const showDot = withDot || dot;
  const dotColorClass = dotToneClasses[tone] || 'bg-current';

  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {showDot && (
        <span
          className={cn('inline-block h-1.5 w-1.5 rounded-full shrink-0', dotColorClass)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
