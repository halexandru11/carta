import 'server-only';

import { DocumentView } from '~/modules/documents/document-view';

type DocumentPageProps = {
  params: Promise<{
    documentId: number;
  }>;
};

export default async function DocumentPage(props: DocumentPageProps) {
  const { documentId } = await props.params;

  return (
    <div className='p-2'>
      <DocumentView documentId={documentId} />
    </div>
  );
}
