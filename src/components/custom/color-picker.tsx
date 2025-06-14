import { useCallback, useEffect } from 'react';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const ColorfulColor = [
  'var(--red)',
  'var(--maroon)',
  'var(--flamingo)',
  'var(--rosewater)',
  'var(--pink)',
  'var(--lavender)',
  'var(--mauve)',
  'var(--peach)',
  'var(--yellow)',
  'var(--green)',
  'var(--teal)',
  'var(--sapphire)',
  'var(--sky)',
  'var(--blue)',
] as const;
const NonColorfulColor = [
  'var(--text)',
  'var(--subtext1)',
  'var(--subtext0)',
  'var(--overlay2)',
  'var(--overlay1)',
  'var(--overlay0)',
  'var(--surface2)',
  'var(--surface1)',
  'var(--surface0)',
  'var(--base)',
  'var(--mantle)',
  'var(--crust)',
  'var(--card)',
] as const;
export type ColorfulColor = (typeof ColorfulColor)[number];
export type NonColorfulColor = (typeof NonColorfulColor)[number];
export type Color = ColorfulColor | NonColorfulColor;

export const DEFAULT_FONT_COLOR: NonColorfulColor = 'var(--text)';
export const DEFAULT_FONT_BG_COLOR: NonColorfulColor = 'var(--card)';

type ColorPickerProps = {
  color?: Color;
  onColorChange?: (color: Color) => void;
  children: React.ReactNode;
};

export function ColorPickerPopover({
  color: propsColor = 'var(--text)',
  onColorChange,
  children,
}: ColorPickerProps) {
  const handleColorChange = useCallback((c: Color) => onColorChange?.(c), [onColorChange]);

  useEffect(() => {
    handleColorChange(propsColor);
  }, [propsColor, handleColorChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-fit'>
        <div className='grid grid-cols-7 gap-1.5'>
          {ColorfulColor.map((c) => (
            <Button
              key={c}
              size='icon-xs'
              style={{ backgroundColor: c }}
              onClick={() => handleColorChange(c)}
            />
          ))}
          <div className='col-span-full h-1.5' />
          {NonColorfulColor.map((c) => (
            <Button
              key={c}
              size='icon-xs'
              className='border border-overlay1'
              style={{ backgroundColor: c }}
              onClick={() => handleColorChange(c)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ColorPickerContent({ onColorChange }: Pick<ColorPickerProps, 'onColorChange'>) {
  const handleColorChange = useCallback((c: Color) => onColorChange?.(c), [onColorChange]);

  return (
    <div className='grid grid-cols-7 gap-1.5'>
      {ColorfulColor.map((c) => (
        <Button
          key={c}
          size='icon-xs'
          style={{ backgroundColor: c }}
          onClick={() => handleColorChange(c)}
        />
      ))}
      <div className='col-span-full h-1.5' />
      {NonColorfulColor.map((c) => (
        <Button
          key={c}
          size='icon-xs'
          className='border border-overlay1'
          style={{ backgroundColor: c }}
          onClick={() => handleColorChange(c)}
        />
      ))}
    </div>
  );
}
