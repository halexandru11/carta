'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import { DocumentCreate, documentCreateSchema } from '~/schemas/documents';
import { documentCreate } from '~/server/actions/documents';
import { ClientType, TemplateType } from '~/server/types';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateDocumentDialogProps = {
  templates: TemplateType[];
  clients: ClientType[];
  children: React.ReactNode;
};

export function CreateDocumentDialog(props: CreateDocumentDialogProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const form = useForm<DocumentCreate>({
    resolver: zodResolver(documentCreateSchema),
    defaultValues: {
      title: '',
      content: '',
      clientId: undefined,
      templateId: undefined,
    },
  });

  async function handleDocumentCreate(values: DocumentCreate) {
    const docId = await documentCreate(values);
    if (docId !== undefined) {
      router.push(`/documents/${docId}`);
    }
    setDialogOpen(false);
  }

  async function handleSubmit(values: DocumentCreate) {
    toast.promise(async () => await handleDocumentCreate(values), {
      loading: 'Creating document...',
      success: 'Document created successfully',
      error: 'Could not create document',
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <FormField
              control={form.control}
              name='clientId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Client</FormLabel>
                  <Popover open={clientOpen} onOpenChange={setClientOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline-secondary'
                          role='combobox'
                          className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? (
                            <div className='space-x-2'>
                              <span>
                                {
                                  props.clients.find(
                                    (client) => client.id.toString() === field.value,
                                  )?.companyName
                                }
                              </span>
                              <span>|</span>
                              <span className='text-xs text-subtext0'>
                                {
                                  props.clients.find(
                                    (client) => client.id.toString() === field.value,
                                  )?.contactName
                                }
                              </span>
                            </div>
                          ) : (
                            'Select client'
                          )}
                          <ChevronsUpDownIcon className='opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <Command>
                        <CommandInput placeholder='Search client...' className='h-9' />
                        <CommandList>
                          <CommandEmpty>No client found.</CommandEmpty>
                          <CommandGroup>
                            {props.clients.map((client) => (
                              <CommandItem
                                value={
                                  (client.companyName ?? '') +
                                  (client.contactName ?? '') +
                                  client.id
                                }
                                key={client.id}
                                onSelect={() => {
                                  form.setValue('clientId', client.id.toString());
                                  setClientOpen(false);
                                }}
                              >
                                <div>
                                  <p>{client.companyName}</p>
                                  <p className='text-xs text-subtext0'>{client.contactName}</p>
                                </div>
                                <CheckIcon
                                  className={cn(
                                    'ml-auto',
                                    client.id.toString() === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='templateId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Template</FormLabel>
                  <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline-secondary'
                          role='combobox'
                          className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value
                            ? props.templates.find(
                                (template) => template.id.toString() === field.value,
                              )?.title
                            : 'Select template'}
                          <ChevronsUpDownIcon className='opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <Command>
                        <CommandInput placeholder='Search template...' className='h-9' />
                        <CommandList>
                          <CommandEmpty>No template found.</CommandEmpty>
                          <CommandGroup>
                            {props.templates.map((template) => (
                              <CommandItem
                                value={(template.title ?? '') + template.id}
                                key={template.id}
                                onSelect={() => {
                                  form.setValue('templateId', template.id.toString());
                                  setTemplateOpen(false);
                                }}
                              >
                                {template.title}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto',
                                    template.id.toString() === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>This is the template used for the document.</FormDescription>
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
