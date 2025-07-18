import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp,
  RefreshCw,
  Download,
  Eye,
  MessageSquare,
  AlertTriangle,
  Brain,
  Settings,
  BarChart3,
  Filter,
  Search,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  CreditCard
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Application status enum
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

// AI Processing stages
enum AIProcessingStage {
  INTAKE = "intake",
  DOCUMENT_ANALYSIS = "document_analysis", 
  CODE_COMPLIANCE = "code_compliance",
  ZONING_CHECK = "zoning_check",
  SAFETY_REVIEW = "safety_review",
  ENVIRONMENTAL_CHECK = "environmental_check",
  FINAL_VALIDATION = "final_validation",
  HUMAN_REVIEW = "human_review"
}

interface PermitApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  propertyAddress: string;
  projectType: string;
  permitType: string;
  estimatedCost: string;
  status: ApplicationStatus;
  aiProcessingStage: AIProcessingStage;
  aiConfidenceScore: number;
  documentsCount: number;
  issuesCount: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  priority: "low" | "normal" | "high" | "urgent";
  estimatedCompletionDate: string;
  aiComments: Array<{
    timestamp: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
  }>;
}

interface AIMetrics {
  totalApplications: number;
  processingToday: number;
  approvedToday: number;
  averageProcessingTime: number;
  aiAccuracyRate: number;
  humanInterventionRate: number;
  systemLoad: number;
}

export default function PermitAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<PermitApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Fetch all permit applications
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['permit-applications-admin'],
    queryFn: () => apiRequest('GET', '/api/permit-applications'),
    refetchInterval: 5000, // Real-time updates
  });

  // Fetch AI system metrics
  const { data: metricsData } = useQuery({
    queryKey: ['ai-metrics'],
    queryFn: () => apiRequest('GET', '/api/ai-metrics'),
    refetchInterval: 10000,
  });

  // Update application status
  const updateApplicationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => 
      apiRequest('PATCH', `/api/permit-applications/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permit-applications-admin'] });
      toast({
        title: "Application Updated",
        description: "The application has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application.",
        variant: "destructive",
      });
    }
  });

  // AI system control mutation
  const aiControlMutation = useMutation({
    mutationFn: ({ action, applicationId }: { action: string, applicationId?: string }) =>
      apiRequest('POST', '/api/ai-control', { action, applicationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permit-applications-admin'] });
      toast({
        title: "AI Action Completed",
        description: "The AI system has processed your request.",
      });
    }
  });

  const applications = applicationsData?.applications || [];
  const metrics: AIMetrics = metricsData?.metrics || {
    totalApplications: 0,
    processingToday: 0,
    approvedToday: 0,
    averageProcessingTime: 0,
    aiAccuracyRate: 0,
    humanInterventionRate: 0,
    systemLoad: 0
  };

  // Filter applications
  const filteredApplications = applications.filter((app: PermitApplication) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch = !searchTerm || 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED: return "bg-green-100 text-green-800";
      case ApplicationStatus.DENIED: return "bg-red-100 text-red-800";
      case ApplicationStatus.NEEDS_CORRECTION: return "bg-yellow-100 text-yellow-800";
      case ApplicationStatus.READY_FOR_APPROVAL: return "bg-blue-100 text-blue-800";
      case ApplicationStatus.UNDER_REVIEW: return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "normal": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Permit Processing Center</h1>
            <p className="text-gray-600">Manage and monitor all permit applications</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => setShowAIInsights(!showAIInsights)}
            >
              <Brain className="mr-2 h-4 w-4" />
              AI Insights
            </Button>
            <Button 
              variant="outline"
              onClick={() => queryClient.invalidateQueries()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* AI System Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.processingToday} processing today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(metrics.aiAccuracyRate * 100).toFixed(1)}%</div>
              <Progress value={metrics.aiAccuracyRate * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageProcessingTime}h</div>
              <p className="text-xs text-muted-foreground">
                85% faster than traditional
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Load</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(metrics.systemLoad * 100).toFixed(0)}%</div>
              <Progress value={metrics.systemLoad * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        {showAIInsights && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                AI System Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Processing Recommendations</h4>
                  <Alert className="mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>High Volume Detected</AlertTitle>
                    <AlertDescription>
                      Consider enabling priority processing for residential permits today.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>System Performance</AlertTitle>
                    <AlertDescription>
                      AI models are performing optimally with 97.3% accuracy rate.
                    </AlertDescription>
                  </Alert>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Pattern Analysis</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 23% increase in commercial permit applications this week</li>
                    <li>• Most common issue: Missing architectural signatures</li>
                    <li>• Peak processing hours: 9-11 AM, 2-4 PM</li>
                    <li>• 67% of applications approved without human review</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="ai-pipeline">AI Pipeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">AI Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Permit Applications</CardTitle>
                    <CardDescription>Monitor and manage all permit applications</CardDescription>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="ready_for_approval">Ready for Approval</SelectItem>
                        <SelectItem value="needs_correction">Needs Correction</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Project Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>AI Confidence</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app: PermitApplication) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{app.applicantName}</div>
                              <div className="text-sm text-gray-500">{app.applicantEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{app.permitType}</div>
                              <div className="text-sm text-gray-500">{app.projectType}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={app.aiConfidenceScore * 100} className="w-16 h-2" />
                              <span className="text-sm">{(app.aiConfidenceScore * 100).toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div 
                                className={`w-2 h-2 rounded-full ${getPriorityColor(app.priority)}`}
                              />
                              <span className="capitalize">{app.priority}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(app.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedApplication(app)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {app.status === ApplicationStatus.READY_FOR_APPROVAL && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateApplicationMutation.mutate({
                                    id: app.id,
                                    updates: { status: ApplicationStatus.APPROVED }
                                  })}
                                >
                                  Approve
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-pipeline">
            <Card>
              <CardHeader>
                <CardTitle>AI Processing Pipeline</CardTitle>
                <CardDescription>Monitor the AI processing stages for all applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.values(AIProcessingStage).map((stage) => {
                    const stageApps = applications.filter((app: any) => app.aiProcessingStage === stage);
                    return (
                      <div key={stage} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold capitalize">
                            {stage.replace(/_/g, " ")}
                          </h3>
                          <Badge variant="secondary">{stageApps.length} applications</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {stageApps.slice(0, 6).map((app: PermitApplication) => (
                            <div 
                              key={app.id} 
                              className="border rounded p-3 bg-white cursor-pointer hover:bg-gray-50"
                              onClick={() => setSelectedApplication(app)}
                            >
                              <div className="font-medium text-sm">{app.id}</div>
                              <div className="text-xs text-gray-500">{app.applicantName}</div>
                              <div className="flex justify-between items-center mt-2">
                                <Progress value={app.aiConfidenceScore * 100} className="w-16 h-2" />
                                <span className="text-xs">{(app.aiConfidenceScore * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Detailed metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Analytics dashboard would show comprehensive charts and metrics here.
                    Including processing times, approval rates, common issues, and trends.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>AI System Settings</CardTitle>
                <CardDescription>Configure AI processing parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Processing Thresholds</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Auto-approval confidence threshold</label>
                        <Input type="number" min="0" max="100" defaultValue="95" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Human review trigger threshold</label>
                        <Input type="number" min="0" max="100" defaultValue="75" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">System Controls</h4>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline"
                        onClick={() => aiControlMutation.mutate({ action: "reprocess_failed" })}
                      >
                        Reprocess Failed Applications
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => aiControlMutation.mutate({ action: "optimize_models" })}
                      >
                        Optimize AI Models
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => aiControlMutation.mutate({ action: "clear_cache" })}
                      >
                        Clear System Cache
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Application Details: {selectedApplication.id}</CardTitle>
                    <CardDescription>{selectedApplication.applicantName}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Application Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Property:</span> {selectedApplication.propertyAddress}</div>
                      <div><span className="font-medium">Project Type:</span> {selectedApplication.projectType}</div>
                      <div><span className="font-medium">Permit Type:</span> {selectedApplication.permitType}</div>
                      <div><span className="font-medium">Estimated Cost:</span> ${selectedApplication.estimatedCost}</div>
                      <div><span className="font-medium">AI Confidence:</span> {(selectedApplication.aiConfidenceScore * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Processing Status</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Current Stage:</span> {selectedApplication.aiProcessingStage?.replace(/_/g, " ")}</div>
                      <div><span className="font-medium">Documents:</span> {selectedApplication.documentsCount}</div>
                      <div><span className="font-medium">Issues Found:</span> {selectedApplication.issuesCount}</div>
                      <div><span className="font-medium">Priority:</span> <span className="capitalize">{selectedApplication.priority}</span></div>
                    </div>
                  </div>
                </div>

                {selectedApplication.aiComments && selectedApplication.aiComments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">AI Processing Log</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedApplication.aiComments.map((comment, idx) => (
                        <div key={idx} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.timestamp), "MMM d, yyyy HH:mm")}
                          </span>
                          <p>{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex space-x-3">
                  {selectedApplication.status === ApplicationStatus.READY_FOR_APPROVAL && (
                    <>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          updateApplicationMutation.mutate({
                            id: selectedApplication.id,
                            updates: { status: ApplicationStatus.APPROVED }
                          });
                          setSelectedApplication(null);
                        }}
                      >
                        Approve Application
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          updateApplicationMutation.mutate({
                            id: selectedApplication.id,
                            updates: { status: ApplicationStatus.NEEDS_CORRECTION }
                          });
                          setSelectedApplication(null);
                        }}
                      >
                        Request Corrections
                      </Button>
                    </>
                  )}
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Documents
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}