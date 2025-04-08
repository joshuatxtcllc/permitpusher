import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { leadFormSchema, type LeadFormData } from "@/lib/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState<string>("");

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      projectLocation: "",
      projectTimeline: "",
      projectDescription: "",
      injuryType: "",
      injuryDate: "",
      injuryDescription: "",
      howHeard: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LeadFormData) => {
      return apiRequest("POST", "/api/leads", data);
    },
    onSuccess: () => {
      toast({
        title: "Form submitted successfully!",
        description: "We will contact you shortly.",
        variant: "default",
      });
      form.reset();
      setServiceType("");
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: LeadFormData) {
    mutation.mutate(data);
  }

  const handleServiceTypeChange = (value: string) => {
    setServiceType(value);
    form.setValue("serviceType", value);
  };

  const isPersonalInjury = serviceType === "personal-injury";

  return (
    <section id="contact" className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-4">
              Access Our AI Permit System
            </h2>
            <div className="flex items-center bg-primary/10 rounded-md p-3 mb-4">
              <div className="mr-3 bg-primary/20 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="18" height="10" x="3" y="11" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" x2="8" y1="16" y2="16" />
                  <line x1="16" x2="16" y1="16" y2="16" />
                </svg>
              </div>
              <span className="text-sm text-primary font-medium">Your information will be analyzed by our AI system for optimal permit strategy</span>
            </div>
            <p className="text-lg text-neutral-600 mb-8">
              Complete this form to have our AI Permit Processor analyze your project requirements
              and determine the optimal permitting strategy. Our neural network will assess historical 
              approval patterns to maximize your success rate.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={handleServiceTypeChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential-permit">Residential Permit</SelectItem>
                            <SelectItem value="commercial-permit">Commercial Permit</SelectItem>
                            <SelectItem value="dispensary-permit">Dispensary Permit</SelectItem>
                            <SelectItem value="personal-injury">Personal Injury Case</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {serviceType && !isPersonalInjury && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="projectLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Address in Houston, TX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectTimeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Timeline</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency (1-3 days)</SelectItem>
                              <SelectItem value="rush">Rush (1-2 weeks)</SelectItem>
                              <SelectItem value="standard">Standard (2-4 weeks)</SelectItem>
                              <SelectItem value="planning">Planning Phase</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Project Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your project..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {isPersonalInjury && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="injuryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Injury</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select injury type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="auto-accident">Auto Accident</SelectItem>
                              <SelectItem value="work-injury">Workplace Injury</SelectItem>
                              <SelectItem value="slip-fall">Slip and Fall</SelectItem>
                              <SelectItem value="medical-malpractice">Medical Malpractice</SelectItem>
                              <SelectItem value="other-injury">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="injuryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Injury</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="injuryDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Description of Incident</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us what happened..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {serviceType && (
                  <FormField
                    control={form.control}
                    name="howHeard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did you hear about us?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="google">Google Search</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="social-media">Social Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {serviceType && (
                  <div className="flex items-start">
                    <Checkbox id="consent" className="mt-1 mr-2" required />
                    <label htmlFor="consent" className="text-neutral-600 text-sm">
                      I consent to being contacted about my inquiry and understand my
                      information will be used in accordance with your privacy policy.
                    </label>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold relative overflow-hidden"
                  disabled={mutation.isPending || !serviceType}
                >
                  {mutation.isPending ? 
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI Processing...
                    </span> : 
                    <span className="flex items-center justify-center">
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 4h-4v4h-4v4h4v4h4v-4h4v-4h-4z"></path>
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                      </svg>
                      Start AI Permit Analysis
                    </span>
                  }
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-xl font-bold text-primary font-heading mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-4 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Office Address</h4>
                    <p className="text-neutral-600">
                      123 Main Street, Suite 201
                      <br />
                      Houston, TX 77002
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-4 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <p className="text-neutral-600">(713) 555-7890</p>
                    <p className="text-neutral-500 text-sm">
                      Monday-Friday: 9am-5pm CT
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-4 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <p className="text-neutral-600">
                      info@citypermitrushhoustonprmt.com
                    </p>
                    <p className="text-neutral-500 text-sm">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-lg shadow-md p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 opacity-10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12.5 7.5L12.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 12C4 12 7 8 12 8C17 8 20 12 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 7L19 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 7L5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-bold font-heading mr-2">
                    AI-Priority Emergency Service
                  </h3>
                  <span className="bg-secondary text-white text-xs rounded-full px-2 py-1">ULTRA-FAST</span>
                </div>
                <p className="mb-4">
                  Our AI system offers a premium emergency processing track with dedicated neural network resources
                  for time-critical permits. Get 24-48 hour turnarounds on permits that normally take weeks.
                </p>
                <div className="bg-white/10 rounded-lg p-3 mb-4 backdrop-blur-sm">
                  <div className="text-sm flex items-center">
                    <span className="text-secondary mr-2">✓</span> Advanced pattern matching for fastest approvals
                  </div>
                  <div className="text-sm flex items-center">
                    <span className="text-secondary mr-2">✓</span> Priority processing in our neural network
                  </div>
                  <div className="text-sm flex items-center">
                    <span className="text-secondary mr-2">✓</span> Direct access to our AI engineers
                  </div>
                </div>
                <div className="bg-white text-primary rounded-lg p-4 font-bold text-xl text-center flex items-center justify-center">
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                  </svg>
                  (713) 555-9111
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
