import 'server-only';

import { templateGet } from '~/server/data/templates';

import { TemplateEditor } from './template-editor';

type TemplateViewProps = {
  templateId: string;
};

export async function TemplateView(props: TemplateViewProps) {
  const templateId = Number(props.templateId);

  const doc = await templateGet(templateId);

  return (
    <div className='mx-auto w-[72rem]'>
      <TemplateEditor templateId={templateId} doc={doc} />
    </div>
  );
}
