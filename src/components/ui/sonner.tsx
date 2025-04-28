'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-input group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          error:
            'group-[.toaster]:border-destructive group-[.toaster]:[&_svg]:text-destructive group-[.toaster]:text-destructive',
          info:
            'group-[.toaster]:border-info group-[.toaster]:[&_svg]:text-info group-[.toaster]:text-info',
          success:
            'group-[.toaster]:border-success group-[.toaster]:[&_svg]:text-success group-[.toaster]:text-success',
          loading:
            'group-[.toaster]:border-info group-[.toaster]:[&_svg]:text-info group-[.toaster]:text-info',
          warning:
            'group-[.toaster]:border-warning group-[.toaster]:[&_svg]:text-warning group-[.toaster]:text-warning',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
