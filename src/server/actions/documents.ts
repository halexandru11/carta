'use server';

import {
  DocumentCreate,
  documentCreateSchema,
  DocumentDelete,
  documentDeleteSchema,
  DocumentUpdate,
  documentUpdateSchema,
} from '~/schemas/documents';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { documents } from '../db/schema';
import { revalidatePath } from 'next/cache';

export async function documentsGetAll() {
  return await db.select().from(documents);
}

export async function documentsGet(id: number) {
  return await db.select().from(documents).where(eq(documents.id, id));
}

export async function documentCreate(payload: DocumentCreate) {
  const { success, data } = documentCreateSchema.safeParse(payload);

  if (success) {
    await db.insert(documents).values(data);
    revalidatePath('/documents');
    revalidatePath('/documents/[documentId]', 'page');
  }
}

export async function documentUpdate(payload: DocumentUpdate) {
  const { success, data } = documentUpdateSchema.safeParse(payload);

  if (success) {
    await db.update(documents).set(payload).where(eq(documents.id, data.id));
    revalidatePath('/documents');
    revalidatePath('/documents/[documentId]', 'page');
  }
}

export async function documentDelete(payload: DocumentDelete) {
  const { success, data } = documentDeleteSchema.safeParse(payload);

  if (success) {
    await db.delete(documents).where(eq(documents.id, data.id));
    revalidatePath('/documents');
  }
}
