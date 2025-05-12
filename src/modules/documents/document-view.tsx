'use client';

import { useEffect, useState } from 'react';
import { Editor } from '~/modules/lexical/editor';
import { DocumentUpdate } from '~/schemas/documents';
import { documentGet, documentUpdate } from '~/server/actions/documents';

type DocumentViewProps = {
  documentId: string;
};

export function DocumentView(props: DocumentViewProps) {
  const documentId = Number(props.documentId);

  const [doc, setDoc] = useState<Awaited<ReturnType<typeof documentGet>>>();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const docRes = await documentGet(documentId);
      if (docRes?.content && firstRender) {
        setFirstRender(false);
        setDoc(docRes);
      }
    }

    fetchContent();
  });

  async function handleSave(newDoc: Omit<DocumentUpdate, 'id'>) {
    await documentUpdate({
      ...newDoc,
      id: documentId,
    });
  }

  return (
    <div className='mx-auto w-[72rem]'>
      <Editor
        title={doc?.title ?? undefined}
        defaultContent={doc?.content ?? undefined}
        onSave={handleSave}
      />
    </div>
  );
}
