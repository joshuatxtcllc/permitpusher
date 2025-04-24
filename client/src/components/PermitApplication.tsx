import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { AlertCircle, CheckCircle2, FileUp, Upload } from "lucide-react";

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

// File upload type
type UploadedFile = {
  name: string;
  size: number;
  type: string;
  status: "pending" | "analyzing" | "success" | "error";
  analysis?: string;
};

export default function PermitApplication() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("application");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // Mock API call for form submission
  const submitApplicationMutation = useMutation({
    mutationFn: (data: PermitApplicationFormData) => {
      return apiRequest("POST", "/api/permit-applications", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your permit application has been successfully submitted.",
      });
      form.reset();
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

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(event.target.files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending",
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Start "AI analysis" for the newly uploaded files
    simulateAIAnalysis(uploadedFiles.length, newFiles.length);
  };

  // Mock AI analysis function
  const simulateAIAnalysis = (startIndex: number, count: number) => {
    setIsAnalyzing(true);

    // Update status to "analyzing" for newly uploaded files
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      for (let i = startIndex; i < startIndex + count; i++) {
        if (updatedFiles[i]) {
          updatedFiles[i].status = "analyzing";
        }
      }
      return updatedFiles;
    });

    // Simulate analysis completion after a delay
    setTimeout(() => {
      setUploadedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        for (let i = startIndex; i < startIndex + count; i++) {
          if (updatedFiles[i]) {
            // Randomly assign success or error for demo purposes
            const isSuccess = Math.random() > 0.2; // 80% success rate
            updatedFiles[i].status = isSuccess ? "success" : "error";

            // Add analysis feedback
            if (isSuccess) {
              const fileType = updatedFiles[i].type;
              if (fileType.includes("image") || fileType.includes("pdf")) {
                updatedFiles[i].analysis = "Document appears to be a valid architectural drawing. All required elements are present.";
              } else {
                updatedFiles[i].analysis = "File format recognized. Content appears to meet submission requirements.";
              }
            } else {
              updatedFiles[i].analysis = "This document may be missing required elements. Please ensure it includes all necessary details for permit approval.";
            }
          }
        }
        return updatedFiles;
      });

      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "AI analysis of your documents has been completed.",
      });
    }, 3000); // 3 second delay to simulate processing
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
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
                <div className="space-y-6">
                  <div className="border-2 border-dashed rounded-lg p-10 text-center border-neutral-300 bg-neutral-50">
                    <div className="flex flex-col items-center">
                      <FileUp className="h-10 w-10 text-neutral-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                      <p className="text-neutral-500 mb-4 max-w-md">
                        Upload architectural drawings, site plans, and supporting documents. Our AI will analyze them for compliance with building codes.
                      </p>
                      <Input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="file-upload">
                        <div className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" /> Select Files
                        </div>
                      </label>
                      <p className="text-xs text-neutral-400 mt-2">
                        Supports PDF, JPG, PNG, DWG, and other common file formats up to 25MB
                      </p>
                    </div>
                  </div>

                  {isAnalyzing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700">
                      <p className="flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        AI is analyzing your documents. This usually takes 10-30 seconds per file.
                      </p>
                    </div>
                  )}
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Uploaded Documents</h3>
                      
                      <div className="border rounded-md divide-y">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div>
                                  {file.status === "analyzing" ? (
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                      <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    </div>
                                  ) : file.status === "success" ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                  ) : file.status === "error" ? (
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                  ) : (
                                    <div className="h-6 w-6 rounded-full border border-neutral-300" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-neutral-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  file.status === "analyzing" ? "outline" :
                                  file.status === "success" ? "secondary" :
                                  file.status === "error" ? "destructive" : "default"
                                }
                              >
                                {file.status === "analyzing" ? "Analyzing" :
                                 file.status === "success" ? "Approved" :
                                 file.status === "error" ? "Needs Revision" : "Pending"}
                              </Badge>
                            </div>
                            
                            {file.analysis && (
                              <div className={`mt-3 p-3 text-sm rounded-md ${
                                file.status === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                              }`}>
                                <p className="font-medium">AI Analysis:</p>
                                <p>{file.analysis}</p>
                              </div>
                            )}
                          </div>
                        ))}
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
                    <Button 
                      type="button"
                      onClick={() => form.handleSubmit(onSubmit)()}
                      disabled={submitApplicationMutation.isPending}
                    >
                      {submitApplicationMutation.isPending ? "Submitting..." : "Complete Application"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}