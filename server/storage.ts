import { users, type User, type InsertUser, leads, type Lead, type InsertLead, quickQuotes, type QuickQuote, type InsertQuickQuote } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import "dotenv/config";

// Required for the Neon serverless driver
neonConfig.fetchConnectionCache = true;

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead methods
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  
  // Quick Quote methods
  createQuickQuote(quote: InsertQuickQuote): Promise<QuickQuote>;
  getAllQuickQuotes(): Promise<QuickQuote[]>;
}

// Create PostgreSQL client
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : undefined;
const db = sql ? drizzle(sql, { schema }) : undefined;

export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error("Database connection not established");
    const users = await db.select().from(schema.users).where(({ eq }) => eq(schema.users.id, id));
    return users[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database connection not established");
    const users = await db.select().from(schema.users).where(({ eq }) => eq(schema.users.username, username));
    return users[0];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database connection not established");
    const newUsers = await db.insert(schema.users).values(insertUser).returning();
    return newUsers[0];
  }
  
  async createLead(insertLead: InsertLead): Promise<Lead> {
    if (!db) throw new Error("Database connection not established");
    const newLeads = await db.insert(schema.leads).values({
      ...insertLead,
      createdAt: new Date()
    }).returning();
    return newLeads[0];
  }
  
  async getAllLeads(): Promise<Lead[]> {
    if (!db) throw new Error("Database connection not established");
    return await db.select().from(schema.leads).orderBy(({ desc }) => [desc(schema.leads.createdAt)]);
  }
  
  async createQuickQuote(insertQuickQuote: InsertQuickQuote): Promise<QuickQuote> {
    if (!db) throw new Error("Database connection not established");
    const newQuotes = await db.insert(schema.quickQuotes).values({
      ...insertQuickQuote,
      createdAt: new Date()
    }).returning();
    return newQuotes[0];
  }
  
  async getAllQuickQuotes(): Promise<QuickQuote[]> {
    if (!db) throw new Error("Database connection not established");
    return await db.select().from(schema.quickQuotes).orderBy(({ desc }) => [desc(schema.quickQuotes.createdAt)]);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private quickQuotes: Map<number, QuickQuote>;
  currentUserId: number;
  currentLeadId: number;
  currentQuickQuoteId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.quickQuotes = new Map();
    this.currentUserId = 1;
    this.currentLeadId = 1;
    this.currentQuickQuoteId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentLeadId++;
    const lead: Lead = { 
      ...insertLead, 
      id, 
      createdAt: new Date() 
    };
    this.leads.set(id, lead);
    return lead;
  }
  
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }
  
  // Quick Quote methods
  async createQuickQuote(insertQuickQuote: InsertQuickQuote): Promise<QuickQuote> {
    const id = this.currentQuickQuoteId++;
    const quickQuote: QuickQuote = {
      ...insertQuickQuote,
      id,
      createdAt: new Date()
    };
    this.quickQuotes.set(id, quickQuote);
    return quickQuote;
  }
  
  async getAllQuickQuotes(): Promise<QuickQuote[]> {
    return Array.from(this.quickQuotes.values());
  }
}

// Use PostgreSQL storage if DATABASE_URL is available, otherwise use memory storage
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();
