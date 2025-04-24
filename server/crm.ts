// CRM integration for lead management
import { Lead, QuickQuote } from "@shared/schema";

// CRM Lead Status enum
export enum CrmLeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  PROPOSAL = "proposal",
  CLOSED_WON = "closed_won",
  CLOSED_LOST = "closed_lost",
}

// CRM Lead interface that extends our base Lead with additional CRM-specific fields
export interface CrmLead extends Lead {
  status: CrmLeadStatus;
  notes: string[];
  lastContactDate?: Date;
  assignedTo?: string;
  estimatedValue?: number;
}

// CRM Quick Quote interface that extends our base QuickQuote with additional CRM fields
export interface CrmQuickQuote extends QuickQuote {
  status: CrmLeadStatus;
  notes: string[];
  lastContactDate?: Date;
  assignedTo?: string;
  estimatedValue?: number;
}

// In-memory CRM data stores (would connect to a proper CRM API in production)
const crmLeads: Map<number, CrmLead> = new Map();
const crmQuickQuotes: Map<number, CrmQuickQuote> = new Map();

/**
 * Adds a lead to the CRM system
 */
export function addLeadToCrm(lead: Lead): CrmLead {
  const crmLead: CrmLead = {
    ...lead,
    status: CrmLeadStatus.NEW,
    notes: [],
    lastContactDate: new Date(),
  };
  crmLeads.set(lead.id, crmLead);
  return crmLead;
}

/**
 * Adds a quick quote to the CRM system
 */
export function addQuickQuoteToCrm(quote: QuickQuote): CrmQuickQuote {
  const crmQuickQuote: CrmQuickQuote = {
    ...quote,
    status: CrmLeadStatus.NEW,
    notes: [],
    lastContactDate: new Date(),
  };
  crmQuickQuotes.set(quote.id, crmQuickQuote);
  return crmQuickQuote;
}

/**
 * Returns all leads in the CRM
 */
export function getAllCrmLeads(): CrmLead[] {
  return Array.from(crmLeads.values());
}

/**
 * Returns all quick quotes in the CRM
 */
export function getAllCrmQuickQuotes(): CrmQuickQuote[] {
  return Array.from(crmQuickQuotes.values());
}

/**
 * Updates a lead in the CRM
 */
export function updateCrmLead(id: number, updates: Partial<CrmLead>): CrmLead | null {
  const lead = crmLeads.get(id);
  if (!lead) return null;
  
  const updatedLead = { ...lead, ...updates };
  
  // If we're adding a note, append to the existing notes array
  if (updates.notes && updates.notes.length > 0) {
    updatedLead.notes = [...lead.notes, ...updates.notes];
  }
  
  crmLeads.set(id, updatedLead);
  return updatedLead;
}

/**
 * Updates a quick quote in the CRM
 */
export function updateCrmQuickQuote(id: number, updates: Partial<CrmQuickQuote>): CrmQuickQuote | null {
  const quote = crmQuickQuotes.get(id);
  if (!quote) return null;
  
  const updatedQuote = { ...quote, ...updates };
  
  // If we're adding a note, append to the existing notes array
  if (updates.notes && updates.notes.length > 0) {
    updatedQuote.notes = [...quote.notes, ...updates.notes];
  }
  
  crmQuickQuotes.set(id, updatedQuote);
  return updatedQuote;
}

/**
 * Gets a specific lead from the CRM by ID
 */
export function getCrmLeadById(id: number): CrmLead | null {
  return crmLeads.get(id) || null;
}

/**
 * Gets a specific quick quote from the CRM by ID
 */
export function getCrmQuickQuoteById(id: number): CrmQuickQuote | null {
  return crmQuickQuotes.get(id) || null;
}

/**
 * Deletes a lead from the CRM
 */
export function deleteCrmLead(id: number): boolean {
  return crmLeads.delete(id);
}

/**
 * Deletes a quick quote from the CRM
 */
export function deleteCrmQuickQuote(id: number): boolean {
  return crmQuickQuotes.delete(id);
}

/**
 * Get leads filtered by status
 */
export function getLeadsByStatus(status: CrmLeadStatus): CrmLead[] {
  return Array.from(crmLeads.values()).filter(lead => lead.status === status);
}

/**
 * Get quick quotes filtered by status
 */
export function getQuickQuotesByStatus(status: CrmLeadStatus): CrmQuickQuote[] {
  return Array.from(crmQuickQuotes.values()).filter(quote => quote.status === status);
}