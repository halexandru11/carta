// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { InferSelectModel } from 'drizzle-orm';
import { index, int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `carta_${name}`);

export const documents = createTable(
  'documents',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title', { length: 64 }),
    content: text('content'),
    createdAt: int('created_at', { mode: 'timestamp' }).default(new Date()).notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .default(new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (document) => ({
    titleIndex: index('title_idx').on(document.title),
  }),
);

export const templates = createTable(
  'templates',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title', { length: 64 }),
    content: text('content'),
    createdAt: int('created_at', { mode: 'timestamp' }).default(new Date()).notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .default(new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (template) => ({
    titleIndex: index('template_title_idx').on(template.title),
  }),
);

export const clients = createTable(
  'clients',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    companyName: text('company_name'),
    contactName: text('contact_name'),
    phone: text('phone'),
    email: text('email'),
    address: text('address'),
    createdAt: int('created_at', { mode: 'timestamp' }).default(new Date()).notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' })
      .default(new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (clients) => ({
    clientIndex: index('client_idx').on(clients.companyName, clients.contactName)
  }),
);

export type Document = InferSelectModel<typeof documents>;
