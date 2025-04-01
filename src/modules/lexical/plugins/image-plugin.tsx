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
import { $insertNodes } from 'lexical';
import { ImageIcon } from 'lucide-react';

import { $createImageNode } from '../nodes/image-node';

export default function ImagePlugin() {
  const [file, setFile] = useState<File>();
  const [editor] = useLexicalComposerContext();

  const onAddImage = () => {
    let src = '';
    if (file) src = URL.createObjectURL(file);

    editor.update(() => {
      const node = $createImageNode({ src, altText: 'Uploaded image' });
      $insertNodes([node]);
    });
    setFile(undefined);
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
          <div>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='ghost-secondary'>
                Cancel
              </Button>
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
