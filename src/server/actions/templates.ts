'use server';

import { revalidatePath } from 'next/cache';
import {
  TemplateCreate,
  templateCreateSchema,
  TemplateDelete,
  templateDeleteSchema,
  TemplateUpdate,
  templateUpdateSchema,
} from '~/schemas/templates';
import { eq } from 'drizzle-orm';

import { templateGet } from '../data/templates';
import { db } from '../db';
import { templates } from '../db/schema';

export async function templateCreate(payload: TemplateCreate) {
  const { success, data } = templateCreateSchema.safeParse(payload);

  if (success) {
    const createdTemplate = await db.insert(templates).values(data).returning({ id: templates.id });
    revalidatePath('/templates');
    revalidatePath('/templates/[templateId]', 'page');
    return createdTemplate[0]?.id;
  }
}

export async function templateClone(originalTemplateId: number) {
  const originalTemplate = await templateGet(originalTemplateId);
  if (originalTemplate) {
    const createdTemplate = await db
      .insert(templates)
      .values({
        title: originalTemplate.title + ' (clone)',
        content: originalTemplate.content,
      })
      .returning({ id: templates.id });

    revalidatePath('/templates');
    revalidatePath('/templates/[templateId]', 'page');
    return createdTemplate[0]?.id;
  }
}

export async function templateUpdate(payload: TemplateUpdate) {
  const { success, data } = templateUpdateSchema.safeParse(payload);

  if (success) {
    await db.update(templates).set(payload).where(eq(templates.id, data.id));
    revalidatePath('/templates');
  }
}

export async function templateDelete(payload: TemplateDelete) {
  const { success, data } = templateDeleteSchema.safeParse(payload);

  if (success) {
    await db.delete(templates).where(eq(templates.id, data.id));
    revalidatePath('/templates');
  }
}
