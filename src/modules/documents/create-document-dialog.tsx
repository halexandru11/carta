'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { DocumentCreate, documentCreateSchema } from '~/schemas/documents';
import { documentCreate } from '~/server/actions/documents';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateDocumentDialogProps = {
  children: React.ReactNode;
};

export function CreateDocumentDialog(props: CreateDocumentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<DocumentCreate>({
    resolver: zodResolver(documentCreateSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  async function handleDocumentCreate(values: DocumentCreate) {
    const docId = await documentCreate(values);
    if (docId !== undefined) {
      router.push(`/documents/${docId}`);
    }
    setOpen(false);
  }

  async function handleSubmit(values: DocumentCreate) {
    toast.promise(handleDocumentCreate(values), {
      loading: 'Creating document...',
      success: 'Document created successfully',
      error: 'Could not create document',
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='grid grid-cols-1 gap-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ex: Cool Contract' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <Button>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
