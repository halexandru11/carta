import 'server-only';

import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';

import { CreateTemplateDialog } from './create-template-dialog';
import { TemplatesTable } from './templates-table';

export function AllTemplatesView() {
  return (
    <div className='p-2 space-y-2'>
      <div className='flex justify-end'>
        <CreateTemplateDialog>
          <Button>
            <PlusIcon />
            Create Template
          </Button>
        </CreateTemplateDialog>
      </div>
      <TemplatesTable />
    </div>
  );
}
