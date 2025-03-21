
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: 'raise' | 'glow' | 'border' | 'none';
  clickEffect?: boolean;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, hoverEffect = 'raise', clickEffect = true, children, ...props }, ref) => {
    const hoverEffectClasses = {
      raise: 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg',
      glow: 'transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]',
      border: 'transition-all duration-300 hover:border-primary',
      none: ''
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          hoverEffectClasses[hoverEffect],
          clickEffect && 'active:scale-[0.98] transition-transform',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };
