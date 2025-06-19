'use client';

import { useState } from 'react';
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
import { ClientCreate, clientCreateSchema } from '~/schemas/clients';
import { clientCreate } from '~/server/actions/clients';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateClientDialogProps = {
  children: React.ReactNode;
};

export function CreateClientDialog(props: CreateClientDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ClientCreate>({
    resolver: zodResolver(clientCreateSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  async function handleClientCreate(values: ClientCreate) {
    await clientCreate(values);
    setOpen(false);
    form.reset();
  }

  async function handleSubmit(values: ClientCreate) {
    toast.promise(async () => await handleClientCreate(values), {
      loading: 'Creating client...',
      success: 'Client created successfully',
      error: 'Could not create client',
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='grid grid-cols-1 gap-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ex: Cool Company' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contactName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ex: Cool Contact' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ex: 1234567890' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ex: company@email.com' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ex: Company Address' />
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
