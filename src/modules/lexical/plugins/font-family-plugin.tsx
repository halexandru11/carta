import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { $getSelection } from 'lexical';

export type FontFamily = 'GeistSans' | 'Arimo' | 'Cousine' | 'Noto Serif';
const FONT_FAMILY_OPTIONS: [FontFamily, string][] = [
  ['GeistSans', 'Geist'],
  ['Arimo', 'Arimo'],
  ['Cousine', 'Cousine'],
  ['Noto Serif', 'Noto Serif'],
] as const;
export const DEFAULT_FONT_FAMILY: FontFamily = 'GeistSans';

type FontFamilyPluginProps = {
  fontFamily: string;
  disabled?: boolean;
};

export function FontFamilyPlugin(props: FontFamilyPluginProps): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            'font-family': option,
          });
        }
      });
    },
    [editor],
  );

  return (
    <Select disabled={props.disabled} value={props.fontFamily} onValueChange={handleClick}>
      <SelectTrigger className='h-8 w-fit gap-1 border-none px-2 hover:bg-accent hover:text-accent-foreground'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {FONT_FAMILY_OPTIONS.map(([option, text]) => (
          <SelectItem key={option} value={option} style={{ fontFamily: option }}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
