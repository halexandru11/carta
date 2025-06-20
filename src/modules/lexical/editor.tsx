'use client';

import { useRef, useState } from 'react';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { Button } from '~/components/ui/button';
import { DocumentUpdate } from '~/schemas/documents';
import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from 'lexical';
import { DownloadIcon } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

import { catppuccinTheme } from './catppuccin-theme';
import { ExtendedTextNode } from './nodes/extended-text-node';
import { ImageNode } from './nodes/image-node';
import { PageBreakNode } from './nodes/page-break-node';
import { PlaceholderNode } from './nodes/placeholder-node';
import ContextMenuPlugin from './plugins/context-menu';
import FloatingTextFormatToolbarPlugin from './plugins/floating-text-format-toolbar-plugin';
import { LlmPlugin } from './plugins/llm-plugin';
import { LoadDefaultContentPlugin } from './plugins/load-default-content-plugin';
import {
  FloatingPlaceholderMenuPlugin,
  PlaceholderProvider,
  PlaceholderSidebarPlugin,
} from './plugins/placeholder-plugin';
import { SavePlugin } from './plugins/save-plugin';
import { TableActionMenuPlugin } from './plugins/table-action-menu-plugin';
import { ToolbarPlugin } from './plugins/toolbar-plugin';
import { parseAllowedColor, parseAllowedFontSize } from './style-config';

const placeholder = 'Enter some rich text...';

function removeStylesExportDOM(editor: LexicalEditor, target: LexicalNode): DOMExportOutput {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute('class');
      el.removeAttribute('style');
      if (el.getAttribute('dir') === 'ltr') {
        el.removeAttribute('dir');
      }
    }
  }
  return output;
}

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

function getExtraStyles(element: HTMLElement): string {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = '';
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== '' && fontSize !== '15px') {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
}

function constructImportMap(): DOMConversionMap {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
}

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: 'Carta',
  nodes: [
    AutoLinkNode,
    ExtendedTextNode,
    {
      replace: TextNode,
      with: (node: TextNode) => new ExtendedTextNode(node.__text),
      withKlass: ExtendedTextNode,
    },
    HeadingNode,
    HorizontalRuleNode,
    ImageNode,
    LinkNode,
    ListItemNode,
    ListNode,
    PageBreakNode,
    PlaceholderNode,
    QuoteNode,
    TableCellNode,
    TableNode,
    TableRowNode,
  ],
  onError(error: Error) {
    throw error;
  },
  theme: catppuccinTheme,
};

type EditorProps = {
  title?: string;
  defaultContent?: string;
  onSave?: (doc: Omit<DocumentUpdate, 'id'>) => Promise<void>;
  showPlaceholderSidebar?: boolean;
};

export function Editor(props: EditorProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: editorRef, documentTitle: props.title });

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <PlaceholderProvider>
        <div className='relative mx-auto h-full w-full max-w-[1600px] rounded-sm text-start'>
          <LlmPlugin />
          <div
            className={
              props.showPlaceholderSidebar
                ? 'grid grid-cols-[14rem,minmax(0,1fr)] gap-x-2'
                : 'grid grid-cols-1'
            }
          >
            {props.showPlaceholderSidebar && <PlaceholderSidebarPlugin />}
            <div>
              <div className='mb-2 flex items-center gap-x-2'>
                <h2 className='mr-auto text-lg font-medium'>{props.title}</h2>
                <SavePlugin
                  onSave={async (htmlString) => {
                    if (props.onSave) {
                      await props.onSave({ content: htmlString });
                    }
                  }}
                />
                <Button size='sm' onClick={reactToPrintFn}>
                  <DownloadIcon />
                  PDF
                </Button>
              </div>
              <ToolbarPlugin />
              <div className='relative'>
                <RichTextPlugin
                  contentEditable={
                    <div ref={onRef}>
                      <ContentEditable
                        ref={editorRef}
                        className='caret-subtext-1 relative h-[calc(100dvh-7rem)] w-full resize-none overflow-y-auto rounded-md bg-card p-4 text-text outline-none print:h-fit print:max-h-fit'
                        aria-placeholder={placeholder}
                        placeholder={
                          <div className='pointer-events-none absolute left-4 top-4 inline-block select-none overflow-hidden text-ellipsis italic text-muted-foreground'>
                            {placeholder}
                          </div>
                        }
                      />
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <AutoFocusPlugin />
                <CheckListPlugin />
                <ClearEditorPlugin />
                <ContextMenuPlugin />
                <ListPlugin />
                <HistoryPlugin />
                <HorizontalRulePlugin />
                <LoadDefaultContentPlugin defaultContent={props.defaultContent} />
                <TablePlugin hasCellMerge hasCellBackgroundColor />
                <TabIndentationPlugin />
                {floatingAnchorElem && (
                  <>
                    <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
                    <TableActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge />
                    <FloatingPlaceholderMenuPlugin anchorElem={floatingAnchorElem} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </PlaceholderProvider>
    </LexicalComposer>
  );
}
