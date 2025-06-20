import 'server-only';

import { TemplateView } from '~/modules/templates/template-view';

type TemplatePageProps = {
  params: Promise<{
    templateId: string;
  }>;
};

export default async function TemplatePage(props: TemplatePageProps) {
  const { templateId } = await props.params;

  return <TemplateView templateId={templateId} />;
}
