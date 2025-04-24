import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lead, QuickQuote } from "@shared/schema";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpDown, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Admin() {
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const leadsQuery = useQuery<{ leads: Lead[] }>({
    queryKey: ["/api/leads"],
  });

  const quickQuotesQuery = useQuery<{ quotes: QuickQuote[] }>({
    queryKey: ["/api/quick-quotes"],
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedLeads = leadsQuery.data?.leads.slice().sort((a, b) => {
    // @ts-ignore: dynamic property access
    const aValue = a[sortField] || "";
    // @ts-ignore: dynamic property access
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const sortedQuotes = quickQuotesQuery.data?.quotes.slice().sort((a, b) => {
    // @ts-ignore: dynamic property access
    const aValue = a[sortField] || "";
    // @ts-ignore: dynamic property access
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? "↑" : "↓";
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your leads and inquiries</p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site
            </Button>
          </Link>
          <Link href="/crm">
            <Button variant="secondary">
              CRM Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => {
              leadsQuery.refetch();
              quickQuotesQuery.refetch();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              At a glance summary of your leads and inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Total Leads
                </div>
                {leadsQuery.isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">
                    {leadsQuery.data?.leads.length || 0}
                  </div>
                )}
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Total Quick Quotes
                </div>
                {quickQuotesQuery.isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">
                    {quickQuotesQuery.data?.quotes.length || 0}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads">
        <TabsList className="mb-4">
          <TabsTrigger value="leads">Full Leads</TabsTrigger>
          <TabsTrigger value="quotes">Quick Quotes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Full Leads</CardTitle>
              <CardDescription>
                Detailed leads from the contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leadsQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : leadsQuery.error ? (
                <div className="text-center py-4 text-red-500">
                  Error loading leads. Please try again.
                </div>
              ) : !sortedLeads?.length ? (
                <div className="text-center py-4 text-muted-foreground">
                  No leads found. Leads will appear here when customers submit the contact form.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>A list of all your leads.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          Name {renderSortIcon("name")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          Email {renderSortIcon("email")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("phone")}
                        >
                          Phone {renderSortIcon("phone")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("serviceType")}
                        >
                          Service {renderSortIcon("serviceType")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("createdAt")}
                        >
                          Submitted {renderSortIcon("createdAt")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedLeads?.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell>
                            <Badge variant={lead.serviceType === "permit" ? "default" : "secondary"}>
                              {lead.serviceType === "permit" ? "Permit" : "Personal Injury"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(lead.createdAt?.toString() || "")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Quick Quotes</CardTitle>
              <CardDescription>
                Quick quote requests from the banner form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quickQuotesQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : quickQuotesQuery.error ? (
                <div className="text-center py-4 text-red-500">
                  Error loading quick quotes. Please try again.
                </div>
              ) : !sortedQuotes?.length ? (
                <div className="text-center py-4 text-muted-foreground">
                  No quick quotes found. Quotes will appear here when customers request them.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>A list of all quick quote requests.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          Email {renderSortIcon("email")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("phone")}
                        >
                          Phone {renderSortIcon("phone")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("permitType")}
                        >
                          Permit Type {renderSortIcon("permitType")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("timeline")}
                        >
                          Timeline {renderSortIcon("timeline")}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("createdAt")}
                        >
                          Submitted {renderSortIcon("createdAt")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedQuotes?.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell>{quote.email}</TableCell>
                          <TableCell>{quote.phone}</TableCell>
                          <TableCell>{quote.permitType}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                quote.timeline === "urgent" ? "destructive" : 
                                quote.timeline === "standard" ? "default" : 
                                "secondary"
                              }
                            >
                              {quote.timeline === "urgent" ? (
                                <Clock className="h-3 w-3 mr-1 inline" />
                              ) : quote.timeline === "standard" ? (
                                <CheckCircle className="h-3 w-3 mr-1 inline" />
                              ) : null}
                              {quote.timeline?.charAt(0).toUpperCase() + quote.timeline?.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(quote.createdAt?.toString() || "")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
