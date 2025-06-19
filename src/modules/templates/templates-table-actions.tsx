'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { templateClone, templateDelete } from '~/server/actions/templates';
import { CopyIcon, EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

type TemplatesTableActionsProps = {
  templateId: number;
};

export function TemplatesTableActions(props: TemplatesTableActionsProps) {
  async function handleDelete() {
    const confimed = confirm('Are you sure that you want to DELETE this template?');
    if (!confimed) {
      return;
    }

    toast.promise(templateDelete({ id: props.templateId }), {
      loading: 'Deleting...',
      success: 'Template deleted successfully',
      error: 'Could not delete',
    });
  }

  async function handleClone() {
    const confimed = confirm('Are you sure that you want to CLONE this template?');
    if (!confimed) {
      return;
    }

    toast.promise(templateClone(props.templateId), {
      loading: 'Cloning...',
      success: 'Template cloned successfully',
      error: 'Could not clone template',
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='bg-base'>
        <DropdownMenuItem asChild>
          <Link href={`/templates/${props.templateId}`}>
            <EditIcon />
            Edit Template
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleClone}>
          <CopyIcon />
          Clone Template
        </DropdownMenuItem>
        <DropdownMenuItem className='focus:text-destructive' onSelect={handleDelete}>
          <TrashIcon />
          Delete Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
