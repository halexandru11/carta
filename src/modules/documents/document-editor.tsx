'use client';

import { Editor } from '~/modules/lexical/editor';
import { DocumentUpdate } from '~/schemas/documents';
import { documentUpdate } from '~/server/actions/documents';

type DocumentEditorProps = {
  documentId: number;
  doc: any;
};

export function DocumentEditor(props: DocumentEditorProps) {
  async function handleSave(newDoc: Omit<DocumentUpdate, 'id'>) {
    await documentUpdate({
      ...newDoc,
      id: props.documentId,
    });
  }

  return (
    <Editor
      title={props.doc?.title ?? undefined}
      defaultContent={props.doc?.content ?? undefined}
      onSave={handleSave}
    />
  );
}
