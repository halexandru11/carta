'use client';

import { useEffect } from 'react';
import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getRoot, $insertNodes } from 'lexical';

import { $createPlaceholderNode } from '../nodes/placeholder-node';

type LoadDefaultContentPluginProps = {
  defaultContent?: string;
};

export function LoadDefaultContentPlugin(props: LoadDefaultContentPluginProps) {
  const { defaultContent } = props;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (defaultContent === undefined) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(defaultContent, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);

      // Utility to scan and transform text nodes
      const transformedNodes = nodes.flatMap((node) => {
        if (node.getType() === 'text') {
          const textContent = node.getTextContent();
          const pattern = /\{\{(.*?)\}\}/g;
          const segments = [];
          let lastIndex = 0;
          let match;

          while ((match = pattern.exec(textContent)) !== null) {
            const [fullMatch, id] = match;
            const startIndex = match.index;

            // Text before placeholder
            if (startIndex > lastIndex) {
              segments.push($createTextNode(textContent.slice(lastIndex, startIndex)));
            }

            // Placeholder node
            if (id) {
              segments.push($createPlaceholderNode(id));
            }
            lastIndex = startIndex + fullMatch.length;
          }

          // Remaining text
          if (lastIndex < textContent.length) {
            segments.push($createTextNode(textContent.slice(lastIndex)));
          }

          return segments.length > 0 ? segments : [node];
        }

        return [node]; // keep non-text nodes unchanged
      });

      const root = $getRoot();
      root.clear();
      $insertNodes(transformedNodes);
    });
  }, [editor, defaultContent]);

  return null;
}
