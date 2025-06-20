'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
  KEY_ESCAPE_COMMAND,
} from 'lexical';
import { createPortal } from 'react-dom';

import { $createPlaceholderNode } from '../nodes/placeholder-node';
import { getDOMRangeRect } from '../utils/get-dom-range-rect';
import { setFloatingElemPosition } from '../utils/set-floating-elem-position';

const SUGGESTIONS = ['company-name', 'contact-name', 'phone', 'email', 'address', 'current-date'];

export function FloatingPlaceholderMenuPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [rect, setRect] = useState<DOMRect | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const updateMenu = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        setShowMenu(false);
        return;
      }

      const anchorNode = selection.anchor.getNode();
      if (!$isTextNode(anchorNode)) {
        setShowMenu(false);
        return;
      }

      const text = anchorNode.getTextContent();
      const match = /(?:^|\s)\{\{([a-zA-Z0-9-_]*)$/.exec(text);

      if (match) {
        const nativeSelection = window.getSelection();
        if (nativeSelection) {
          const rangeRect = getDOMRangeRect(nativeSelection, anchorElem);
          if (rangeRect) {
            setQuery(match[1] ?? '');
            setRect(rangeRect);
            setShowMenu(true);
          }
        }
      } else {
        setShowMenu(false);
      }
    });
  }, [editor, anchorElem]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateMenu();
    });
  }, [editor, updateMenu]);

  useEffect(() => {
    if (menuRef.current && rect) {
      setFloatingElemPosition(rect, menuRef.current, anchorElem);
    }
  }, [rect, anchorElem]);

  const handleSelect = (selected: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      if (!$isTextNode(anchorNode)) return;

      const text = anchorNode.getTextContent();
      const match = /\{\{([^{}]*)/.exec(text);
      if (match && match[1]) {
        const start = text.lastIndexOf(`{{${match[1]}`);
        const [before] = anchorNode.splitText(start);
        before?.replace($createPlaceholderNode(selected, selected));
      }
    });
    setShowMenu(false);
  };

  if (!showMenu || !rect) return null;

  return createPortal(
    <div
      ref={menuRef}
      className='absolute left-0 top-0 z-50 w-64 rounded-md border bg-background shadow-md'
    >
      <Command className='w-full'>
        <CommandInput value={query} placeholder='Search placeholders...' className='border-none' />
        <CommandList>
          <CommandGroup>
            {SUGGESTIONS.map((s) => (
              <CommandItem key={s} value={s} onSelect={() => handleSelect(s)}>
                {s}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No matches found.</CommandEmpty>
        </CommandList>
      </Command>
    </div>,
    anchorElem,
  );
}
