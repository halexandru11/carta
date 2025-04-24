import { EditorThemeClasses } from 'lexical';

export const catppuccinTheme: EditorThemeClasses = {
  ltr: 'text-left',
  rtl: 'text-right',
  paragraph: `relative pb-2`,
  quote: 'bg-muted p-2 rounded-e-sm border-s-4 border-muted-foreground',
  heading: {
    h1: 'text-3xl font-extrabold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-bold',
    h4: 'text-lg font-bold',
    h5: 'font-bold',
    h6: 'font-bold text-muted-foreground',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    overflowed: '',
    hashtag: '',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: '[text-decoration:underline_line-through]',
  },
  list: {
    nested: {
      listitem: 'pl-5 mt-2 space-y-1 list-decimal list-inside',
    },
    ol: 'max-w-md space-y-1 list-decimal list-inside',
    ul: 'max-w-md space-y-1 list-disc list-inside',
    listitem: 'max-w-md space-y-1',
    listitemChecked: "max-w-md outline-none space-y-1 list-none before:cursor-pointer before:content-['✓'] before:text-base before:inline-flex before:items-center before:justify-center before:mr-2 before:size-4 before:bg-primary before:rounded",
    listitemUnchecked: "max-w-md outline-none space-y-1 list-none text-muted-foreground before:cursor-pointer before:content-[' '] before:inline-block before:align-middle before:mr-2 before:h-4 before:w-4 before:border before:border-primary before:rounded",
  },
  hr: 'border-t-[2px] border-input',
  tableCell: 'min-w-10 border border-overlay0 p-2',
  tableCellHeader: 'bg-surface0',
};
