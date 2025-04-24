// AI-powered permit application processing system
import { z } from "zod";

// Application status
export enum ApplicationStatus {
  DRAFT = "draft",
  DOCUMENTS_PENDING = "documents_pending",
  DOCUMENTS_UPLOADED = "documents_uploaded",
  UNDER_REVIEW = "under_review",
  NEEDS_CORRECTION = "needs_correction",
  READY_FOR_APPROVAL = "ready_for_approval", 
  APPROVED = "approved",
  DENIED = "denied"
}

// Document analysis results
export enum DocumentAnalysisStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_CORRECTION = "needs_correction"
}

// Document types that may be required for permits
export enum DocumentType {
  ARCHITECTURAL_DRAWING = "architectural_drawing",
  SITE_PLAN = "site_plan",
  STRUCTURAL_PLANS = "structural_plans",
  ELECTRICAL_PLANS = "electrical_plans",
  PLUMBING_PLANS = "plumbing_plans",
  MECHANICAL_PLANS = "mechanical_plans",
  PROPERTY_SURVEY = "property_survey",
  PLOT_PLAN = "plot_plan",
  CONSTRUCTION_DETAILS = "construction_details",
  ENERGY_CALCULATIONS = "energy_calculations",
  PERMIT_APPLICATION_FORM = "permit_application_form",
  PROPERTY_DEED = "property_deed",
  CONTRACTOR_LICENSE = "contractor_license",
  HOMEOWNER_ID = "homeowner_id",
  OTHER = "other"
}

// Document analysis result
export interface DocumentAnalysisResult {
  documentId: string;
  documentType: DocumentType;
  status: DocumentAnalysisStatus;
  fileName: string;
  uploadTimestamp: Date;
  fileSize: number;
  mimeType: string;
  issues: Array<{
    severity: "critical" | "major" | "minor" | "info";
    location?: string; // e.g., "page 3, top right"
    description: string;
    recommendation?: string;
  }>;
  confidence: number; // 0-1 score of how confident the AI is in its analysis
  pageCount?: number;
  dimensions?: {
    width: number;
    height: number;
    unit: string;
  };
  metadata?: Record<string, any>;
  lastUpdated: Date;
}

// Permit application with AI processing status
export interface PermitApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  propertyAddress: string;
  projectType: string;
  permitType: string;
  estimatedCost: string;
  projectDescription: string;
  status: ApplicationStatus;
  documents: DocumentAnalysisResult[];
  requiredDocuments: DocumentType[];
  aiComments: Array<{
    timestamp: Date;
    message: string;
  }>;
  applicationComplete: boolean;
  missingItems: string[];
  readyForHumanReview: boolean;
  siteOwnerReviewUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory database of permit applications (would be in a real database in production)
const permitApplications = new Map<string, PermitApplication>();

// Function to determine required documents based on permit and project type
export function determineRequiredDocuments(permitType: string, projectType: string): DocumentType[] {
  const required: DocumentType[] = [DocumentType.PERMIT_APPLICATION_FORM];
  
  // Base requirements by project type
  if (projectType === "residential") {
    required.push(DocumentType.PROPERTY_DEED);
    required.push(DocumentType.HOMEOWNER_ID);
  } else if (projectType === "commercial") {
    required.push(DocumentType.PROPERTY_DEED);
    required.push(DocumentType.CONTRACTOR_LICENSE);
  }
  
  // Add specific requirements by permit type
  switch (permitType) {
    case "building":
      required.push(DocumentType.ARCHITECTURAL_DRAWING);
      required.push(DocumentType.SITE_PLAN);
      required.push(DocumentType.STRUCTURAL_PLANS);
      break;
    case "electrical":
      required.push(DocumentType.ELECTRICAL_PLANS);
      required.push(DocumentType.SITE_PLAN);
      break;
    case "plumbing":
      required.push(DocumentType.PLUMBING_PLANS);
      required.push(DocumentType.SITE_PLAN);
      break;
    case "mechanical":
      required.push(DocumentType.MECHANICAL_PLANS);
      required.push(DocumentType.SITE_PLAN);
      break;
    case "demolition":
      required.push(DocumentType.SITE_PLAN);
      required.push(DocumentType.PROPERTY_SURVEY);
      break;
    case "zoning":
      required.push(DocumentType.PLOT_PLAN);
      required.push(DocumentType.PROPERTY_SURVEY);
      break;
    default:
      required.push(DocumentType.SITE_PLAN);
  }
  
  return required;
}

// Create a new permit application
export function createPermitApplication(applicationData: any): PermitApplication {
  const id = `PERMIT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  
  const requiredDocuments = determineRequiredDocuments(
    applicationData.permitType,
    applicationData.projectType
  );
  
  const application: PermitApplication = {
    id,
    applicantName: applicationData.fullName,
    applicantEmail: applicationData.email,
    applicantPhone: applicationData.phone,
    propertyAddress: applicationData.propertyAddress,
    projectType: applicationData.projectType,
    permitType: applicationData.permitType,
    estimatedCost: applicationData.estimatedCost,
    projectDescription: applicationData.projectDescription,
    status: ApplicationStatus.DRAFT,
    documents: [],
    requiredDocuments,
    aiComments: [
      {
        timestamp: new Date(),
        message: `Application created. Please upload the following required documents: ${requiredDocuments.join(", ").replace(/_/g, " ")}.`
      }
    ],
    applicationComplete: false,
    missingItems: [...requiredDocuments],
    readyForHumanReview: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  permitApplications.set(id, application);
  return application;
}

// Get a permit application by ID
export function getPermitApplication(id: string): PermitApplication | undefined {
  return permitApplications.get(id);
}

// Get all permit applications
export function getAllPermitApplications(): PermitApplication[] {
  return Array.from(permitApplications.values());
}

// Update a permit application
export function updatePermitApplication(id: string, updates: Partial<PermitApplication>): PermitApplication | undefined {
  const application = permitApplications.get(id);
  if (!application) return undefined;
  
  const updatedApplication = { ...application, ...updates, updatedAt: new Date() };
  permitApplications.set(id, updatedApplication);
  
  return updatedApplication;
}

// Add a document to a permit application
export function addDocumentToApplication(
  applicationId: string,
  documentType: DocumentType,
  fileName: string,
  mimeType: string,
  fileSize: number
): DocumentAnalysisResult | undefined {
  const application = permitApplications.get(applicationId);
  if (!application) return undefined;
  
  const documentId = `DOC-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  
  const document: DocumentAnalysisResult = {
    documentId,
    documentType,
    status: DocumentAnalysisStatus.PENDING,
    fileName,
    uploadTimestamp: new Date(),
    fileSize,
    mimeType,
    issues: [],
    confidence: 0,
    lastUpdated: new Date()
  };
  
  // Add document to application
  application.documents.push(document);
  
  // Update application status
  if (application.status === ApplicationStatus.DRAFT) {
    application.status = ApplicationStatus.DOCUMENTS_PENDING;
  }
  
  // Remove document type from missing items if it was required
  if (application.missingItems.includes(documentType)) {
    application.missingItems = application.missingItems.filter(item => item !== documentType);
  }
  
  // Update application
  application.updatedAt = new Date();
  permitApplications.set(applicationId, application);
  
  // Start document analysis (simulated)
  simulateDocumentAnalysis(applicationId, documentId);
  
  return document;
}

// Simulate AI-powered document analysis
function simulateDocumentAnalysis(applicationId: string, documentId: string): void {
  const application = permitApplications.get(applicationId);
  if (!application) return;
  
  const documentIndex = application.documents.findIndex(doc => doc.documentId === documentId);
  if (documentIndex === -1) return;
  
  const document = application.documents[documentIndex];
  
  // Update status to processing
  document.status = DocumentAnalysisStatus.PROCESSING;
  application.documents[documentIndex] = document;
  permitApplications.set(applicationId, application);
  
  // Simulate processing time (1-3 seconds)
  setTimeout(() => {
    const application = permitApplications.get(applicationId);
    if (!application) return;
    
    const documentIndex = application.documents.findIndex(doc => doc.documentId === documentId);
    if (documentIndex === -1) return;
    
    const document = application.documents[documentIndex];
    
    // Randomly determine if document has issues (80% chance of issues for demo purposes)
    const hasIssues = Math.random() < 0.8;
    
    if (hasIssues) {
      // Generate simulated issues
      const issueTypes = [
        { severity: "critical", description: "Missing required signature on page 1" },
        { severity: "major", description: "Incorrect scale used for measurements" },
        { severity: "major", description: "Missing dimensions on floor plan" },
        { severity: "minor", description: "Low resolution in certain areas making details difficult to discern" },
        { severity: "info", description: "Consider adding more detailed annotations for clearer understanding" },
      ];
      
      const numIssues = Math.floor(Math.random() * 3) + 1; // 1-3 issues
      
      for (let i = 0; i < numIssues; i++) {
        const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
        document.issues.push({
          severity: issueType.severity as any,
          description: issueType.description,
          recommendation: "Please revise and reupload the document with corrections."
        });
      }
      
      document.status = document.issues.some(issue => issue.severity === "critical" || issue.severity === "major")
        ? DocumentAnalysisStatus.NEEDS_CORRECTION
        : DocumentAnalysisStatus.APPROVED;
      
      document.confidence = Math.random() * 0.5 + 0.3; // 0.3-0.8 confidence
    } else {
      // Document is perfect
      document.status = DocumentAnalysisStatus.APPROVED;
      document.confidence = Math.random() * 0.2 + 0.8; // 0.8-1.0 confidence
    }
    
    // Add simulated metadata
    document.pageCount = Math.floor(Math.random() * 10) + 1; // 1-10 pages
    document.dimensions = {
      width: Math.floor(Math.random() * 10) + 20, // 20-30 inches
      height: Math.floor(Math.random() * 15) + 25, // 25-40 inches
      unit: "inches"
    };
    
    document.lastUpdated = new Date();
    
    // Update application documents
    application.documents[documentIndex] = document;
    
    // Add AI comment
    application.aiComments.push({
      timestamp: new Date(),
      message: document.status === DocumentAnalysisStatus.APPROVED
        ? `Document "${document.fileName}" has been analyzed and is acceptable.`
        : `Document "${document.fileName}" has been analyzed and needs corrections. Please review the issues.`
    });
    
    // Check if all required documents are now uploaded
    const uploadedDocumentTypes = application.documents
      .filter(doc => doc.status !== DocumentAnalysisStatus.REJECTED)
      .map(doc => doc.documentType);
    
    const allRequiredDocumentsUploaded = application.requiredDocuments.every(
      docType => uploadedDocumentTypes.includes(docType)
    );
    
    // Check if any documents need correction
    const anyDocumentsNeedCorrection = application.documents.some(
      doc => doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION
    );
    
    // Update application status
    if (allRequiredDocumentsUploaded) {
      if (anyDocumentsNeedCorrection) {
        application.status = ApplicationStatus.NEEDS_CORRECTION;
        application.aiComments.push({
          timestamp: new Date(),
          message: "All required documents have been uploaded, but some need corrections. Please review the issues and reupload the corrected documents."
        });
      } else {
        application.status = ApplicationStatus.READY_FOR_APPROVAL;
        application.readyForHumanReview = true;
        application.applicationComplete = true;
        
        // Generate a unique URL for the site owner
        application.siteOwnerReviewUrl = `/admin/permit-review/${application.id}`;
        
        application.aiComments.push({
          timestamp: new Date(),
          message: "All required documents have been uploaded and analyzed. Your application is now ready for final review by our team. You will be notified when the review is complete."
        });
      }
    } else if (application.status === ApplicationStatus.DOCUMENTS_PENDING) {
      // Still missing documents
      application.aiComments.push({
        timestamp: new Date(),
        message: `The document has been processed. You still need to upload: ${application.missingItems.join(", ").replace(/_/g, " ")}.`
      });
    }
    
    // Update application
    application.updatedAt = new Date();
    permitApplications.set(applicationId, application);
    
  }, Math.floor(Math.random() * 2000) + 1000); // 1-3 seconds
}

// Process document resubmission
export function resubmitDocument(
  applicationId: string,
  documentId: string,
  newFileName: string,
  newMimeType: string,
  newFileSize: number
): DocumentAnalysisResult | undefined {
  const application = permitApplications.get(applicationId);
  if (!application) return undefined;
  
  const documentIndex = application.documents.findIndex(doc => doc.documentId === documentId);
  if (documentIndex === -1) return undefined;
  
  const document = application.documents[documentIndex];
  
  // Update document information
  document.fileName = newFileName;
  document.mimeType = newMimeType;
  document.fileSize = newFileSize;
  document.uploadTimestamp = new Date();
  document.status = DocumentAnalysisStatus.PENDING;
  document.issues = [];
  document.confidence = 0;
  document.lastUpdated = new Date();
  
  // Update application document
  application.documents[documentIndex] = document;
  
  // Update application
  application.updatedAt = new Date();
  application.aiComments.push({
    timestamp: new Date(),
    message: `Document "${document.fileName}" has been resubmitted. AI analysis in progress...`
  });
  
  if (application.status === ApplicationStatus.NEEDS_CORRECTION) {
    application.status = ApplicationStatus.UNDER_REVIEW;
  }
  
  permitApplications.set(applicationId, application);
  
  // Start document analysis (simulated)
  simulateDocumentAnalysis(applicationId, documentId);
  
  return document;
}

// Generate next steps for the applicant
export function generateNextSteps(applicationId: string): string[] {
  const application = permitApplications.get(applicationId);
  if (!application) return [];
  
  const nextSteps: string[] = [];
  
  switch (application.status) {
    case ApplicationStatus.DRAFT:
      nextSteps.push("Complete the application form with all required information.");
      nextSteps.push(`Upload the following required documents: ${application.requiredDocuments.join(", ").replace(/_/g, " ")}.`);
      break;
      
    case ApplicationStatus.DOCUMENTS_PENDING:
      if (application.missingItems.length > 0) {
        nextSteps.push(`Upload the remaining required documents: ${application.missingItems.join(", ").replace(/_/g, " ")}.`);
      }
      break;
      
    case ApplicationStatus.NEEDS_CORRECTION:
      const documentsNeedingCorrection = application.documents
        .filter(doc => doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION)
        .map(doc => doc.fileName);
      
      nextSteps.push(`Correct and reupload the following documents: ${documentsNeedingCorrection.join(", ")}.`);
      
      // Add specific correction instructions
      application.documents
        .filter(doc => doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION)
        .forEach(doc => {
          doc.issues.forEach(issue => {
            if (issue.severity === "critical" || issue.severity === "major") {
              nextSteps.push(`For ${doc.fileName}: ${issue.description}${issue.recommendation ? ` - ${issue.recommendation}` : ''}`);
            }
          });
        });
      break;
      
    case ApplicationStatus.READY_FOR_APPROVAL:
      nextSteps.push("Your application is complete and ready for final review by our team.");
      nextSteps.push("You will be notified when the review is complete.");
      break;
      
    case ApplicationStatus.APPROVED:
      nextSteps.push("Your permit application has been approved!");
      nextSteps.push("You can download your permit from the dashboard.");
      break;
      
    case ApplicationStatus.DENIED:
      nextSteps.push("Your permit application has been denied.");
      nextSteps.push("Please review the comments from our team for more information.");
      break;
      
    default:
      nextSteps.push("Continue with the application process.");
      break;
  }
  
  return nextSteps;
}