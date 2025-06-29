'use client';

import { useCallback, useMemo } from 'react';
import * as React from 'react';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalContextMenuPlugin, MenuOption } from '@lexical/react/LexicalContextMenuPlugin';
import { cn } from '~/lib/utils';
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isRangeSelection,
  COPY_COMMAND,
  CUT_COMMAND,
  PASTE_COMMAND,
  type LexicalNode,
} from 'lexical';
import * as ReactDOM from 'react-dom';

function ContextMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: ContextMenuOption;
}) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0'
      }
      ref={option.setRefElement}
      role='option'
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className='text'>{option.title}</span>
    </li>
  );
}

function ContextMenu({
  options,
  selectedItemIndex,
  onOptionClick,
  onOptionMouseEnter,
}: {
  selectedItemIndex: number | null;
  onOptionClick: (option: ContextMenuOption, index: number) => void;
  onOptionMouseEnter: (index: number) => void;
  options: Array<ContextMenuOption>;
}) {
  return (
    <div
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      )}
    >
      <ul>
        {options.map((option: ContextMenuOption, i: number) => (
          <ContextMenuItem
            index={i}
            isSelected={selectedItemIndex === i}
            onClick={() => onOptionClick(option, i)}
            onMouseEnter={() => onOptionMouseEnter(i)}
            key={option.key}
            option={option}
          />
        ))}
      </ul>
    </div>
  );
}

export class ContextMenuOption extends MenuOption {
  title: string;
  onSelect: (targetNode: LexicalNode | null) => void;
  constructor(
    title: string,
    options: {
      onSelect: (targetNode: LexicalNode | null) => void;
    },
  ) {
    super(title);
    this.title = title;
    this.onSelect = options.onSelect.bind(this);
  }
}

export default function ContextMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const defaultOptions = useMemo(() => {
    return [
      new ContextMenuOption(`Copy`, {
        onSelect: () => {
          editor.dispatchCommand(COPY_COMMAND, null);
        },
      }),
      new ContextMenuOption(`Cut`, {
        onSelect: () => {
          editor.dispatchCommand(CUT_COMMAND, null);
        },
      }),
      new ContextMenuOption(`Paste`, {
        onSelect: () => {
          navigator.clipboard.read().then(async function () {
            const data = new DataTransfer();

            const items = await navigator.clipboard.read();
            const item = items[0];

            const permission = await navigator.permissions.query({
              // @ts-expect-error These types are incorrect.
              name: 'clipboard-read',
            });
            if (permission.state === 'denied') {
              alert('Not allowed to paste from clipboard.');
              return;
            }

            if (!item) {
              return;
            }

            for (const type of item.types) {
              const dataString = await (await item.getType(type)).text();
              data.setData(type, dataString);
            }

            const event = new ClipboardEvent('paste', {
              clipboardData: data,
            });

            editor.dispatchCommand(PASTE_COMMAND, event);
          });
        },
      }),
      new ContextMenuOption(`Paste as Plain Text`, {
        onSelect: () => {
          navigator.clipboard.read().then(async function () {
            const permission = await navigator.permissions.query({
              // @ts-expect-error These types are incorrect.
              name: 'clipboard-read',
            });

            if (permission.state === 'denied') {
              alert('Not allowed to paste from clipboard.');
              return;
            }

            const data = new DataTransfer();
            const items = await navigator.clipboard.readText();
            data.setData('text/plain', items);

            const event = new ClipboardEvent('paste', {
              clipboardData: data,
            });
            editor.dispatchCommand(PASTE_COMMAND, event);
          });
        },
      }),
      new ContextMenuOption(`Delete Node`, {
        onSelect: () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const currentNode = selection.anchor.getNode();
            const ancestorNodeWithRootAsParent = currentNode.getParents().at(-2);

            ancestorNodeWithRootAsParent?.remove();
          }
        },
      }),
    ];
  }, [editor]);

  const [options, setOptions] = React.useState(defaultOptions);

  const onSelectOption = useCallback(
    (selectedOption: ContextMenuOption, targetNode: LexicalNode | null, closeMenu: () => void) => {
      editor.update(() => {
        selectedOption.onSelect(targetNode);
        closeMenu();
      });
    },
    [editor],
  );

  const onWillOpen = (event: MouseEvent) => {
    let newOptions = defaultOptions;
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(event.target as Element);
      if (node) {
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          newOptions = [
            new ContextMenuOption(`Remove Link`, {
              onSelect: () => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
              },
            }),
            ...defaultOptions,
          ];
        }
      }
    });
    setOptions(newOptions);
  };

  return (
    <LexicalContextMenuPlugin
      options={options}
      onSelectOption={onSelectOption}
      onWillOpen={onWillOpen}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
        { setMenuRef },
      ) =>
        anchorElementRef.current
          ? ReactDOM.createPortal(
              <div
                className='typeahead-popover auto-embed-menu'
                style={{
                  marginLeft: anchorElementRef.current.style.width,
                  userSelect: 'none',
                  width: 200,
                }}
                ref={setMenuRef}
              >
                <ContextMenu
                  options={options}
                  selectedItemIndex={selectedIndex}
                  onOptionClick={(option: ContextMenuOption, index: number) => {
                    setHighlightedIndex(index);
                    selectOptionAndCleanUp(option);
                  }}
                  onOptionMouseEnter={(index: number) => {
                    setHighlightedIndex(index);
                  }}
                />
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
