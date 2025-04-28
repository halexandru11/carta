import 'server-only';

import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';

import { CreateDocumentDialog } from './create-document-dialog';
import { DocumentsTable } from './documents-table';

export function AllDocumentsView() {
  return (
    <div className='p-2 space-y-2'>
      <div className='flex justify-end'>
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
