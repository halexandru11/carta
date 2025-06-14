'use client';

import { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTableNodeWithDimensions } from '@lexical/table';
import { $insertNodeToNearestRoot } from '@lexical/utils';
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
import { Switch } from '~/components/ui/switch';
import { TableIcon } from 'lucide-react';

export function TablePlugin() {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(5);
  const [includeHeaders, setIncludeHeaders] = useState(false);
  const [editor] = useLexicalComposerContext();

  const onAddTable = () => {
    if (!rows || !columns) return;
    editor.update(() => {
      const tableNode = $createTableNodeWithDimensions(rows, columns, includeHeaders);
      $insertNodeToNearestRoot(tableNode);
    });
    setRows(3);
    setColumns(5);
    setIncludeHeaders(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon-sm' variant='ghost-secondary'>
          <TableIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Table</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-4'>
          <div>
            <Label>Rows</Label>
            <Input
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              placeholder='Rows'
              autoFocus
            />
          </div>
          <div>
            <Label>Columns</Label>
            <Input
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              placeholder='Columns'
            />
          </div>
          <div className='mt-1 flex items-center'>
            <Switch
              id='include-headers'
              checked={includeHeaders}
              onCheckedChange={setIncludeHeaders}
            />
            <Label htmlFor='include-headers' className='pl-2 cursor-pointer'>Include headers</Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='ghost-secondary'>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onAddTable} disabled={!rows || !columns}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
