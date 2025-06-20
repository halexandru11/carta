import 'server-only';

import { documentGet } from '~/server/data/documents';

import { DocumentEditor } from './document-editor';

type DocumentViewProps = {
  documentId: string;
};

export async function DocumentView(props: DocumentViewProps) {
  const documentId = Number(props.documentId);

  const doc = await documentGet(documentId);

  return (
    <div className='mx-auto w-[72rem]'>
      <DocumentEditor documentId={documentId} doc={doc} />
    </div>
  );
}
