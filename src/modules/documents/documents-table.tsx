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
import { documentsGetAll } from '~/server/actions/documents';

import { DocumentsTableActions } from './documents-table-actions';

export async function DocumentsTable() {
  const docs = await documentsGetAll();

  return (
    <Table>
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
              <Button variant='link-secondary' size='link' asChild>
                <Link href={`/documents/${doc.id}`}>{doc.title}</Link>
              </Button>
            </TableCell>
            <TableCell className='w-fit'>
              <DocumentsTableActions documentId={doc.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
