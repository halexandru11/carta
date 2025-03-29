'use client';

import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_MAP } from '@lexical/code';
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
  $isQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from '@lexical/selection';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  mergeRegister,
} from '@lexical/utils';
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
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
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
  CodeIcon,
  CodeXmlIcon,
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

const COMMAND_PRIORITY_LOW = 1;

const BlockType = z.enum([
  'paragraph',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'code',
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
  code: ['Code Block', CodeXmlIcon],
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
  const [activeEditor, setActiveEditor] = useState(editor);
  const toolbarRef = useRef(null);
  const [blockType, setBlockType] = useState<BlockType>(BlockType.enum.paragraph);
  const [rootType, setRootType] = useState<RootType>(RootType.enum.root);
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  // const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isImageCaption, setIsImageCaption] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        setIsImageCaption(
          !!rootElement?.parentElement?.classList.contains('image-caption-container'),
        );
      } else {
        setIsImageCaption(false);
      }

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
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

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
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type as BlockType) {
            setBlockType(type as BlockType);
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : '');
            return;
          }
        }
      }

      // Handle buttons
      setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'));
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '15px'));
    }
  }, [editor, activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      activeEditor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      activeEditor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, activeEditor, $updateToolbar]);

  useEffect(() => {
    return activeEditor.registerCommand(
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
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, isLink, props.setIsLinkEditMode]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {},
      );
    },
    [activeEditor],
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || $isTableSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
            // } else if ($isDecoratorBlockNode(node)) {
            //   node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      props.setIsLinkEditMode(true);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      props.setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, props.setIsLinkEditMode]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const canViewerSeeInsertDropdown = !isImageCaption;
  const canViewerSeeInsertCodeButton = !isImageCaption;

  return (
    <div className='flex items-center gap-x-0.5 p-1' ref={toolbarRef}>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!canUndo || !isEditable}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label='Undo'
      >
        <UndoIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!canRedo || !isEditable}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label='Redo'
      >
        <RedoIcon className='size-4 text-muted-foreground' />
      </Button>
      <Separator orientation='vertical' className='h-6' />
      <BlockFormatSelect editor={activeEditor} rootType={rootType} blockType={blockType} />
      <Button
        size='icon-sm'
        variant={isBold ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        aria-label='Format Bold'
      >
        <BoldIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant={isItalic ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        aria-label='Format Italics'
      >
        <ItalicIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant={isUnderline ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        aria-label='Format Underline'
      >
        <UnderlineIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant={isStrikethrough ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        aria-label='Format Strikethrough'
      >
        <StrikethroughIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant={isCode ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        aria-label='Insert Code Block'
      >
        <CodeIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant={isLink ? 'secondary' : 'ghost-secondary'}
        disabled={!isEditable}
        onClick={insertLink}
        aria-label='Insert Link'
      >
        <LinkIcon className='size-4 text-muted-foreground' />
      </Button>
      <Separator orientation='vertical' className='h-6' />
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        aria-label='Left Align'
      >
        <AlignLeftIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        aria-label='Center Align'
      >
        <AlignCenterIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        aria-label='Right Align'
      >
        <AlignRightIcon className='size-4 text-muted-foreground' />
      </Button>
      <Button
        size='icon-sm'
        variant='ghost-secondary'
        disabled={!isEditable}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        aria-label='Justify Align'
      >
        <AlignJustifyIcon className='size-4 text-muted-foreground' />
      </Button>
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

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
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
      case BlockType.enum.code:
        formatCode();
        break;
      default:
        format satisfies never;
    }
  }

  return (
    <Select disabled={disabled} value={blockType} onValueChange={handleFormatChange}>
      <SelectTrigger className={'h-8 w-fit px-2 [&>span>span]:hidden'}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(blockTypeTo).map(([key, [name, Icon]]) => (
          <SelectItem key={key} value={key}>
            <Icon className='size-5 inline mr-1' />
            <span>{name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
