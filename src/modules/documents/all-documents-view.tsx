import 'server-only';

import { Button } from '~/components/ui/button';
import { clientsGetAll } from '~/server/data/clients';
import { documentsGetAll } from '~/server/data/documents';
import { templatesGetAll } from '~/server/data/templates';
import { PlusIcon } from 'lucide-react';

import { CreateDocumentDialog } from './create-document-dialog';
import { DocumentsTable } from './documents-table';

export async function AllDocumentsView() {
  const [docs, templates, clients] = await Promise.all([
    documentsGetAll(),
    templatesGetAll(),
    clientsGetAll(),
  ]);

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Documents</h1>
        <CreateDocumentDialog templates={templates} clients={clients}>
          <Button>
            <PlusIcon />
            Create Document
          </Button>
        </CreateDocumentDialog>
      </div>
      <DocumentsTable docs={docs} />
    </div>
  );
}
