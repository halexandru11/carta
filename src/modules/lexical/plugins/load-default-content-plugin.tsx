'use client';

import { useEffect } from 'react';
import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes } from 'lexical';

type LoadDefaultContentPluginProps = {
  defaultContent?: string;
};

export function LoadDefaultContentPlugin(props: LoadDefaultContentPluginProps) {
  const { defaultContent } = props;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (defaultContent === undefined) {
      return;
    }

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(defaultContent, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().clear();
      $insertNodes(nodes);
    });
  }, [editor, defaultContent]);

  return null;
}
