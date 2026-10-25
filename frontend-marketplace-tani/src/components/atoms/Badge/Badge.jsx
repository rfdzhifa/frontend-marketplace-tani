import { cva } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold',
  {
    variants: {
      tone: {
        neutral: 'bg-canvas text-ink-soft border border-border',
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

export function Badge({ children, tone = 'neutral', className, ...props }) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {children}
    </span>
  );
}
