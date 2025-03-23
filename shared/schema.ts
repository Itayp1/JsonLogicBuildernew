import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const jsonLogicExpressions = pgTable("jsonLogicExpressions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  expression: jsonb("expression").notNull(),
  createdAt: text("createdAt").notNull().default(new Date().toISOString()),
  userId: integer("userId").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertJsonLogicExpressionSchema = createInsertSchema(jsonLogicExpressions).pick({
  name: true,
  expression: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertJsonLogicExpression = z.infer<typeof insertJsonLogicExpressionSchema>;
export type JsonLogicExpression = typeof jsonLogicExpressions.$inferSelect;
