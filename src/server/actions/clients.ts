'use server';

import { revalidatePath } from 'next/cache';
import { ClientCreate, clientCreateSchema } from '~/schemas/clients';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { clients } from '../db/schema';

export async function clientsGetAll() {
  return await db.select().from(clients);
}

export async function clientGet(id: number) {
  return (await db.select().from(clients).where(eq(clients.id, id)).limit(1))[0];
}

export async function clientCreate(payload: ClientCreate) {
  const { success, data } = clientCreateSchema.safeParse(payload);

  if (success) {
    const createdClient = await db.insert(clients).values(data).returning({ id: clients.id });
    revalidatePath('/clients');
    return createdClient[0]?.id;
  }
}
