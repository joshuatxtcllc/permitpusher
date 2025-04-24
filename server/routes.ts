import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertQuickQuoteSchema } from "@shared/schema";
import { 
  addLeadToCrm, 
  addQuickQuoteToCrm, 
  getAllCrmLeads, 
  getAllCrmQuickQuotes, 
  getCrmLeadById, 
  getCrmQuickQuoteById,
  updateCrmLead,
  updateCrmQuickQuote,
  CrmLeadStatus
} from "./crm";
import { 
  createPermitApplication, 
  getPermitApplication, 
  getAllPermitApplications,
  addDocumentToApplication,
  resubmitDocument,
  DocumentType,
  generateNextSteps
} from "./permitAI";
import { z } from "zod";

// Simple auth middleware for admin routes - would be more robust in production
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // In a real app, you would check for a valid authentication token
  // For demo purposes, we're letting all requests through
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Add the lead to CRM system automatically
      const crmLead = addLeadToCrm(lead);
      
      res.status(201).json({ success: true, lead: crmLead });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // Quick quote submission endpoint
  app.post("/api/quick-quotes", async (req, res) => {
    try {
      const quoteData = insertQuickQuoteSchema.parse(req.body);
      const quote = await storage.createQuickQuote(quoteData);
      
      // Add the quick quote to CRM system automatically
      const crmQuote = addQuickQuoteToCrm(quote);
      
      res.status(201).json({ success: true, quote: crmQuote });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Enhanced AI-powered permit application endpoints
  
  // Create a new permit application
  app.post("/api/permit-applications", async (req, res) => {
    try {
      const applicationData = req.body;
      const application = createPermitApplication(applicationData);
      
      res.status(201).json({ 
        success: true, 
        message: "Permit application created successfully",
        applicationId: application.id,
        application,
        requiredDocuments: application.requiredDocuments,
        nextSteps: generateNextSteps(application.id)
      });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Get permit application status
  app.get("/api/permit-applications/:id", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const application = getPermitApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ success: false, error: "Application not found" });
      }
      
      res.status(200).json({
        success: true,
        application,
        nextSteps: generateNextSteps(application.id)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Get all permit applications (admin endpoint)
  app.get("/api/permit-applications", authMiddleware, async (req, res) => {
    try {
      const applications = getAllPermitApplications();
      res.status(200).json({ success: true, applications });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Document upload endpoint
  app.post("/api/permit-applications/:id/documents", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { documentType, fileName, mimeType, fileSize } = req.body;
      
      // Validate input
      const docType = documentType as DocumentType;
      
      // In a real application, we would handle file upload here
      // For this demo, we're just simulating document processing
      
      const document = addDocumentToApplication(
        applicationId,
        docType,
        fileName,
        mimeType,
        fileSize
      );
      
      if (!document) {
        return res.status(404).json({ success: false, error: "Application not found" });
      }
      
      res.status(201).json({
        success: true,
        message: "Document uploaded successfully. AI analysis in progress...",
        documentId: document.documentId,
        status: document.status
      });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Document resubmission endpoint
  app.put("/api/permit-applications/:applicationId/documents/:documentId", async (req, res) => {
    try {
      const { applicationId, documentId } = req.params;
      const { fileName, mimeType, fileSize } = req.body;
      
      // In a real application, we would handle file upload here
      // For this demo, we're just simulating document processing
      
      const document = resubmitDocument(
        applicationId,
        documentId,
        fileName,
        mimeType,
        fileSize
      );
      
      if (!document) {
        return res.status(404).json({ success: false, error: "Application or document not found" });
      }
      
      res.status(200).json({
        success: true,
        message: "Document resubmitted successfully. AI analysis in progress...",
        documentId: document.documentId,
        status: document.status
      });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });

  // === CRM ROUTES ===
  
  // Get all leads from CRM - admin endpoint
  app.get("/api/crm/leads", authMiddleware, async (req, res) => {
    try {
      const status = req.query.status as CrmLeadStatus | undefined;
      const leads = getAllCrmLeads();
      
      // Filter by status if provided
      const filteredLeads = status 
        ? leads.filter(lead => lead.status === status)
        : leads;
        
      res.status(200).json({ leads: filteredLeads });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get all quick quotes from CRM - admin endpoint
  app.get("/api/crm/quick-quotes", authMiddleware, async (req, res) => {
    try {
      const status = req.query.status as CrmLeadStatus | undefined;
      const quotes = getAllCrmQuickQuotes();
      
      // Filter by status if provided
      const filteredQuotes = status 
        ? quotes.filter(quote => quote.status === status)
        : quotes;
        
      res.status(200).json({ quotes: filteredQuotes });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
  
  // Get a specific lead from CRM by ID
  app.get("/api/crm/leads/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const lead = getCrmLeadById(id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      res.status(200).json({ lead });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
  
  // Get a specific quick quote from CRM by ID
  app.get("/api/crm/quick-quotes/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const quote = getCrmQuickQuoteById(id);
      if (!quote) {
        return res.status(404).json({ error: "Quick quote not found" });
      }
      
      res.status(200).json({ quote });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
  
  // Update a lead in the CRM
  app.patch("/api/crm/leads/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      // Validate the update payload
      const updateSchema = z.object({
        status: z.enum([
          CrmLeadStatus.NEW,
          CrmLeadStatus.CONTACTED,
          CrmLeadStatus.QUALIFIED,
          CrmLeadStatus.PROPOSAL,
          CrmLeadStatus.CLOSED_WON,
          CrmLeadStatus.CLOSED_LOST
        ]).optional(),
        notes: z.array(z.string()).optional(),
        lastContactDate: z.string().optional(),
        assignedTo: z.string().optional(),
        estimatedValue: z.number().optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      
      // Handle date conversion if provided
      if (updateData.lastContactDate) {
        const lastContactDate = new Date(updateData.lastContactDate);
        updateData.lastContactDate = lastContactDate as any;
      }
      
      const updated = updateCrmLead(id, updateData as any);
      if (!updated) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      res.status(200).json({ lead: updated });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });
  
  // Update a quick quote in the CRM
  app.patch("/api/crm/quick-quotes/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      // Validate the update payload
      const updateSchema = z.object({
        status: z.enum([
          CrmLeadStatus.NEW,
          CrmLeadStatus.CONTACTED,
          CrmLeadStatus.QUALIFIED,
          CrmLeadStatus.PROPOSAL,
          CrmLeadStatus.CLOSED_WON,
          CrmLeadStatus.CLOSED_LOST
        ]).optional(),
        notes: z.array(z.string()).optional(),
        lastContactDate: z.string().optional(),
        assignedTo: z.string().optional(),
        estimatedValue: z.number().optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      
      // Handle date conversion if provided
      if (updateData.lastContactDate) {
        const lastContactDate = new Date(updateData.lastContactDate);
        updateData.lastContactDate = lastContactDate as any;
      }
      
      const updated = updateCrmQuickQuote(id, updateData as any);
      if (!updated) {
        return res.status(404).json({ error: "Quick quote not found" });
      }
      
      res.status(200).json({ quote: updated });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });
  
  // For backward compatibility - now returns CRM enhanced data
  app.get("/api/leads", authMiddleware, async (req, res) => {
    try {
      const crmLeads = getAllCrmLeads();
      res.status(200).json({ leads: crmLeads });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // For backward compatibility - now returns CRM enhanced data
  app.get("/api/quick-quotes", authMiddleware, async (req, res) => {
    try {
      const crmQuotes = getAllCrmQuickQuotes();
      res.status(200).json({ quotes: crmQuotes });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}