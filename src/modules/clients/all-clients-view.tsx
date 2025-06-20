import 'server-only';

import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';

import { ClientsTable } from './clients-table';
import { CreateClientDialog } from './create-client-dialog';

export function AllClientsView() {
  return (
    <div className='space-y-2 p-2'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Clients</h1>
        <CreateClientDialog>
          <Button>
            <PlusIcon />
            Create Client
          </Button>
        </CreateClientDialog>
      </div>
      <ClientsTable />
    </div>
  );
}
