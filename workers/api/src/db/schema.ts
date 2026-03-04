import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bonsais = sqliteTable('bonsais', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  treeData: text('tree_data', { mode: 'json' }).notNull(),
  configData: text('config_data', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type BonsaiInsert = typeof bonsais.$inferInsert;
export type BonsaiSelect = typeof bonsais.$inferSelect;
