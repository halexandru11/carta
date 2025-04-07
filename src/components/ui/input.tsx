import * as React from 'react';
import { cn } from '~/lib/utils';
import RcInputNumber, { InputNumberProps } from 'rc-input-number';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export const InputNumber = React.forwardRef<
  HTMLInputElement,
  InputNumberProps & {
    adornment?: string;
  }
>(({ className, type, placeholder, adornment, ...props }, ref) => {
  return (
    <div className='relative'>
      <RcInputNumber
        id={props.id || props.name}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={cn(
          'md:text-sm',
          '[&_input]:flex [&_input]:h-9 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:bg-transparent [&_input]:px-3 [&_input]:py-1 [&_input]:text-foreground [&_input]:shadow-sm [&_input]:transition-colors',
          '[&_input]:file:border-0 [&_input]:file:bg-transparent [&_input]:file:text-sm [&_input]:file:font-medium [&_input]:file:text-foreground',
          '[&_input]:placeholder:italic [&_input]:placeholder:text-muted-foreground',
          '[&_input]:focus-visible:outline-none [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-ring [&_input]:focus-visible:ring-offset-2',
          '[&_input]:disabled:cursor-not-allowed [&_input]:disabled:opacity-50',
          props.disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
      />
      {adornment && (
        <label
          htmlFor={props.id || props.name}
          className={cn(
            'absolute right-2 top-1/2 translate-y-[-50%] cursor-text rounded-sm bg-background p-1 text-foreground',
            type === 'number' && 'right-9',
            props.disabled && 'text-muted-foreground',
          )}
        >
          {adornment}
        </label>
      )}
    </div>
  );
});
InputNumber.displayName = 'InputNumber';
