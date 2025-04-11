import { z } from 'zod';

export const LlmSendMessageSchema = z.object({
  prompt: z.string().trim().min(1, 'Required'),
});

export type LlmSendMessageType = z.infer<typeof LlmSendMessageSchema>;

export const LLM_SEND_MESSAGE_DEFAULT: Partial<LlmSendMessageType> = {
  prompt: '',
};
