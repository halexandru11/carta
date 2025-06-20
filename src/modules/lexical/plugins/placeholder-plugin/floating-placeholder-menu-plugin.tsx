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
import { $getSelection, $isRangeSelection, $isTextNode } from 'lexical';
import { CornerDownLeftIcon } from 'lucide-react';
import { createPortal } from 'react-dom';

import { $createPlaceholderNode } from '../../nodes/placeholder-node';
import { getDOMRangeRect } from '../../utils/get-dom-range-rect';
import { setFloatingElemPosition } from '../../utils/set-floating-elem-position';
import { usePlaceholderContext } from './placeholder-provider';

const SUGGESTIONS = ['company-name', 'contact-name', 'phone', 'email', 'address', 'current-date'];

export function FloatingPlaceholderMenuPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const { updatePlaceholder } = usePlaceholderContext();
  const [showMenu, setShowMenu] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const queryRef = useRef<HTMLInputElement | null>(null);
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
            // setQuery(match[1] ?? '');
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
      const start = text.lastIndexOf('{{');
      const [first, second] = anchorNode.splitText(start);
      if (second !== undefined) {
        second.replace($createPlaceholderNode(selected));
      } else {
        first?.replace($createPlaceholderNode(selected));
      }
      updatePlaceholder(selected);
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
        <CommandInput
          autoFocus
          ref={queryRef}
          placeholder='Search placeholders...'
          className='border-none'
        />
        <CommandList>
          <CommandGroup>
            {SUGGESTIONS.map((s) => (
              <CommandItem
                key={s}
                value={s}
                className={
                  '[&_svg]:text-transparent [&_svg]:data-[selected=true]:text-accent-foreground'
                }
                onSelect={handleSelect}
              >
                <span>{s}</span>
                <CornerDownLeftIcon className='ml-auto shrink-0' />
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
