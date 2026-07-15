import { pgTable, serial, integer, numeric, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coinBundlesTable = pgTable("coin_bundles", {
  id:               serial("id").primaryKey(),
  coinsAmount:      integer("coins_amount").notNull(),
  priceBdt:         numeric("price_bdt", { precision: 10, scale: 2 }).notNull(),
  originalPriceBdt: numeric("original_price_bdt", { precision: 10, scale: 2 }),
  discountPercent:  integer("discount_percent"),
  label:            text("label").notNull(),
  isActive:         boolean("is_active").notNull().default(true),
  sortOrder:        integer("sort_order").notNull().default(0),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
});

export const insertCoinBundleSchema = createInsertSchema(coinBundlesTable).omit({ id: true, createdAt: true });
export type InsertCoinBundle = z.infer<typeof insertCoinBundleSchema>;
export type CoinBundle = typeof coinBundlesTable.$inferSelect;
