'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { documentDelete } from '~/server/actions/documents';
import { CopyIcon, EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

type DocumentsTableActionsProps = {
  documentId: number;
};

export function DocumentsTableActions(props: DocumentsTableActionsProps) {
  async function handleDelete() {
    const confimed = confirm('Are you sure that you want to DELETE this documents?');
    if (!confimed) {
      return;
    }

    toast.promise(documentDelete({ id: props.documentId }), {
      loading: 'Deleting...',
      success: 'Document deleted successfully',
      error: 'Could not delete',
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/documents/${props.documentId}`}>
            <EditIcon />
            Edit Document
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Copy Document
        </DropdownMenuItem>
        <DropdownMenuItem className='focus:text-destructive' onSelect={handleDelete}>
          <TrashIcon />
          Delete Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
