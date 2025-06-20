import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '../db';
import { documents } from '../db/schema';

export async function documentsGetAll() {
  return await db.select().from(documents);
}

export async function documentGet(id: number) {
  return (await db.select().from(documents).where(eq(documents.id, id)).limit(1))[0];
}
