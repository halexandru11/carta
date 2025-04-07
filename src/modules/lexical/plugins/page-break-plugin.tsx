import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import { Button } from '~/components/ui/button';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { ScissorsIcon } from 'lucide-react';

import { $createPageBreakNode, PageBreakNode } from '../nodes/page-break-node';

export const INSERT_PAGE_BREAK: LexicalCommand<undefined> = createCommand();

export function PageBreakPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PageBreakNode])) {
      throw new Error('PageBreakPlugin: PageBreakNode is not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_PAGE_BREAK,
        () => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          const focusNode = selection.focus.getNode();
          if (focusNode !== null) {
            const pgBreak = $createPageBreakNode();
            $insertNodeToNearestRoot(pgBreak);
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return (
    <Button
      size='icon-sm'
      variant='ghost-secondary'
      onClick={() => {
        editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
      }}
    >
      <ScissorsIcon />
    </Button>
  );
}
