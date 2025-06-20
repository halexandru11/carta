'use client';

import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '~/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

type SavePluginProps = {
  onSave: (htmlString: string) => Promise<void>;
};

export function SavePlugin(props: SavePluginProps) {
  const [editor] = useLexicalComposerContext();

  async function handleSave() {
    editor.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      toast.promise(async () => await props.onSave(htmlString), {
        loading: 'Saving...',
        success: 'Document saved successfully',
        error: 'An error occured while saving your document',
      });
    });
  }

  return (
    <Button size='sm' variant='success' onClick={handleSave}>
      <SaveIcon />
      Save
    </Button>
  );
}
