import 'server-only';

import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';

import { CreateClientDialog } from './create-client-dialog';
import { ClientsTable } from './clients-table';

export function AllClientsView() {
  return (
    <div className='p-2 space-y-2'>
      <div className='flex justify-end'>
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

