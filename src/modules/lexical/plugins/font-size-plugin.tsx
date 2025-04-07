import assert from 'assert';

import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { Button } from '~/components/ui/button';
import { InputNumber } from '~/components/ui/input';
import { $getSelection } from 'lexical';
import { MinusIcon, PlusIcon } from 'lucide-react';

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 16;

type UpdateFontSizeType = 'INCREMENT' | 'DECREMENT';

export function FontSizePlugin({ fontSize, disabled }: { fontSize: string; disabled?: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [inputValue, setInputValue] = useState<string>(fontSize);
  const [inputChangeFlag, setInputChangeFlag] = useState<boolean>(false);

  const calculateNextFontSize = (
    currentFontSize: number,
    updateType: UpdateFontSizeType | null,
  ) => {
    if (!updateType) {
      return currentFontSize;
    }

    let updatedFontSize: number = currentFontSize;
    switch (updateType) {
      case 'DECREMENT':
        switch (true) {
          case currentFontSize > MAX_ALLOWED_FONT_SIZE:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize >= 48:
            updatedFontSize -= 12;
            break;
          case currentFontSize >= 24:
            updatedFontSize -= 4;
            break;
          case currentFontSize >= 14:
            updatedFontSize -= 2;
            break;
          case currentFontSize >= 9:
            updatedFontSize -= 1;
            break;
          default:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      case 'INCREMENT':
        switch (true) {
          case currentFontSize < MIN_ALLOWED_FONT_SIZE:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize < 12:
            updatedFontSize += 1;
            break;
          case currentFontSize < 20:
            updatedFontSize += 2;
            break;
          case currentFontSize < 36:
            updatedFontSize += 4;
            break;
          case currentFontSize <= 60:
            updatedFontSize += 12;
            break;
          default:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
        }
        break;

      default:
        assert(updateType satisfies never);
        break;
    }
    return updatedFontSize;
  };

  const updateFontSizeInSelection = useCallback(
    (newFontSize: string | null, updateType: UpdateFontSizeType | null) => {
      const getNextFontSize = (prevFontSize: string | null): string => {
        if (!prevFontSize) {
          prevFontSize = `${DEFAULT_FONT_SIZE}px`;
        }
        prevFontSize = prevFontSize.slice(0, -2);
        const nextFontSize = calculateNextFontSize(Number(prevFontSize), updateType);
        return `${nextFontSize}px`;
      };

      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              'font-size': newFontSize || getNextFontSize,
            });
          }
        }
      });
    },
    [editor],
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue);

    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      setInputValue('');
      return;
    }
    setInputChangeFlag(true);
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleInputBlur = () => {
    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleButtonClick = (updateType: UpdateFontSizeType) => {
    if (inputValue !== '') {
      const nextFontSize = calculateNextFontSize(Number(inputValue), updateType);
      updateFontSizeInSelection(String(nextFontSize) + 'px', null);
    } else {
      updateFontSizeInSelection(null, updateType);
    }
  };

  const updateFontSizeByInputValue = (inputValueNumber: number) => {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    setInputValue(String(updatedFontSize));
    updateFontSizeInSelection(String(updatedFontSize) + 'px', null);
    setInputChangeFlag(false);
  };

  useEffect(() => {
    setInputValue(fontSize);
  }, [fontSize]);

  return (
    <>
      <Button
        type='button'
        size='icon-xs'
        variant='ghost-secondary'
        disabled={disabled || (fontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)}
        onClick={() => handleButtonClick('DECREMENT')}
      >
        <MinusIcon />
      </Button>
      <InputNumber
        value={inputValue}
        disabled={disabled}
        className={'[&_input]:h-7 [&_input]:w-9 [&_input]:px-2 [&_input]:text-center'}
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onChange={(value) => setInputValue(value?.toString() || `${DEFAULT_FONT_SIZE}`)}
        onKeyDown={handleKeyPress}
        onBlur={handleInputBlur}
      />
      <Button
        type='button'
        size='icon-xs'
        variant='ghost-secondary'
        disabled={disabled || (fontSize !== '' && Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)}
        onClick={() => handleButtonClick('INCREMENT')}
      >
        <PlusIcon />
      </Button>
    </>
  );
}
