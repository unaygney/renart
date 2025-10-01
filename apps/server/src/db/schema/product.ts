import { jsonb, pgTable, real, serial, text } from 'drizzle-orm/pg-core'

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  popularityScore: real('popularity_score').notNull(),
  weight: real('weight').notNull(),
  images: jsonb('images').notNull().$type<{
    yellow: string
    rose: string
    white: string
  }>(),
})

export type Product = typeof product.$inferSelect & {
  price: number
}
