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
              Get Started Today
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Fill out our qualification form to see if your project is a good fit for
              our rush permit services or to discuss your personal injury case.
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
                  className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold"
                  disabled={mutation.isPending || !serviceType}
                >
                  {mutation.isPending ? "Submitting..." : "Submit Request"}
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

            <div className="bg-primary rounded-lg shadow-md p-8 text-white">
              <h3 className="text-xl font-bold font-heading mb-4">
                Emergency Permit Needs?
              </h3>
              <p className="mb-6">
                For urgent permit situations that require immediate attention, call
                our emergency hotline. We offer same-day consultations for critical
                cases.
              </p>
              <div className="bg-white text-primary rounded-lg p-4 font-bold text-xl text-center">
                (713) 555-9111
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
