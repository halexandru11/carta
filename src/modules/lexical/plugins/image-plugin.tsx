import { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { $createParagraphNode, $insertNodes, $isRootOrShadowRoot } from 'lexical';
import { ImageIcon } from 'lucide-react';

import { $createImageNode } from '../nodes/image-node';
import { $wrapNodeInElement } from '@lexical/utils';

export function ImagePlugin() {
  const [file, setFile] = useState<File>();
  const [altText, setAltText] = useState('');
  const [editor] = useLexicalComposerContext();

  const onAddImage = () => {
    let src = '';
    if (file) src = URL.createObjectURL(file);

    editor.update(() => {
      const node = $createImageNode({ src, altText });
      $insertNodes([node]);
      if ($isRootOrShadowRoot(node.getParentOrThrow())) {
        $wrapNodeInElement(node, $createParagraphNode).selectEnd();
      }
    });
    setFile(undefined);
    setAltText('');
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size='icon-sm' variant='ghost-secondary'>
            <ImageIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>
          <div className='grid grid-cols-1 gap-y-4'>
            <div>
              <Label>Image</Label>
              <Input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                  }
                  e.target.files = null;
                }}
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={altText}
                onChange={(e) => {
                  const text = e.target.value;
                  setAltText(text);
                }}
                placeholder='Descriptive alternate text'
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='ghost-secondary'>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={onAddImage} disabled={!file}>
                Add Image
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
