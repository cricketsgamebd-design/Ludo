import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id:           serial("id").primaryKey(),
  username:     text("username").notNull().unique(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  coins:        integer("coins").notNull().default(0),
  level:        integer("level").notNull().default(1),
  inviteCode:   text("invite_code").notNull().unique(),
  invitedById:  integer("invited_by_id"),
  isAdmin:      boolean("is_admin").notNull().default(false),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
