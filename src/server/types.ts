import { type InferSelectModel } from 'drizzle-orm';

import { clients, documents, templates } from './db/schema';

export type DocumentType = InferSelectModel<typeof documents>;
export type TemplateType = InferSelectModel<typeof templates>;
export type ClientType = InferSelectModel<typeof clients>;
