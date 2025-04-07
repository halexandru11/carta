import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '~/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'hover:bg-primary/90 bg-primary text-primary-foreground shadow-sm',
        secondary: 'hover:bg-secondary/80 bg-secondary text-secondary-foreground shadow-sm',
        destructive: 'hover:bg-destructive/90 bg-destructive text-destructive-foreground shadow-sm',
        info: 'hover:bg-info/90 bg-info text-info-foreground shadow-sm',
        success: 'hover:bg-success/90 bg-success text-success-foreground shadow-sm',
        warning: 'hover:bg-warning/90 bg-warning text-warning-foreground shadow-sm',
        'outline-primary':
          'border border-primary bg-background text-primary shadow-sm hover:bg-accent',
        'outline-secondary':
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        'outline-destructive':
          'border border-destructive bg-background text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground',
        'outline-info': 'border border-info bg-background text-info shadow-sm hover:bg-accent',
        'outline-success':
          'border border-success bg-background text-success shadow-sm hover:bg-accent',
        'outline-warning':
          'border border-warning bg-background text-warning shadow-sm hover:bg-accent',
        'ghost-primary': 'text-primary hover:bg-accent',
        'ghost-secondary': 'hover:bg-accent hover:text-accent-foreground',
        'ghost-destructive':
          'text-destructive hover:bg-destructive hover:text-destructive-foreground',
        'ghost-info': 'text-info hover:bg-accent',
        'ghost-success': 'text-success hover:bg-accent',
        'ghost-warning': 'text-warning hover:bg-accent',
        'link-primary': 'text-primary underline-offset-4 hover:underline',
        'link-secondary': 'underline-offset-4 hover:text-accent-foreground hover:underline',
        'link-destructive': 'text-destructive underline-offset-4 hover:underline',
        'link-info': 'text-info underline-offset-4 hover:underline',
        'link-success': 'text-success underline-offset-4 hover:underline',
        'link-warning': 'text-warning underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-3 py-2',
        xs: 'h-6 rounded-sm px-1 text-xs',
        sm: 'h-8 rounded-md px-2.5 text-xs',
        lg: 'h-10 rounded-md px-8',
        'icon-xs': 'h-6 w-6',
        'icon-sm': 'h-8 w-8',
        icon: 'h-9 w-9',
        link: 'gap-1.5 rounded-none p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
