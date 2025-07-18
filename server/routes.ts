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
import {
  createPaymentRecord,
  createStripePaymentSession,
  completePayment,
  failPayment,
  getPaymentRecord,
  getPaymentByApplicationId,
  getAllPayments,
  processRefund,
  getPaymentAnalytics,
  calculatePermitFees
} from "./payments";
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

  // AI System Metrics endpoint
  app.get("/api/ai-metrics", authMiddleware, async (req, res) => {
    try {
      const applications = getAllPermitApplications();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const todayApplications = applications.filter(app => 
        new Date(app.createdAt) >= today
      );
      
      const approvedToday = applications.filter(app => 
        app.status === "approved" && new Date(app.updatedAt) >= today
      ).length;
      
      const processingToday = todayApplications.filter(app => 
        app.status === "under_review" || app.status === "documents_uploaded"
      ).length;
      
      // Calculate average processing time (mock data for demo)
      const completedApps = applications.filter(app => 
        app.status === "approved" || app.status === "denied"
      );
      
      const totalProcessingTime = completedApps.reduce((sum, app) => {
        const created = new Date(app.createdAt);
        const updated = new Date(app.updatedAt);
        return sum + (updated.getTime() - created.getTime());
      }, 0);
      
      const averageProcessingTime = completedApps.length > 0 
        ? totalProcessingTime / completedApps.length / (1000 * 60 * 60) // hours
        : 0;
      
      const metrics = {
        totalApplications: applications.length,
        processingToday,
        approvedToday,
        averageProcessingTime: Math.round(averageProcessingTime * 10) / 10,
        aiAccuracyRate: 0.973, // Mock high accuracy rate
        humanInterventionRate: 0.18, // Mock low intervention rate
        systemLoad: Math.random() * 0.3 + 0.4 // Mock system load 40-70%
      };
      
      res.status(200).json({ success: true, metrics });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // AI Control endpoint for admin actions
  app.post("/api/ai-control", authMiddleware, async (req, res) => {
    try {
      const { action, applicationId } = req.body;
      
      // Simulate AI control actions
      let result = "";
      
      switch (action) {
        case "reprocess_failed":
          result = "Reprocessing 3 failed applications with updated AI models";
          break;
        case "optimize_models":
          result = "AI models optimized successfully. Performance improved by 2.3%";
          break;
        case "clear_cache":
          result = "System cache cleared. Performance refreshed";
          break;
        case "priority_process":
          if (applicationId) {
            result = `Application ${applicationId} moved to priority queue`;
          }
          break;
        default:
          result = "Action completed successfully";
      }
      
      res.status(200).json({ success: true, message: result });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // === PAYMENT PROCESSING ROUTES ===
  
  // Calculate permit fees
  app.post("/api/permit-fees/calculate", async (req, res) => {
    try {
      const { permitType, projectType, estimatedCost, expedited } = req.body;
      
      const cost = parseInt(estimatedCost) || 0;
      const feeBreakdown = calculatePermitFees(permitType, projectType, cost, expedited || false);
      
      res.status(200).json({
        success: true,
        fees: feeBreakdown,
        formatted: {
          baseFee: `$${(feeBreakdown.baseFee / 100).toFixed(2)}`,
          processingFee: `$${(feeBreakdown.processingFee / 100).toFixed(2)}`,
          inspectionFee: `$${(feeBreakdown.inspectionFee / 100).toFixed(2)}`,
          expediteFee: feeBreakdown.expediteFee ? `$${(feeBreakdown.expediteFee / 100).toFixed(2)}` : null,
          total: `$${(feeBreakdown.total / 100).toFixed(2)}`
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Create payment for permit application
  app.post("/api/permit-applications/:id/payment", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { expedited } = req.body;
      
      const application = getPermitApplication(applicationId);
      if (!application) {
        return res.status(404).json({ success: false, error: "Application not found" });
      }
      
      // Check if payment already exists
      const existingPayment = getPaymentByApplicationId(applicationId);
      if (existingPayment) {
        return res.status(400).json({ 
          success: false, 
          error: "Payment already exists for this application",
          payment: existingPayment
        });
      }
      
      const estimatedCost = parseInt(application.estimatedCost) || 0;
      const payment = createPaymentRecord(
        applicationId,
        application.permitType,
        application.projectType,
        estimatedCost,
        expedited || false
      );
      
      res.status(201).json({
        success: true,
        message: "Payment record created successfully",
        payment,
        formatted: {
          total: `$${(payment.amount / 100).toFixed(2)}`
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Create Stripe checkout session
  app.post("/api/payments/:id/checkout", async (req, res) => {
    try {
      const paymentId = req.params.id;
      const payment = getPaymentRecord(paymentId);
      
      if (!payment) {
        return res.status(404).json({ success: false, error: "Payment not found" });
      }
      
      if (payment.status !== 'pending') {
        return res.status(400).json({ 
          success: false, 
          error: `Payment is already ${payment.status}` 
        });
      }
      
      const successUrl = `${req.headers.origin}/payment/success?payment_id=${paymentId}`;
      const cancelUrl = `${req.headers.origin}/payment/cancel?payment_id=${paymentId}`;
      
      const session = await createStripePaymentSession(payment, successUrl, cancelUrl);
      
      res.status(200).json({
        success: true,
        sessionId: session.sessionId,
        checkoutUrl: session.url
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Handle payment success webhook (would be called by Stripe)
  app.post("/api/payments/:id/success", async (req, res) => {
    try {
      const paymentId = req.params.id;
      const { paymentIntentId } = req.body;
      
      const payment = completePayment(paymentId, paymentIntentId);
      if (!payment) {
        return res.status(404).json({ success: false, error: "Payment not found" });
      }
      
      res.status(200).json({
        success: true,
        message: "Payment completed successfully",
        payment
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Handle payment failure
  app.post("/api/payments/:id/failed", async (req, res) => {
    try {
      const paymentId = req.params.id;
      
      const payment = failPayment(paymentId);
      if (!payment) {
        return res.status(404).json({ success: false, error: "Payment not found" });
      }
      
      res.status(200).json({
        success: true,
        message: "Payment marked as failed",
        payment
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Get payment details
  app.get("/api/payments/:id", async (req, res) => {
    try {
      const paymentId = req.params.id;
      const payment = getPaymentRecord(paymentId);
      
      if (!payment) {
        return res.status(404).json({ success: false, error: "Payment not found" });
      }
      
      res.status(200).json({
        success: true,
        payment,
        formatted: {
          total: `$${(payment.amount / 100).toFixed(2)}`,
          baseFee: `$${(payment.feeBreakdown.baseFee / 100).toFixed(2)}`,
          processingFee: `$${(payment.feeBreakdown.processingFee / 100).toFixed(2)}`,
          inspectionFee: `$${(payment.feeBreakdown.inspectionFee / 100).toFixed(2)}`,
          expediteFee: payment.feeBreakdown.expediteFee 
            ? `$${(payment.feeBreakdown.expediteFee / 100).toFixed(2)}` 
            : null
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Get payment by application ID
  app.get("/api/permit-applications/:id/payment", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const payment = getPaymentByApplicationId(applicationId);
      
      if (!payment) {
        return res.status(404).json({ success: false, error: "No payment found for this application" });
      }
      
      res.status(200).json({
        success: true,
        payment,
        formatted: {
          total: `$${(payment.amount / 100).toFixed(2)}`
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Admin: Get all payments
  app.get("/api/payments", authMiddleware, async (req, res) => {
    try {
      const payments = getAllPayments();
      
      res.status(200).json({
        success: true,
        payments: payments.map(payment => ({
          ...payment,
          formatted: {
            total: `$${(payment.amount / 100).toFixed(2)}`
          }
        }))
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Admin: Process refund
  app.post("/api/payments/:id/refund", authMiddleware, async (req, res) => {
    try {
      const paymentId = req.params.id;
      const { amount } = req.body;
      
      const payment = await processRefund(paymentId, amount);
      if (!payment) {
        return res.status(404).json({ 
          success: false, 
          error: "Payment not found or cannot be refunded" 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        payment
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });
  
  // Admin: Get payment analytics
  app.get("/api/payments/analytics", authMiddleware, async (req, res) => {
    try {
      const analytics = getPaymentAnalytics();
      
      res.status(200).json({
        success: true,
        analytics: {
          ...analytics,
          formatted: {
            totalRevenue: `$${(analytics.totalRevenue / 100).toLocaleString()}`,
            monthlyRevenue: `$${(analytics.monthlyRevenue / 100).toLocaleString()}`,
            averageTransactionValue: `$${(analytics.averageTransactionValue / 100).toFixed(2)}`
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}