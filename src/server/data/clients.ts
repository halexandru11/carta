import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '../db';
import { clients } from '../db/schema';

export async function clientsGetAll() {
  return await db.select().from(clients);
}

export async function clientGet(id: number) {
  return (await db.select().from(clients).where(eq(clients.id, id)).limit(1))[0];
}
