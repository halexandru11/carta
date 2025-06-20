'use server';

import { revalidatePath } from 'next/cache';
import {
  DocumentCreate,
  documentCreateSchema,
  DocumentDelete,
  documentDeleteSchema,
  DocumentUpdate,
  documentUpdateSchema,
} from '~/schemas/documents';
import { eq } from 'drizzle-orm';

import { documentGet } from '../data/documents';
import { db } from '../db';
import { documents } from '../db/schema';

export async function documentCreate(payload: DocumentCreate) {
  const { success, data } = documentCreateSchema.safeParse(payload);

  if (success) {
    const createdDoc = await db.insert(documents).values(data).returning({ id: documents.id });
    revalidatePath('/documents');
    revalidatePath('/documents/[documentId]', 'page');
    return createdDoc[0]?.id;
  }
}

export async function documentClone(originalDocId: number) {
  const originalDoc = await documentGet(originalDocId);
  if (originalDoc) {
    const createdDoc = await db
      .insert(documents)
      .values({
        title: originalDoc.title + ' (clone)',
        content: originalDoc.content,
      })
      .returning({ id: documents.id });

    revalidatePath('/documents');
    revalidatePath('/documents/[documentId]', 'page');
    return createdDoc[0]?.id;
  }
}

export async function documentUpdate(payload: DocumentUpdate) {
  const { success, data } = documentUpdateSchema.safeParse(payload);

  if (success) {
    await db.update(documents).set(payload).where(eq(documents.id, data.id));
    revalidatePath('/documents');
  }
}

export async function documentDelete(payload: DocumentDelete) {
  const { success, data } = documentDeleteSchema.safeParse(payload);

  if (success) {
    await db.delete(documents).where(eq(documents.id, data.id));
    revalidatePath('/documents');
  }
}
