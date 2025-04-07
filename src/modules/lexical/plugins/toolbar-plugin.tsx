'use client';

import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $isTableNode } from '@lexical/table';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  RedoIcon,
  StrikethroughIcon,
  TextIcon,
  TextQuoteIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react';
import { z } from 'zod';

import { getSelectedNode } from '../utils/get-selected-node';
import { sanitizeUrl } from '../utils/url';
import { ImagePlugin } from './image-plugin';
import { PageBreakPlugin } from './page-break-plugin';
import { TablePlugin } from './table-plugin';

const COMMAND_PRIORITY_LOW = 1;

const BlockType = z.enum([
  'paragraph',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'quote',
  'bullet',
  'number',
  'check',
]);
type BlockType = z.infer<typeof BlockType>;

const blockTypeTo: Record<BlockType, [string, LucideIcon]> = {
  paragraph: ['Normal', TextIcon],
  h1: ['Heading 1', Heading1Icon],
  h2: ['Heading 2', Heading2Icon],
  h3: ['Heading 3', Heading3Icon],
  h4: ['Heading 4', Heading4Icon],
  h5: ['Heading 5', Heading5Icon],
  h6: ['Heading 6', Heading6Icon],
  quote: ['Quote', TextQuoteIcon],
  bullet: ['Bullet List', ListIcon],
  number: ['Numbered List', ListOrderedIcon],
  check: ['Check List', ListTodoIcon],
};

const RootType = z.enum(['root', 'table']);
type RootType = z.infer<typeof RootType>;

type ToolbarPluginProps = {
  setIsLinkEditMode: Dispatch<boolean>;
};

export function ToolbarPlugin(props: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [blockType, setBlockType] = useState<BlockType>(BlockType.enum.paragraph);
  const [rootType, setRootType] = useState<RootType>(RootType.enum.root);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType(RootType.enum.table);
      } else {
        setRootType(RootType.enum.root);
      }

      if (elementDOM !== null) {
        // setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type as BlockType) {
            setBlockType(type as BlockType);
          }
        }
      }

      // Handle buttons
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // setElementFormat(
      //   $isElementNode(matchingParent)
      //     ? matchingParent.getFormatType()
      //     : $isElementNode(node)
      //       ? node.getFormatType()
      //       : parent?.getFormatType() || 'left',
      // );
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload) => {
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            props.setIsLinkEditMode(true);
            url = sanitizeUrl('https://');
          } else {
            props.setIsLinkEditMode(false);
            url = null;
          }
          return editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [editor, isLink, props.setIsLinkEditMode]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      props.setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      props.setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, props.setIsLinkEditMode]);

  return (
    <div className='mb-2 flex items-center rounded-md bg-card p-1' ref={toolbarRef}>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!canUndo || !isEditable}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label='Undo'
      >
        <UndoIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!canRedo || !isEditable}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label='Redo'
      >
        <RedoIcon className='size-4' />
      </Button>
      <Separator orientation='vertical' className='mx-1 h-6' />
      <BlockFormatSelect editor={editor} rootType={rootType} blockType={blockType} />
      <Button
        size='icon-sm'
        variant={isBold ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        aria-label='Format Bold'
      >
        <BoldIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant={isItalic ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        aria-label='Format Italics'
      >
        <ItalicIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant={isUnderline ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        aria-label='Format Underline'
      >
        <UnderlineIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant={isStrikethrough ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        aria-label='Format Strikethrough'
      >
        <StrikethroughIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant={isLink ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={insertLink}
        aria-label='Insert Link'
      >
        <LinkIcon className='size-4' />
      </Button>
      <Separator orientation='vertical' className='mx-1 h-6' />
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        aria-label='Left Align'
      >
        <AlignLeftIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        aria-label='Center Align'
      >
        <AlignCenterIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        aria-label='Right Align'
      >
        <AlignRightIcon className='size-4' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        aria-label='Justify Align'
      >
        <AlignJustifyIcon className='size-4' />
      </Button>
      <Separator orientation='vertical' className='mx-1 h-6' />
      <ImagePlugin />
      <TablePlugin />
      <PageBreakPlugin />
    </div>
  );
}

function BlockFormatSelect({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: BlockType;
  rootType: RootType;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  function handleFormatChange(format: BlockType) {
    switch (format) {
      case BlockType.enum.paragraph:
        formatParagraph();
        break;
      case BlockType.enum.h1:
      case BlockType.enum.h2:
      case BlockType.enum.h3:
      case BlockType.enum.h4:
      case BlockType.enum.h5:
      case BlockType.enum.h6:
        formatHeading(format);
        break;
      case BlockType.enum.bullet:
        formatBulletList();
        break;
      case BlockType.enum.number:
        formatNumberedList();
        break;
      case BlockType.enum.check:
        formatCheckList();
        break;
      case BlockType.enum.quote:
        formatQuote();
        break;
      default:
        format satisfies never;
    }
  }

  return (
    <Select disabled={disabled} value={blockType} onValueChange={handleFormatChange}>
      <SelectTrigger className={'h-8 w-fit gap-1 px-2 [cc&>span>span]:hidden'}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(blockTypeTo).map(([key, [name, Icon]]) => (
          <SelectItem key={key} value={key}>
            <Icon className='mr-1 inline size-5' />
            <span>{name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
