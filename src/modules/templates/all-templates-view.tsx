import 'server-only';

import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';

import { CreateTemplateDialog } from './create-template-dialog';
import { TemplatesTable } from './templates-table';

export function AllTemplatesView() {
  return (
    <div className='space-y-2'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Templates</h1>
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
