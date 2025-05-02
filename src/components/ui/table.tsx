import * as React from 'react';
import { cn } from '~/lib/utils';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    classNameWrapper?: string;
  }
>(({ classNameWrapper, className, ...props }, ref) => (
  <div className={cn('relative w-full overflow-auto rounded-md', classNameWrapper)}>
    <table
      ref={ref}
      className={cn('w-full caption-bottom border-collapse bg-card text-sm', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    /**
     * Show only the last header row when scrolling a long table
     */
    collapsibleRows?: boolean;
  }
>(({ className, children, collapsibleRows, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'font-semibold [&_tr]:border-0 [&_tr_th]:sticky',
      '[&_tr:nth-child(1)_th]:top-0',
      '[&_tr:nth-child(2)_th]:top-10',
      '[&_tr:nth-child(3)_th]:top-20',
      '[&_tr:nth-child(4)_th]:top-30',
      '[&_tr:nth-child(5)_th]:top-40',
      className,
    )}
    {...props}
  >
    {children}
    <TableRow>
      <TableHead colSpan={100} className='h-px p-0 bg-border' />
    </TableRow>
  </thead>
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <tfoot ref={ref} className={cn('font-medium', className)} {...props}>
    <TableRow>
      <TableCell colSpan={100} className='h-0.5 bg-border p-0' />
    </TableRow>
    {children}
  </tfoot>
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-accent data-[state=selected]:bg-accent',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'z-10 h-10 bg-card px-2 text-left align-middle font-medium text-muted-foreground',
      'shadow-[1px_0px_0px_1px_var(--border)]',
      '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
