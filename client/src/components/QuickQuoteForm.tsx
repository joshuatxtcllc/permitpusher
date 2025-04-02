import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { quickQuoteSchema, type QuickQuoteFormData } from "@/lib/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function QuickQuoteForm() {
  const { toast } = useToast();

  const form = useForm<QuickQuoteFormData>({
    resolver: zodResolver(quickQuoteSchema),
    defaultValues: {
      permitType: "",
      timeline: "",
      email: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: QuickQuoteFormData) => {
      return apiRequest("POST", "/api/quick-quotes", data);
    },
    onSuccess: () => {
      toast({
        title: "Quote request submitted!",
        description: "We'll contact you shortly with more information.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: QuickQuoteFormData) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="residential">Residential Building</SelectItem>
                  <SelectItem value="commercial">Commercial Building</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                  <SelectItem value="dispensary">Dispensary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When do you need it?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="rush">ASAP (1-3 days)</SelectItem>
                  <SelectItem value="standard">Standard (1-2 weeks)</SelectItem>
                  <SelectItem value="planning">Planning Phase</SelectItem>
                </SelectContent>
              </Select>
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
                <Input placeholder="your@email.com" {...field} />
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="(713) 555-0123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Request Free Quote"}
        </Button>
      </form>
    </Form>
  );
}
