import { users, type User, type InsertUser, leads, type Lead, type InsertLead, quickQuotes, type QuickQuote, type InsertQuickQuote } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

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

export const storage = new MemStorage();
