'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Textarea } from '~/components/ui/textarea';
import { $getRoot, $insertNodes, createCommand, LexicalCommand } from 'lexical';
import { SendIcon, SparklesIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { LLM_SEND_MESSAGE_DEFAULT, LlmSendMessageSchema, LlmSendMessageType } from './schema';

export const INSERT_PAGE_BREAK: LexicalCommand<undefined> = createCommand();

export function LlmPlugin() {
  const [editor] = useLexicalComposerContext();

  const form = useForm<LlmSendMessageType>({
    resolver: zodResolver(LlmSendMessageSchema),
    defaultValues: LLM_SEND_MESSAGE_DEFAULT,
  });

  // const promptWatch = form.watch('prompt');

  async function handleSubmit(values: LlmSendMessageType) {
    console.info('Generating text...');

    const response = await fetch('/api/llm/generate/whole-document', {
      method: 'POST',
      body: JSON.stringify({ prompt: values.prompt }),
    });
    console.log(response);

    if (response.ok === false) {
      console.error('Something went wrong');
      return;
    }

    const json = await response.json();
    console.log(json.text);

    editor.update(() => {
      // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser();
      const dom = parser.parseFromString(json.text, 'text/html');

      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom);

      // Select the root
      $getRoot().select();

      // Insert them at a selection.
      $insertNodes(nodes);
    });

    console.info('AI has finished');
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='rounded'
          variant={form.formState.isSubmitting ? 'primary' : 'outline-primary'}
          className='fixed bottom-2 right-2 z-10'
        >
          <SparklesIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent side='left' align='end' className='w-96 bg-mantle'>
        <div className='mb-6 flex items-center gap-x-2'>
          <SparklesIcon className='text-primary' />
          <p className='text-lg font-semibold'>How can I help you?</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='grid grid-cols-1 gap-y-3'>
            <FormField
              name='prompt'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Generate a short contract for buying a house'
                      className='min-h-20'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='ml-auto'
              disabled={form.formState.isSubmitting || form.formState.isValid === false}
            >
              Send
              <SendIcon />
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
