import { memo, useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { $getSelection, $isRangeSelection, $isTextNode } from 'lexical';

import { $createPlaceholderNode, PlaceholderNode } from '../nodes/placeholder-node';

export const PlaceholderPlugin = memo(() => {
  const [editor] = useLexicalComposerContext();
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});

  useEffect(() => {
    const releaseTextContentListener = editor.registerTextContentListener(() => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

        const anchor = selection.anchor;
        const node = anchor.getNode();

        if (!$isTextNode(node)) return;

        const text = node.getTextContent();
        const match = /\{\{([^{}]+)\}\}/.exec(text);

        if (match) {
          const fullMatch = match[0]; // e.g., {{party-1-name}}
          const id = match[1]!; // e.g., party-1-name
          const offset = anchor.offset;
          const start = offset - fullMatch.length;

          // Split node and replace matched text with a PlaceholderNode
          const [, after] = node.splitText(start);
          if (!after) {
            return;
          }
          const [head] = after.splitText(fullMatch.length);
          if (!head) {
            return;
          }
          head.replace($createPlaceholderNode(id, id));
        }
      });
    });

    const releaseUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const allPlaceholders: Record<string, string> = {};
        const nodes = editor.getEditorState()._nodeMap;
        nodes.forEach((node) => {
          if (node instanceof PlaceholderNode) {
            allPlaceholders[node.getId()] = node.getValue();
          }
        });
        setPlaceholders(allPlaceholders);
      });
    });

    return () => {
      releaseTextContentListener();
      releaseUpdateListener();
    };
  }, [editor]);

  const updateValue = useCallback(
    (id: string, newValue: string) => {
      editor.update(() => {
        const nodes = editor.getEditorState()._nodeMap;
        nodes.forEach((node) => {
          if (node instanceof PlaceholderNode && node.getId() === id) {
            node.setValue(newValue);
          }
        });
      });
    },
    [editor],
  );

  return (
    <div className='mt-10 rounded-md border bg-card p-3'>
      <h4 className='mb-2 font-bold'>Placeholder Values</h4>
      {Object.entries(placeholders).map(([id, value]) => (
        <div key={id} className='mb-2' onSubmit={(e) => e.preventDefault()}>
          <Label className='capitalize'>{id.replaceAll('-', ' ')}</Label>
          <Input defaultValue={value} onBlur={(e) => updateValue(id, e.target.value)} />
        </div>
      ))}
    </div>
  );
});
