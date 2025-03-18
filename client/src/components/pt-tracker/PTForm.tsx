import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

// Create a schema for form validation
const formSchema = z.object({
  testDate: z.string().nonempty({ message: "Test date is required" }),
  inrValue: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "INR value must be a positive number" }
  ),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface PTFormProps {
  onSubmit: (data: FormData) => void;
  isPending: boolean;
}

export default function PTForm({ onSubmit, isPending }: PTFormProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testDate: today,
      inrValue: "",
      notes: ""
    }
  });
  
  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    
    // Reset form fields except for date
    form.reset({
      testDate: today,
      inrValue: "",
      notes: ""
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="testDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} max={today} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="inrValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>INR Value</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="Ex: 2.5" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional details about this test" 
                  className="resize-none" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
