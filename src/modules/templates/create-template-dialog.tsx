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
import { TemplateCreate, templateCreateSchema } from '~/schemas/templates';
import { templateCreate } from '~/server/actions/templates';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateTemplateDialogProps = {
  children: React.ReactNode;
};

export function CreateTemplateDialog(props: CreateTemplateDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<TemplateCreate>({
    resolver: zodResolver(templateCreateSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  async function handleTemplateCreate(values: TemplateCreate) {
    const docId = await templateCreate(values);
    if (docId !== undefined) {
      router.push(`/templates/${docId}`);
    }
    setOpen(false);
  }

  async function handleSubmit(values: TemplateCreate) {
    toast.promise(async () => await handleTemplateCreate(values), {
      loading: 'Creating template...',
      success: 'Template created successfully',
      error: 'Could not create template',
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
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
