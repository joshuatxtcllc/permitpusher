import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { 
  AlertCircle, 
  CheckCircle2, 
  FileUp, 
  Upload, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Info,
  ExternalLink,
  ArrowRight,
  DownloadCloud,
  MessageSquare,
  XCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PaymentForm from "./PaymentForm";

// Form schema for permit application
const permitApplicationSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  propertyAddress: z.string().min(5, { message: "Property address is required" }),
  projectType: z.string().min(1, { message: "Project type is required" }),
  permitType: z.string().min(1, { message: "Permit type is required" }),
  estimatedCost: z.string().min(1, { message: "Estimated cost is required" }),
  projectDescription: z.string().min(10, { message: "Project description is required" }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type PermitApplicationFormData = z.infer<typeof permitApplicationSchema>;

// Application statuses
enum ApplicationStatus {
  DRAFT = "draft",
  DOCUMENTS_PENDING = "documents_pending",
  DOCUMENTS_UPLOADED = "documents_uploaded",
  UNDER_REVIEW = "under_review",
  NEEDS_CORRECTION = "needs_correction",
  READY_FOR_APPROVAL = "ready_for_approval", 
  APPROVED = "approved",
  DENIED = "denied"
}

// Document analysis status
enum DocumentAnalysisStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_CORRECTION = "needs_correction"
}

// Document types that may be required
enum DocumentType {
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

// File upload type
type UploadedFile = {
  documentId?: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "analyzing" | "success" | "error";
  documentType?: DocumentType;
  analysis?: string;
  issues?: Array<{
    severity: "critical" | "major" | "minor" | "info";
    location?: string;
    description: string;
    recommendation?: string;
  }>;
  uploadTimestamp?: Date;
  confidence?: number;
};

// Permit application type
type PermitApplicationState = {
  id?: string;
  status: ApplicationStatus;
  documents: UploadedFile[];
  requiredDocuments: DocumentType[];
  aiComments: Array<{
    timestamp: Date;
    message: string;
  }>;
  missingItems: string[];
  applicationComplete: boolean;
  readyForHumanReview: boolean;
  nextSteps: string[];
  permitType: string;
  projectType: string;
  estimatedCost: string;
};

export default function PermitApplication() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("application");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [permitApplication, setPermitApplication] = useState<PermitApplicationState | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [processingStep, setProcessingStep] = useState(1);

  // Fetch application status if we have an ID
  const { data: applicationData, refetch: refetchApplication } = useQuery({
    queryKey: ['permit-application', applicationId],
    queryFn: async () => {
      if (!applicationId) return null;
      const response = await apiRequest('GET', `/api/permit-applications/${applicationId}`);
      return response;
    },
    enabled: !!applicationId,
    refetchInterval: 5000, // Poll every 5 seconds when documents are being analyzed
  });

  // Form submission handler
  const form = useForm<PermitApplicationFormData>({
    resolver: zodResolver(permitApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      propertyAddress: "",
      projectType: "",
      permitType: "",
      estimatedCost: "",
      projectDescription: "",
      agreeToTerms: false,
    },
  });

  // Process application data when it's fetched
  useEffect(() => {
    if (applicationData) {
      setPermitApplication(applicationData.application);

      // If the application has documents, update our local state
      if (applicationData.application.documents.length > 0) {
        setUploadedFiles(applicationData.application.documents);
      }

      // When documents are being processed, check more frequently
      const documentsProcessing = applicationData.application.documents.some(
        doc => doc.status === "analyzing" || doc.status === "pending"
      );

      if (documentsProcessing) {
        setIsAnalyzing(true);
        // Refetch to check progress
        setTimeout(() => refetchApplication(), 3000);
      } else {
        setIsAnalyzing(false);
      }

      // If the application status changes, show a toast notification
      if (permitApplication && permitApplication.status !== applicationData.application.status) {
        toast({
          title: "Application Status Updated",
          description: `Your application status is now: ${applicationData.application.status.replace(/_/g, " ")}`,
        });
      }
    }
  }, [applicationData, permitApplication]);

  // API call for form submission
  const submitApplicationMutation = useMutation({
    mutationFn: (data: PermitApplicationFormData) => {
      return apiRequest("POST", "/api/permit-applications", data);
    },
    onSuccess: (response) => {
      toast({
        title: "Application Created",
        description: "Your permit application has been created. Now you can upload the required documents.",
      });

      // Store the application ID and update the state
      setApplicationId(response.applicationId);
      setPermitApplication(response.application);

      // Move to the documents tab
      setActiveTab("documents");

      // Setup processing step
      setProcessingStep(2);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: PermitApplicationFormData) {
    submitApplicationMutation.mutate(data);
  }

  // Document upload mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!applicationId || !selectedDocumentType) return null;

      // In a real app, we would upload the file to a server
      // Here we're just simulating the upload with the file metadata
      const fileData = {
        documentType: selectedDocumentType,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size
      };

      return apiRequest("POST", `/api/permit-applications/${applicationId}/documents`, fileData);
    },
    onSuccess: (response, file) => {
      if (!response) return;

      toast({
        title: "Document Uploaded",
        description: "Your document was uploaded successfully and is being analyzed by our AI system.",
      });

      // Add the file to our local state temporarily
      const newFile: UploadedFile = {
        documentId: response.documentId,
        name: file.name,
        size: file.size,
        type: file.type,
        documentType: selectedDocumentType || undefined,
        status: "analyzing",
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Refetch the application to get the updated document list with analysis
      setTimeout(() => refetchApplication(), 2000);

      // Reset the selected document type
      setSelectedDocumentType(null);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Document resubmission mutation
  const resubmitDocumentMutation = useMutation({
    mutationFn: async ({ documentId, file }: { documentId: string, file: File }) => {
      if (!applicationId) return null;

      // In a real app, we would upload the file to a server
      // Here we're just simulating the upload with the file metadata
      const fileData = {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size
      };

      return apiRequest("PUT", `/api/permit-applications/${applicationId}/documents/${documentId}`, fileData);
    },
    onSuccess: (response) => {
      if (!response) return;

      toast({
        title: "Document Resubmitted",
        description: "Your updated document was submitted successfully and is being analyzed by our AI system.",
      });

      // Refetch the application to get the updated document list with analysis
      setTimeout(() => refetchApplication(), 2000);
    },
    onError: (error) => {
      toast({
        title: "Resubmission Failed",
        description: error.message || "There was an error resubmitting your document. Please try again.",
        variant: "destructive",
      });
    }
  });

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !selectedDocumentType) return;

    const file = event.target.files[0];
    uploadDocumentMutation.mutate(file);
  };

  // Document resubmission handler
  const handleDocumentResubmit = (documentId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    resubmitDocumentMutation.mutate({ documentId, file });
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const fetchApplicationStatus = () => {
    if (applicationId) {
      refetchApplication();
    }
  };

  return (
    <section id="permit-application" className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Online Permit Application
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Fast-track your permit process with our AI-powered application system. Upload your documents and get instant analysis before submission.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Permit Application System</CardTitle>
            <CardDescription>
              Complete the application form and upload your architectural drawings and supporting documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="application">Application Form</TabsTrigger>
                <TabsTrigger value="documents">Document Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="application" className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="propertyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter property address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">Residential</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="industrial">Industrial</SelectItem>
                                <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permitType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select permit type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="building">Building Permit</SelectItem>
                                <SelectItem value="electrical">Electrical Permit</SelectItem>
                                <SelectItem value="plumbing">Plumbing Permit</SelectItem>
                                <SelectItem value="mechanical">Mechanical Permit</SelectItem>
                                <SelectItem value="demolition">Demolition Permit</SelectItem>
                                <SelectItem value="zoning">Zoning Permit</SelectItem>
                                <SelectItem value="sign">Sign Permit</SelectItem>
                                <SelectItem value="grading">Grading Permit</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estimatedCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Project Cost ($)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter estimated cost" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your project in detail" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the terms and conditions
                            </FormLabel>
                            <FormDescription>
                              By submitting this application, you confirm that all information provided is accurate and complete.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between items-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("documents")}
                      >
                        Next: Upload Documents
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={submitApplicationMutation.isPending}
                      >
                        {submitApplicationMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="documents" className="pt-6">
                {!applicationId ? (
                  // Step 1: Need to create application first
                  <div className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle>Complete the application form first</AlertTitle>
                      <AlertDescription>
                        Please complete and submit the application form before uploading documents. Our AI system will analyze which documents you need to provide.
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("application")}
                      >
                        Go to Application Form
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Application Status and Progress */}
                    {permitApplication && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">Application Status</h3>
                          <Badge 
                            variant="outline" 
                            className={
                              permitApplication.status === ApplicationStatus.READY_FOR_APPROVAL ? "bg-green-50 text-green-700" :
                              permitApplication.status === ApplicationStatus.NEEDS_CORRECTION ? "bg-amber-50 text-amber-700" :
                              "bg-blue-50 text-blue-700"
                            }
                          >
                            {permitApplication.status.replace(/_/g, " ")}
                          </Badge>
                        </div>

                        {/* Progress steps */}
                        <Progress 
                          value={
                            permitApplication.status === ApplicationStatus.DRAFT ? 25 :
                            permitApplication.status === ApplicationStatus.DOCUMENTS_PENDING ? 50 :
                            permitApplication.status === ApplicationStatus.NEEDS_CORRECTION ? 75 :
                            permitApplication.status === ApplicationStatus.READY_FOR_APPROVAL ? 90 :
                            permitApplication.status === ApplicationStatus.APPROVED ? 100 : 50
                          } 
                          className="h-2 mb-4" 
                        />

                        {/* AI comments/messages */}
                        {permitApplication.aiComments && permitApplication.aiComments.length > 0 && (
                          <div className="mb-4 border rounded-md p-4 bg-neutral-50">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                              AI Assistant Messages
                            </h4>
                            <div className="space-y-3 max-h-32 overflow-y-auto">
                              {permitApplication.aiComments.map((comment, idx) => (
                                <div key={idx} className="text-sm pb-2 border-b border-neutral-100 last:border-0">
                                  <span className="text-xs text-neutral-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </span>
                                  <p>{comment.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Required Documents List */}
                        {permitApplication.requiredDocuments && permitApplication.requiredDocuments.length > 0 && (
                          <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-medium">Required Documents</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {permitApplication.requiredDocuments.map((docType) => {
                                const isUploaded = permitApplication.documents.some(
                                  doc => doc.documentType === docType && doc.status !== DocumentAnalysisStatus.REJECTED
                                );
                                return (
                                  <div 
                                    key={docType}
                                    className={`flex items-center p-2 rounded-md ${
                                      isUploaded ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                    }`}
                                  >
                                    {isUploaded ? (
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                    )}
                                    <span className="text-sm">{docType.replace(/_/g, " ")}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Missing Items */}
                        {permitApplication.missingItems && permitApplication.missingItems.length > 0 && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Missing Requirements</AlertTitle>
                            <AlertDescription>
                              <ul className="list-disc pl-5 space-y-1 mt-2">
                                {permitApplication.missingItems.map((item, idx) => (
                                  <li key={idx} className="text-sm">{item}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Next Steps */}
                        {permitApplication.nextSteps && permitApplication.nextSteps.length > 0 && (
                          <Alert className="bg-blue-50 border-blue-200">
                            <Info className="h-4 w-4 text-blue-600" />
                            <AlertTitle>Next Steps</AlertTitle>
                            <AlertDescription>
                              <ul className="list-disc pl-5 space-y-1 mt-2">
                                {permitApplication.nextSteps.map((step, idx) => (
                                  <li key={idx} className="text-sm">{step}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {/* Document Upload Section */}
                    {permitApplication && permitApplication.status !== ApplicationStatus.READY_FOR_APPROVAL && (
                      <div className="border-2 border-dashed rounded-lg p-6 text-center border-neutral-300 bg-neutral-50">
                        <div className="flex flex-col items-center">
                          <FileUp className="h-10 w-10 text-neutral-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                          <p className="text-sm text-neutral-500 mb-4 max-w-md">
                            Select document type and upload your files. Our AI will analyze them for accuracy and compliance with building codes.
                          </p>

                          {/* Document Type Selection */}
                          <div className="w-full max-w-xs mb-4">
                            <Select onValueChange={(value) => setSelectedDocumentType(value as DocumentType)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                              <SelectContent>
                                {permitApplication.requiredDocuments
                                  .filter(docType => {
                                    // Filter out document types that have already been uploaded successfully
                                    return !permitApplication.documents.some(
                                      doc => doc.documentType === docType && 
                                      (doc.status === DocumentAnalysisStatus.APPROVED || 
                                       doc.status === DocumentAnalysisStatus.PROCESSING)
                                    );
                                  })
                                  .map(docType => (
                                    <SelectItem key={docType} value={docType}>
                                      {docType.replace(/_/g, " ")}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="relative">
                            <Input
                              type="file"
                              className="hidden"
                              id="file-upload"
                              onChange={handleFileUpload}
                              accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
                              disabled={!selectedDocumentType || isAnalyzing}
                            />
                            <label
                              htmlFor="file-upload"
                              className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                                selectedDocumentType && !isAnalyzing
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                  : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                              } transition-colors`}
                            >
                              {isAnalyzing ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  {selectedDocumentType ? "Select File" : "Select Document Type First"}
                                </>
                              )}
                            </label>
                          </div>
                          <p className="text-xs text-neutral-400 mt-2">
                            Accepts PDF, JPG, PNG, DWG, and DXF files up to 25MB
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Uploaded files list */}
                    {permitApplication && permitApplication.documents.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-medium">Your Documents</h3>

                        {isAnalyzing && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700">
                            <p className="flex items-center">
                              <RefreshCw className="animate-spin h-4 w-4 mr-2 text-blue-600" />
                              AI is analyzing your documents. This usually takes 10-30 seconds per file.
                            </p>
                          </div>
                        )}

                        <Accordion type="single" collapsible className="w-full">
                          {permitApplication.documents.map((doc, index) => (
                            <AccordionItem 
                              key={index} 
                              value={`doc-${index}`}
                              className={`border rounded-md overflow-hidden mb-3 ${
                                doc.status === DocumentAnalysisStatus.APPROVED ? "border-green-200" :
                                doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION ? "border-amber-200" :
                                doc.status === DocumentAnalysisStatus.PROCESSING ? "border-blue-200" :
                                doc.status === DocumentAnalysisStatus.REJECTED ? "border-red-200" :
                                "border-neutral-200"
                              }`}
                            >
                              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    {doc.status === DocumentAnalysisStatus.PROCESSING ? (
                                      <RefreshCw className="h-5 w-5 text-blue-500 mr-3 animate-spin" />
                                    ) : doc.status === DocumentAnalysisStatus.APPROVED ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                                    ) : doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION ? (
                                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                                    ) : doc.status === DocumentAnalysisStatus.REJECTED ? (
                                      <XCircle className="h-5 w-5 text-red-500 mr-3" />
                                    ) : (
                                      <FileUp className="h-5 w-5 text-neutral-400 mr-3" />
                                    )}
                                    <div className="text-left">
                                      <p className="font-medium text-sm">{doc.fileName}</p>
                                      <p className="text-xs text-neutral-500">
                                        {doc.documentType?.replace(/_/g, " ")} • {formatFileSize(doc.fileSize)}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={
                                      doc.status === DocumentAnalysisStatus.PROCESSING ? "outline" :
                                      doc.status === DocumentAnalysisStatus.APPROVED ? "secondary" :
                                      doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION ? "default" :
                                      doc.status === DocumentAnalysisStatus.REJECTED ? "destructive" : "default"
                                    }
                                  >
                                    {doc.status === DocumentAnalysisStatus.PROCESSING ? "Analyzing" :
                                    doc.status === DocumentAnalysisStatus.APPROVED ? "Approved" :
                                    doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION ? "Needs Correction" :
                                    doc.status === DocumentAnalysisStatus.REJECTED ? "Rejected" : "Pending"}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                {doc.issues && doc.issues.length > 0 ? (
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-medium">AI Analysis Results</h4>
                                    <div className="space-y-2">
                                      {doc.issues.map((issue, idx) => (
                                        <div 
                                          key={idx} 
                                          className={`p-3 rounded-md text-sm ${
                                            issue.severity === "critical" ? "bg-red-50 text-red-700" :
                                            issue.severity === "major" ? "bg-amber-50 text-amber-700":
                                            issue.severity === "minor" ? "bg-yellow-50 text-yellow-700" :
                                            "bg-blue-50 text-blue-700"
                                          }`}
                                        >
                                          <div className="flex items-start">
                                            <AlertTriangle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                              <p className="font-medium">{issue.severity.toUpperCase()}: {issue.description}</p>
                                              {issue.location && <p className="text-xs mt-1">Location: {issue.location}</p>}
                                              {issue.recommendation && (
                                                <p className="mt-1 italic">{issue.recommendation}</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {(doc.status === DocumentAnalysisStatus.NEEDS_CORRECTION || 
                                      doc.status === DocumentAnalysisStatus.REJECTED) && (
                                      <div className="mt-4">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="border-amber-200 text-amber-700"
                                          onClick={() => document.getElementById("file-upload")?.click()}
                                        >
                                          <Upload className="mr-2 h-3 w-3" />
                                          Upload Corrected Document
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="py-2">
                                    {doc.status === DocumentAnalysisStatus.APPROVED ? (
                                      <p className="text-sm text-green-700">
                                        This document has been analyzed and approved by our AI system. No issues were detected.
                                      </p>
                                    ) : doc.status === DocumentAnalysisStatus.PROCESSING ? (
                                      <p className="text-sm text-blue-700">
                                        This document is currently being analyzed by our AI system. Results will be available shortly.
                                      </p>
                                    ) : (
                                      <p className="text-sm text-neutral-600">
                                        No analysis information is available for this document yet.
                                      </p>
                                    )}
                                  </div>
                                )}

                                {doc.confidence !== undefined && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs text-neutral-500">
                                      AI confidence score: {Math.round(doc.confidence * 100)}%
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                      Uploaded: {new Date(doc.uploadTimestamp).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {/* Ready for approval section */}
                    {permitApplication && permitApplication.readyForHumanReview && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex flex-col items-center text-center">
                          <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                          <h3 className="text-lg font-medium mb-1">Application Ready for Review!</h3>
                          <p className="text-sm text-green-700 mb-4">
                            All required documents have been uploaded and verified by our AI system. Your application has been sent to our team for final review.
                          </p>
                          <div className="flex items-center space-x-4">
                            <Button variant="outline" className="bg-white">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Application Summary
                            </Button>
                            <Button variant="outline" className="bg-white">
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              Download All Documents
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("application")}
                      >
                        Back to Application
                      </Button>

                      {!permitApplication?.readyForHumanReview && (
                        <Button 
                          type="button"
                          onClick={() => form.handleSubmit(onSubmit)()}
                          disabled={submitApplicationMutation.isPending}
                        >
                          {submitApplicationMutation.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : "Complete Application"}
                        </Button>
                      )}
                    </div>

                    {/* Payment Section */}
                    {permitApplication && (
                      <div className="mt-8">
                        <PaymentForm
                          applicationId={permitApplication.id}
                          permitType={permitApplication.permitType}
                          projectType={permitApplication.projectType}
                          estimatedCost={permitApplication.estimatedCost}
                          onPaymentComplete={() => {
                            // Refresh application status
                            fetchApplicationStatus();
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}