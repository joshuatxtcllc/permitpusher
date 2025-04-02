import { z } from "zod";

export const quickQuoteSchema = z.object({
  permitType: z.string().min(1, "Please select a permit type"),
  timeline: z.string().min(1, "Please select a timeline"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

export type QuickQuoteFormData = z.infer<typeof quickQuoteSchema>;

export const leadFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  serviceType: z.string().min(1, "Please select a service type"),
  projectLocation: z.string().optional(),
  projectTimeline: z.string().optional(),
  projectDescription: z.string().optional(),
  injuryType: z.string().optional(),
  injuryDate: z.string().optional(),
  injuryDescription: z.string().optional(),
  howHeard: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
