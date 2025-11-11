// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm'
import { pgTableCreator } from 'drizzle-orm/pg-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(name => `a3_${name}`)

export const assignments = createTable('assignment', d => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  territoryId: d.varchar({ length: 256 }).notNull(),
  name: d.varchar({ length: 256 }).notNull(),
  date: d.timestamp({ withTimezone: true }).notNull(),
  out: d.boolean().notNull(),
}))
