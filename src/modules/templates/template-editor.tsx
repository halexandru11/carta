'use client';

import { Editor } from '~/modules/lexical/editor';
import { TemplateUpdate } from '~/schemas/templates';
import { templateUpdate } from '~/server/actions/templates';
import { TemplateType } from '~/server/types';

type TemplateEditorProps = {
  templateId: number;
  doc: TemplateType | undefined;
};

export function TemplateEditor(props: TemplateEditorProps) {
  async function handleSave(newDoc: Omit<TemplateUpdate, 'id'>) {
    await templateUpdate({
      ...newDoc,
      id: props.templateId,
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
