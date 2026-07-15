import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { coinBundlesTable } from "./coin_bundles";

export const purchasesTable = pgTable("purchases", {
  id:          serial("id").primaryKey(),
  userId:      integer("user_id").notNull().references(() => usersTable.id),
  bundleId:    integer("bundle_id").notNull().references(() => coinBundlesTable.id),
  coinsAmount: integer("coins_amount").notNull(),
  pricePaid:   numeric("price_paid", { precision: 10, scale: 2 }).notNull(),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
});

export const insertPurchaseSchema = createInsertSchema(purchasesTable).omit({ id: true, createdAt: true });
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchasesTable.$inferSelect;
