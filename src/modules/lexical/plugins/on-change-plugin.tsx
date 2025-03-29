'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';

type OnChangePluginProps = {
  onChange: (editorState: EditorState) => void;
};

export function OnChangePlugin(props: OnChangePluginProps) {
  const { onChange } = props;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [onChange, editor]);

  return null;
}
