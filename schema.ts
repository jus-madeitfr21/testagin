import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New schema for proxy history
export const proxyHistory = pgTable("proxy_history", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ip: text("ip").notNull(),
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
});

export const insertProxyHistorySchema = createInsertSchema(proxyHistory).pick({
  url: true,
  timestamp: true,
  ip: true,
  success: true,
  errorMessage: true,
});

export type InsertProxyHistory = z.infer<typeof insertProxyHistorySchema>;
export type ProxyHistory = typeof proxyHistory.$inferSelect;

// Define proxy request schema for validation
export const proxyRequestSchema = z.object({
  url: z.string().url(),
});

export type ProxyRequest = z.infer<typeof proxyRequestSchema>;
