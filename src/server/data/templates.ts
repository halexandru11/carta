import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '../db';
import { templates } from '../db/schema';

export async function templatesGetAll() {
  return await db.select().from(templates);
}

export async function templateGet(id: number) {
  return (await db.select().from(templates).where(eq(templates.id, id)).limit(1))[0];
}
