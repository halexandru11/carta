'use client';

import { Editor } from '~/modules/lexical/editor';
import { documentUpdate } from '~/server/actions/documents';
import { toast } from 'sonner';

type DocumentViewProps = {
  documentId: number;
};

export function DocumentView(props: DocumentViewProps) {
  async function handleSave(htmlString: string) {
    toast.promise(
      documentUpdate({
        id: props.documentId,
        content: htmlString,
      }),
      {
        loading: 'Saving...',
        success: 'Document saved successfully',
        error: 'Could not save the document',
      },
    );
  }

  return (
    <div className='mx-auto w-[700px]'>
      <Editor onSave={handleSave} />
    </div>
  );
}
