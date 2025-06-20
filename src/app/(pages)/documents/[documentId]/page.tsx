import 'server-only';

import { DocumentView } from '~/modules/documents/document-view';

type DocumentPageProps = {
  params: Promise<{
    documentId: string;
  }>;
};

export default async function DocumentPage(props: DocumentPageProps) {
  const { documentId } = await props.params;

  return <DocumentView documentId={documentId} />;
}
