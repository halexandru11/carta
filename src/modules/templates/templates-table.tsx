import 'server-only';

import Link from 'next/link';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { templatesGetAll } from '~/server/data/templates';
import { ArrowRightIcon } from 'lucide-react';

import { TemplatesTableActions } from './templates-table-actions';

export async function TemplatesTable() {
  const docs = await templatesGetAll();

  return (
    <Table classNameWrapper='max-h-[calc(100dvh-4rem)]'>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className='w-fit'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {docs.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <Button
                variant='link-secondary'
                size='link'
                className={
                  'justify-start gap-1 hover:text-primary [&_svg]:hover:visible [&_svg]:hover:translate-x-0'
                }
                asChild
              >
                <Link href={`/templates/${doc.id}`} className='w-full'>
                  {doc.title}
                  <ArrowRightIcon className='invisible -translate-x-2 transition-transform duration-200' />
                </Link>
              </Button>
            </TableCell>
            <TableCell className='w-fit'>
              <TemplatesTableActions templateId={doc.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
