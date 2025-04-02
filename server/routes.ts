import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertQuickQuoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.status(201).json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // Quick quote submission endpoint
  app.post("/api/quick-quotes", async (req, res) => {
    try {
      const quoteData = insertQuickQuoteSchema.parse(req.body);
      const quote = await storage.createQuickQuote(quoteData);
      res.status(201).json({ success: true, quote });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // Get all leads - admin endpoint (would have auth in production)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.status(200).json({ leads });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get all quick quotes - admin endpoint (would have auth in production)
  app.get("/api/quick-quotes", async (req, res) => {
    try {
      const quotes = await storage.getAllQuickQuotes();
      res.status(200).json({ quotes });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
