'use client';

import { useEffect, useState } from 'react';
import { Editor } from '~/modules/lexical/editor';
import { TemplateUpdate } from '~/schemas/templates';
import { templateGet, templateUpdate } from '~/server/actions/templates';

type TemplateViewProps = {
  templateId: string;
};

export function TemplateView(props: TemplateViewProps) {
  const templateId = Number(props.templateId);

  const [doc, setDoc] = useState<Awaited<ReturnType<typeof templateGet>>>();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const docRes = await templateGet(templateId);
      if (docRes?.content && firstRender) {
        setFirstRender(false);
        setDoc(docRes);
      }
    }

    fetchContent();
  });

  async function handleSave(newDoc: Omit<TemplateUpdate, 'id'>) {
    await templateUpdate({
      ...newDoc,
      id: templateId,
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
