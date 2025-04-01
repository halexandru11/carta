'use client';

import { useState } from 'react';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
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

import { catppuccinTheme } from './catppuccin-theme';
import { ToolbarPlugin } from './plugins/toolbar-plugin';
import { parseAllowedColor, parseAllowedFontSize } from './style-config';
import { ImageNode } from './nodes/image-node';

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
    CodeHighlightNode,
    CodeNode,
    HeadingNode,
    ImageNode,
    LinkNode,
    ListItemNode,
    ListNode,
    QuoteNode,
    TableCellNode,
    TableNode,
    TableRowNode,
    TextNode,
  ],
  onError(error: Error) {
    throw error;
  },
  theme: catppuccinTheme,
};

export function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorHelper />
    </LexicalComposer>
  );
}

function EditorHelper() {
  const isEditable = useLexicalEditable();
  const [_isLinkEditMode, setIsLinkEditMode] = useState(false);

  return (
    <div className='relative mx-auto h-full w-full max-w-[1600px] rounded-sm text-start'>
      <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
      <div className='relative'>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className='caret-subtext-1 relative min-h-[600px] w-full resize-none rounded-md border p-4 text-text outline-none'
              aria-placeholder={placeholder}
              placeholder={
                <div className='pointer-events-none absolute left-4 top-4 inline-block select-none overflow-hidden text-ellipsis italic text-muted-foreground'>
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <TablePlugin hasCellMerge hasCellBackgroundColor />
        <ClickableLinkPlugin disabled={isEditable} />
        <HorizontalRulePlugin />
        <TabIndentationPlugin />

        <AutoFocusPlugin />
        <CheckListPlugin />
        <ListPlugin />
        <HistoryPlugin />
      </div>
    </div>
  );
}
