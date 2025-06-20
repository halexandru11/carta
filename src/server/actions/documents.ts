'use server';

import { revalidatePath } from 'next/cache';
import { SUGGESTIONS } from '~/lib/constants';
import {
  DocumentCreate,
  documentCreateSchema,
  DocumentDelete,
  documentDeleteSchema,
  DocumentUpdate,
  documentUpdateSchema,
} from '~/schemas/documents';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';

import { clientGet } from '../data/clients';
import { documentGet } from '../data/documents';
import { templateGet } from '../data/templates';
import { db } from '../db';
import { documents } from '../db/schema';

export async function documentCreate(payload: DocumentCreate) {
  const { success, data } = documentCreateSchema.safeParse(payload);

  if (success) {
    const [template, client] = await Promise.all([
      templateGet(Number(data.templateId)),
      clientGet(Number(data.clientId)),
    ]);

    data.content = template?.content ?? '';

    const companyName = SUGGESTIONS[0];
    data.content = data.content.replaceAll(
      `data-placeholder-value="${companyName}"`,
      `data-placeholder-value="${client?.companyName ?? companyName}"`,
    );
    data.content = data.content.replaceAll(
      `>${companyName}<`,
      `>${client?.companyName ?? companyName}<`,
    );

    const contactName = SUGGESTIONS[1];
    data.content = data.content.replaceAll(
      `data-placeholder-value="${contactName}"`,
      `data-placeholder-value="${client?.contactName ?? contactName}"`,
    );
    data.content = data.content.replaceAll(
      `>${contactName}<`,
      `>${client?.contactName ?? contactName}<`,
    );

    const phone = SUGGESTIONS[2];
    data.content = data.content.replaceAll(
      `data-placeholder-value="${phone}"`,
      `data-placeholder-value="${client?.phone ?? phone}"`,
    );
    data.content = data.content.replaceAll(`>${phone}<`, `>${client?.phone ?? phone}<`);

    const email = SUGGESTIONS[3];
    data.content = data.content.replaceAll(
      `data-placeholder-value="${email}"`,
      `data-placeholder-value="${client?.email ?? email}"`,
    );
    data.content = data.content.replaceAll(`>${email}<`, `>${client?.email ?? email}<`);

    const address = SUGGESTIONS[4];
    data.content = data.content.replaceAll(
      `data-placeholder-value="${address}"`,
      `data-placeholder-value="${client?.address ?? address}"`,
    );
    data.content = data.content.replaceAll(`>${address}<`, `>${client?.address ?? address}<`);

    const currentDate = SUGGESTIONS[5];
    const currentDateString = format(new Date(), 'PPP');
    data.content = data.content.replaceAll(
      `data-placeholder-value="${currentDate}"`,
      `data-placeholder-value="${currentDateString}"`,
    );
    data.content = data.content.replaceAll(`>${currentDate}<`, `>${currentDateString}<`);

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
