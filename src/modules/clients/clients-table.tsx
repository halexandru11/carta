import 'server-only';

import { buttonVariants } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { clientsGetAll } from '~/server/actions/clients';

export async function ClientsTable() {
  const clients = await clientsGetAll();

  return (
    <Table classNameWrapper='max-h-[calc(100dvh-4rem)]'>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Address</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.companyName}</TableCell>
            <TableCell>{client.contactName}</TableCell>
            <TableCell>
              <a
                href={`tel:${client.phone}`}
                className={buttonVariants({ size: 'link', variant: 'link-success' })}
              >
                {client.phone}
              </a>
            </TableCell>
            <TableCell>
              <a
                href={`mailto:${client.email}`}
                className={buttonVariants({ size: 'link', variant: 'link-info' })}
              >
                {client.email}
              </a>
            </TableCell>
            <TableCell className='text-muted-foreground'>{client.address}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
