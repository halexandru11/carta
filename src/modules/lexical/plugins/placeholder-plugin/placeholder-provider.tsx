'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $isTextNode } from 'lexical';

import { $createPlaceholderNode, PlaceholderNode } from '../../nodes/placeholder-node';

type PlaceholderRecord = Record<string, string>;

type PlaceholderContextValue = {
  placeholders: PlaceholderRecord;
  updatePlaceholder: (id: string, newPlaceholder?: string) => void;
};

const PlaceholderContext = createContext<PlaceholderContextValue | undefined>(undefined);

type PlaceholderProviderProps = {
  children: React.ReactNode;
};

export function PlaceholderProvider(props: PlaceholderProviderProps) {
  const [editor] = useLexicalComposerContext();
  const [placeholders, setPlaceholders] = useState<PlaceholderRecord>({});

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
          head.replace($createPlaceholderNode(id, placeholders[id]));
        }
      });
    });

    const releaseUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const allPlaceholders: Record<string, string> = {};
        const nodes = editor.getEditorState()._nodeMap;
        nodes.forEach((node) => {
          if (node instanceof PlaceholderNode) {
            allPlaceholders[node.getId()] = allPlaceholders[node.getId()] ?? node.getValue();
          }
        });
        setPlaceholders(allPlaceholders);
        console.log('UPDATE');
      });
    });

    return () => {
      releaseTextContentListener();
      releaseUpdateListener();
    };
  }, [editor, placeholders]);

  const updatePlaceholder = useCallback(
    (id: string, newPlaceholder?: string) => {
      const placeholder = newPlaceholder ?? placeholders[id] ?? id;

      setPlaceholders((prev) => {
        const newPlaceholders: Record<string, string> = {};
        Object.entries(prev).forEach(([key, value]) => {
          if (key === id) {
            newPlaceholders[key] = placeholder;
          } else {
            newPlaceholders[key] = value;
          }
        });
        return newPlaceholders;
      });

      setTimeout(
        () =>
          editor.update(() => {
            const nodes = editor.getEditorState()._nodeMap;
            nodes.forEach((node) => {
              if (node instanceof PlaceholderNode && node.getId() === id) {
                node.setValue(placeholder);
              }
            });
          }),
        0,
      );
    },
    [editor, placeholders, setPlaceholders],
  );

  return (
    <PlaceholderContext.Provider
      value={{
        placeholders,
        updatePlaceholder,
      }}
    >
      {props.children}
    </PlaceholderContext.Provider>
  );
}

export function usePlaceholderContext() {
  const context = useContext(PlaceholderContext);

  if (context === undefined) {
    throw new Error('usePlaceholderContext must be used with a PlaceholderProvider');
  }

  return context;
}
