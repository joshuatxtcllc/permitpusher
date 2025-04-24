import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

enum CrmLeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  PROPOSAL = "proposal",
  CLOSED_WON = "closed_won",
  CLOSED_LOST = "closed_lost",
}

interface CrmLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: CrmLeadStatus;
  notes: string[];
  lastContactDate?: Date;
  assignedTo?: string;
  estimatedValue?: number;
  projectLocation?: string;
  projectTimeline?: string;
  projectDescription?: string;
  injuryType?: string;
  injuryDate?: string;
  injuryDescription?: string;
  howHeard?: string;
  createdAt: Date;
}

interface CrmQuickQuote {
  id: number;
  permitType: string;
  timeline: string;
  email: string;
  phone: string;
  status: CrmLeadStatus;
  notes: string[];
  lastContactDate?: Date;
  assignedTo?: string;
  estimatedValue?: number;
  createdAt: Date;
}

export default function CrmDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<CrmLeadStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<CrmLead | null>(null);
  const [editingQuote, setEditingQuote] = useState<CrmQuickQuote | null>(null);
  const [leadAssignee, setLeadAssignee] = useState("");
  const [leadValue, setLeadValue] = useState("");

  // Fetch all CRM leads
  const { data: leadsData, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['/api/crm/leads', statusFilter],
    queryFn: async () => {
      const endpoint = statusFilter === "all" 
        ? '/api/crm/leads' 
        : `/api/crm/leads?status=${statusFilter}`;
      const response = await apiRequest("GET", endpoint);
      return response.leads as CrmLead[];
    }
  });

  // Fetch all CRM quick quotes
  const { data: quotesData, isLoading: isQuotesLoading } = useQuery({
    queryKey: ['/api/crm/quick-quotes', statusFilter],
    queryFn: async () => {
      const endpoint = statusFilter === "all" 
        ? '/api/crm/quick-quotes' 
        : `/api/crm/quick-quotes?status=${statusFilter}`;
      const response = await apiRequest("GET", endpoint);
      return response.quotes as CrmQuickQuote[];
    }
  });

  // Fetch a specific lead when selected
  const { data: selectedLead } = useQuery({
    queryKey: ['/api/crm/leads', selectedLeadId],
    queryFn: async () => {
      if (!selectedLeadId) return null;
      const response = await apiRequest("GET", `/api/crm/leads/${selectedLeadId}`);
      return response.lead as CrmLead;
    },
    enabled: !!selectedLeadId
  });

  // Fetch a specific quote when selected
  const { data: selectedQuote } = useQuery({
    queryKey: ['/api/crm/quick-quotes', selectedQuoteId],
    queryFn: async () => {
      if (!selectedQuoteId) return null;
      const response = await apiRequest("GET", `/api/crm/quick-quotes/${selectedQuoteId}`);
      return response.quote as CrmQuickQuote;
    },
    enabled: !!selectedQuoteId
  });

  // Mutation for updating lead status
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: CrmLeadStatus }) => {
      return apiRequest("PATCH", `/api/crm/leads/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/leads'] });
      toast({
        title: "Lead updated",
        description: "The lead status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the lead.",
        variant: "destructive",
      });
    }
  });

  // Mutation for updating quote status
  const updateQuoteMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: CrmLeadStatus }) => {
      return apiRequest("PATCH", `/api/crm/quick-quotes/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/quick-quotes'] });
      toast({
        title: "Quote updated",
        description: "The quote status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the quote.",
        variant: "destructive",
      });
    }
  });

  // Mutation for adding a note to a lead
  const addLeadNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: number, note: string }) => {
      return apiRequest("PATCH", `/api/crm/leads/${id}`, { 
        notes: [note],
        lastContactDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      setNoteInput("");
      queryClient.invalidateQueries({ queryKey: ['/api/crm/leads', selectedLeadId] });
      toast({
        title: "Note added",
        description: "The note has been added to the lead.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add note",
        description: error.message || "There was an error adding the note.",
        variant: "destructive",
      });
    }
  });

  // Mutation for adding a note to a quote
  const addQuoteNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: number, note: string }) => {
      return apiRequest("PATCH", `/api/crm/quick-quotes/${id}`, { 
        notes: [note],
        lastContactDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      setNoteInput("");
      queryClient.invalidateQueries({ queryKey: ['/api/crm/quick-quotes', selectedQuoteId] });
      toast({
        title: "Note added",
        description: "The note has been added to the quote.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add note",
        description: error.message || "There was an error adding the note.",
        variant: "destructive",
      });
    }
  });

  // Mutation for updating lead details
  const updateLeadDetailsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return apiRequest("PATCH", `/api/crm/leads/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/crm/leads', selectedLeadId] });
      setDialogOpen(false);
      setEditingLead(null);
      toast({
        title: "Lead updated",
        description: "The lead details have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating the lead details.",
        variant: "destructive",
      });
    }
  });

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    
    if (selectedLeadId) {
      addLeadNoteMutation.mutate({ id: selectedLeadId, note: noteInput });
    } else if (selectedQuoteId) {
      addQuoteNoteMutation.mutate({ id: selectedQuoteId, note: noteInput });
    }
  };

  const handleStatusChange = (id: number, status: CrmLeadStatus, type: 'lead' | 'quote') => {
    if (type === 'lead') {
      updateLeadMutation.mutate({ id, status });
    } else {
      updateQuoteMutation.mutate({ id, status });
    }
  };

  const handleLeadEdit = (lead: CrmLead) => {
    setEditingLead(lead);
    setLeadAssignee(lead.assignedTo || "");
    setLeadValue(lead.estimatedValue?.toString() || "");
    setDialogOpen(true);
  };

  const handleLeadUpdate = () => {
    if (!editingLead) return;
    
    const data: any = {};
    
    if (leadAssignee) {
      data.assignedTo = leadAssignee;
    }
    
    if (leadValue) {
      data.estimatedValue = parseFloat(leadValue);
    }
    
    updateLeadDetailsMutation.mutate({ id: editingLead.id, data });
  };

  // Format the service type for display
  const formatServiceType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get status badge color
  const getStatusColor = (status: CrmLeadStatus) => {
    switch (status) {
      case CrmLeadStatus.NEW:
        return "bg-blue-100 text-blue-800";
      case CrmLeadStatus.CONTACTED:
        return "bg-purple-100 text-purple-800";
      case CrmLeadStatus.QUALIFIED:
        return "bg-yellow-100 text-yellow-800";
      case CrmLeadStatus.PROPOSAL:
        return "bg-orange-100 text-orange-800";
      case CrmLeadStatus.CLOSED_WON:
        return "bg-green-100 text-green-800";
      case CrmLeadStatus.CLOSED_LOST:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format the status for display
  const formatStatus = (status: CrmLeadStatus) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="outline">
              Back to Admin
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Back to Site
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CrmLeadStatus | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={CrmLeadStatus.NEW}>New</SelectItem>
              <SelectItem value={CrmLeadStatus.CONTACTED}>Contacted</SelectItem>
              <SelectItem value={CrmLeadStatus.QUALIFIED}>Qualified</SelectItem>
              <SelectItem value={CrmLeadStatus.PROPOSAL}>Proposal</SelectItem>
              <SelectItem value={CrmLeadStatus.CLOSED_WON}>Closed Won</SelectItem>
              <SelectItem value={CrmLeadStatus.CLOSED_LOST}>Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="leads">
        <TabsList className="mb-6">
          <TabsTrigger value="leads">Contact Form Leads</TabsTrigger>
          <TabsTrigger value="quotes">Quick Quotes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Leads</CardTitle>
                  <CardDescription>
                    {isLeadsLoading ? "Loading leads..." : `${leadsData?.length || 0} leads found`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLeadsLoading ? (
                    <div className="flex justify-center p-4">Loading...</div>
                  ) : leadsData && leadsData.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {leadsData.map((lead) => (
                          <div 
                            key={lead.id} 
                            className={`p-4 rounded-md border cursor-pointer transition-colors ${
                              selectedLeadId === lead.id ? 'bg-primary/10 border-primary' : 'hover:bg-neutral-50'
                            }`}
                            onClick={() => setSelectedLeadId(lead.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{lead.name}</h3>
                              <Badge className={getStatusColor(lead.status)}>
                                {formatStatus(lead.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-500 mb-1">{lead.email}</p>
                            <p className="text-sm text-neutral-500 mb-1">{lead.phone}</p>
                            <p className="text-sm text-neutral-600">
                              {formatServiceType(lead.serviceType)}
                            </p>
                            <p className="text-xs text-neutral-400 mt-2">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No leads found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {selectedLead ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedLead.name}</CardTitle>
                        <CardDescription>
                          {formatServiceType(selectedLead.serviceType)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(selectedLead.status)}>
                        {formatStatus(selectedLead.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-medium mb-2">Contact Information</h3>
                        <div className="space-y-2">
                          <p><span className="text-neutral-500">Email:</span> {selectedLead.email}</p>
                          <p><span className="text-neutral-500">Phone:</span> {selectedLead.phone}</p>
                          <p><span className="text-neutral-500">Source:</span> {selectedLead.howHeard || "Not specified"}</p>
                          <p><span className="text-neutral-500">Date:</span> {new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Project Details</h3>
                        <div className="space-y-2">
                          {selectedLead.serviceType.includes('permit') ? (
                            <>
                              <p><span className="text-neutral-500">Location:</span> {selectedLead.projectLocation || "Not specified"}</p>
                              <p><span className="text-neutral-500">Timeline:</span> {selectedLead.projectTimeline || "Not specified"}</p>
                              <p><span className="text-neutral-500">Description:</span> {selectedLead.projectDescription || "Not specified"}</p>
                            </>
                          ) : (
                            <>
                              <p><span className="text-neutral-500">Injury Type:</span> {selectedLead.injuryType || "Not specified"}</p>
                              <p><span className="text-neutral-500">Injury Date:</span> {selectedLead.injuryDate || "Not specified"}</p>
                              <p><span className="text-neutral-500">Description:</span> {selectedLead.injuryDescription || "Not specified"}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">CRM Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><span className="text-neutral-500">Assigned To:</span> {selectedLead.assignedTo || "Not assigned"}</p>
                        </div>
                        <div>
                          <p><span className="text-neutral-500">Estimated Value:</span> {selectedLead.estimatedValue ? `$${selectedLead.estimatedValue.toLocaleString()}` : "Not set"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Status</h3>
                        <Button variant="outline" size="sm" onClick={() => handleLeadEdit(selectedLead)}>
                          Edit Details
                        </Button>
                      </div>
                      <Select 
                        value={selectedLead.status} 
                        onValueChange={(value) => handleStatusChange(selectedLead.id, value as CrmLeadStatus, 'lead')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CrmLeadStatus.NEW}>New</SelectItem>
                          <SelectItem value={CrmLeadStatus.CONTACTED}>Contacted</SelectItem>
                          <SelectItem value={CrmLeadStatus.QUALIFIED}>Qualified</SelectItem>
                          <SelectItem value={CrmLeadStatus.PROPOSAL}>Proposal</SelectItem>
                          <SelectItem value={CrmLeadStatus.CLOSED_WON}>Closed Won</SelectItem>
                          <SelectItem value={CrmLeadStatus.CLOSED_LOST}>Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Notes</h3>
                      <div className="space-y-2 mb-4">
                        {selectedLead.notes && selectedLead.notes.length > 0 ? (
                          selectedLead.notes.map((note, index) => (
                            <div key={index} className="p-2 bg-neutral-50 rounded-md text-sm">
                              {note}
                            </div>
                          ))
                        ) : (
                          <p className="text-neutral-500">No notes yet</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Add a note about this lead..." 
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                        />
                        <Button 
                          onClick={handleAddNote}
                          disabled={!noteInput.trim()}
                        >
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center border rounded-lg p-8">
                  <p className="text-neutral-500">Select a lead to view details</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="quotes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Quotes</CardTitle>
                  <CardDescription>
                    {isQuotesLoading ? "Loading quotes..." : `${quotesData?.length || 0} quotes found`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isQuotesLoading ? (
                    <div className="flex justify-center p-4">Loading...</div>
                  ) : quotesData && quotesData.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {quotesData.map((quote) => (
                          <div 
                            key={quote.id} 
                            className={`p-4 rounded-md border cursor-pointer transition-colors ${
                              selectedQuoteId === quote.id ? 'bg-primary/10 border-primary' : 'hover:bg-neutral-50'
                            }`}
                            onClick={() => setSelectedQuoteId(quote.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{quote.permitType} Permit</h3>
                              <Badge className={getStatusColor(quote.status)}>
                                {formatStatus(quote.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-500 mb-1">{quote.email}</p>
                            <p className="text-sm text-neutral-500 mb-1">{quote.phone}</p>
                            <p className="text-sm text-neutral-600">Timeline: {quote.timeline}</p>
                            <p className="text-xs text-neutral-400 mt-2">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No quick quotes found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {selectedQuote ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedQuote.permitType} Permit</CardTitle>
                        <CardDescription>
                          Quick Quote Request
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(selectedQuote.status)}>
                        {formatStatus(selectedQuote.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-medium mb-2">Contact Information</h3>
                        <div className="space-y-2">
                          <p><span className="text-neutral-500">Email:</span> {selectedQuote.email}</p>
                          <p><span className="text-neutral-500">Phone:</span> {selectedQuote.phone}</p>
                          <p><span className="text-neutral-500">Date:</span> {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Quote Details</h3>
                        <div className="space-y-2">
                          <p><span className="text-neutral-500">Permit Type:</span> {selectedQuote.permitType}</p>
                          <p><span className="text-neutral-500">Timeline:</span> {selectedQuote.timeline}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">CRM Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><span className="text-neutral-500">Assigned To:</span> {selectedQuote.assignedTo || "Not assigned"}</p>
                        </div>
                        <div>
                          <p><span className="text-neutral-500">Estimated Value:</span> {selectedQuote.estimatedValue ? `$${selectedQuote.estimatedValue.toLocaleString()}` : "Not set"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Status</h3>
                      <Select 
                        value={selectedQuote.status} 
                        onValueChange={(value) => handleStatusChange(selectedQuote.id, value as CrmLeadStatus, 'quote')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CrmLeadStatus.NEW}>New</SelectItem>
                          <SelectItem value={CrmLeadStatus.CONTACTED}>Contacted</SelectItem>
                          <SelectItem value={CrmLeadStatus.QUALIFIED}>Qualified</SelectItem>
                          <SelectItem value={CrmLeadStatus.PROPOSAL}>Proposal</SelectItem>
                          <SelectItem value={CrmLeadStatus.CLOSED_WON}>Closed Won</SelectItem>
                          <SelectItem value={CrmLeadStatus.CLOSED_LOST}>Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Notes</h3>
                      <div className="space-y-2 mb-4">
                        {selectedQuote.notes && selectedQuote.notes.length > 0 ? (
                          selectedQuote.notes.map((note, index) => (
                            <div key={index} className="p-2 bg-neutral-50 rounded-md text-sm">
                              {note}
                            </div>
                          ))
                        ) : (
                          <p className="text-neutral-500">No notes yet</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Add a note about this quote..." 
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                        />
                        <Button 
                          onClick={handleAddNote}
                          disabled={!noteInput.trim()}
                        >
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center border rounded-lg p-8">
                  <p className="text-neutral-500">Select a quick quote to view details</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead Details</DialogTitle>
            <DialogDescription>
              Update assignment and value information for this lead.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="assignee" className="text-sm font-medium">
                Assigned To
              </label>
              <Input
                id="assignee"
                value={leadAssignee}
                onChange={(e) => setLeadAssignee(e.target.value)}
                placeholder="Enter name of assignee"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="value" className="text-sm font-medium">
                Estimated Value ($)
              </label>
              <Input
                id="value"
                value={leadValue}
                onChange={(e) => setLeadValue(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Enter estimated value"
                type="text"
                inputMode="decimal"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLeadUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}