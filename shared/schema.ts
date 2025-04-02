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

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceType: text("service_type").notNull(),
  projectLocation: text("project_location"),
  projectTimeline: text("project_timeline"),
  projectDescription: text("project_description"),
  injuryType: text("injury_type"),
  injuryDate: text("injury_date"),
  injuryDescription: text("injury_description"),
  howHeard: text("how_heard"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  phone: true,
  serviceType: true,
  projectLocation: true,
  projectTimeline: true,
  projectDescription: true,
  injuryType: true,
  injuryDate: true,
  injuryDescription: true,
  howHeard: true,
});

export const quickQuotes = pgTable("quick_quotes", {
  id: serial("id").primaryKey(),
  permitType: text("permit_type").notNull(),
  timeline: text("timeline").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuickQuoteSchema = createInsertSchema(quickQuotes).pick({
  permitType: true,
  timeline: true,
  email: true,
  phone: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertQuickQuote = z.infer<typeof insertQuickQuoteSchema>;
export type QuickQuote = typeof quickQuotes.$inferSelect;
