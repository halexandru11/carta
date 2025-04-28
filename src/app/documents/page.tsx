import 'server-only';

import { DocumentsTable } from '~/modules/documents/documents-table';

export default function DocumentsPage() {
  return (
    <div className='p-2'>
      <DocumentsTable />
    </div>
  );
}
