import 'server-only';

import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';

import { CreateDocumentDialog } from './create-document-dialog';
import { DocumentsTable } from './documents-table';

export function AllDocumentsView() {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Documents</h1>
        <CreateDocumentDialog>
          <Button>
            <PlusIcon />
            Create Document
          </Button>
        </CreateDocumentDialog>
      </div>
      <DocumentsTable />
    </div>
  );
}
