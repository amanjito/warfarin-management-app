import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { HeartPulse, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Validation schema
const medicalHistorySchema = z.object({
  medicalConditions: z
    .string()
    .min(1, 'Please list your medical conditions')
    .max(500, 'Medical conditions must be less than 500 characters'),
  allergies: z
    .string()
    .max(500, 'Allergies must be less than 500 characters')
    .optional()
    .nullable(),
  primaryPhysician: z
    .string()
    .min(1, 'Please enter your primary physician information')
    .max(200, 'Primary physician information must be less than 200 characters'),
  emergencyContact: z
    .string()
    .min(1, 'Please enter an emergency contact')
    .max(200, 'Emergency contact must be less than 200 characters'),
  anticoagulantIndicationReason: z
    .string()
    .min(1, 'Please enter the reason for taking anticoagulants')
    .max(200, 'Reason must be less than 200 characters'),
  dateStartedWarfarin: z
    .string()
    .min(1, 'Please enter the date you started Warfarin'),
  lastInrDate: z
    .string()
    .min(1, 'Please enter the date of your last INR test'),
  lastInrValue: z
    .number({ 
      required_error: 'Please enter your last INR value',
      invalid_type_error: 'Please enter a valid number'
    })
    .min(0.5, 'INR value should be at least 0.5')
    .max(10, 'INR value should be less than 10'),
  targetInrMin: z
    .number({ 
      required_error: 'Please enter your target INR minimum',
      invalid_type_error: 'Please enter a valid number'
    })
    .min(0.5, 'Minimum INR should be at least 0.5')
    .max(5, 'Minimum INR should be less than 5'),
  targetInrMax: z
    .number({ 
      required_error: 'Please enter your target INR maximum',
      invalid_type_error: 'Please enter a valid number'
    })
    .min(0.5, 'Maximum INR should be at least 0.5')
    .max(10, 'Maximum INR should be less than 10'),
})
.refine((data) => data.targetInrMin < data.targetInrMax, {
  message: 'Minimum INR must be less than maximum INR',
  path: ['targetInrMin'],
});

type MedicalHistoryFormValues = z.infer<typeof medicalHistorySchema>;

interface MedicalHistoryFormProps {
  userId: number;
  onComplete?: () => void;
  defaultValues?: Partial<MedicalHistoryFormValues>;
  isEditMode?: boolean;
}

export default function MedicalHistoryForm({ 
  userId, 
  onComplete, 
  defaultValues = {}, 
  isEditMode = false 
}: MedicalHistoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<MedicalHistoryFormValues>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      medicalConditions: defaultValues.medicalConditions || '',
      allergies: defaultValues.allergies || '',
      primaryPhysician: defaultValues.primaryPhysician || '',
      emergencyContact: defaultValues.emergencyContact || '',
      anticoagulantIndicationReason: defaultValues.anticoagulantIndicationReason || '',
      dateStartedWarfarin: defaultValues.dateStartedWarfarin || '',
      lastInrDate: defaultValues.lastInrDate || '',
      lastInrValue: defaultValues.lastInrValue || undefined,
      targetInrMin: defaultValues.targetInrMin || 2.0,
      targetInrMax: defaultValues.targetInrMax || 3.0,
    },
  });

  const onSubmit = async (values: MedicalHistoryFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Post to server
      const endpoint = isEditMode 
        ? `/api/users/${userId}` 
        : `/api/users/${userId}/medical-history`;
        
      const method = isEditMode ? 'PUT' : 'POST';
      
      await apiRequest({
        url: endpoint,
        method,
        body: values,
      });
      
      // Show success message
      toast({
        title: isEditMode ? 'Medical information updated' : 'Medical history saved',
        description: isEditMode 
          ? 'Your medical information has been updated successfully.' 
          : 'Your medical information has been saved successfully.',
      });
      
      // Invalidate user data cache
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      
      // If in setup mode, complete the setup flow
      if (!isEditMode && onComplete) {
        onComplete();
      }
      
      // If in edit mode and no onComplete is provided, redirect to dashboard
      if (isEditMode && !onComplete) {
        setLocation('/dashboard');
      }
    } catch (err) {
      console.error('Error saving medical history:', err);
      setError('There was an error saving your medical information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {!isEditMode && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
            <HeartPulse className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Medical Information</h1>
          <p className="text-gray-600 mt-2">
            Please fill out your medical information to complete setup
          </p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>General Medical Information</CardTitle>
              <CardDescription>
                Information about your general health and medical conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Atrial fibrillation, Hypertension, Diabetes" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      List all your medical conditions or diagnoses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Penicillin, Sulfa drugs, Shellfish" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      List any allergies to medications, foods or other items
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="primaryPhysician"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Physician*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Dr. Name, Phone Number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The doctor who manages your care
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Name, Relationship, Phone Number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Person to contact in case of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anticoagulation Information</CardTitle>
              <CardDescription>
                Information specific to your anticoagulant therapy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="anticoagulantIndicationReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Anticoagulation*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Atrial fibrillation, DVT, Pulmonary embolism" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The medical reason why you take warfarin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dateStartedWarfarin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Started Warfarin*</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastInrDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last INR Test Date*</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="lastInrValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last INR Value*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetInrMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target INR Minimum*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetInrMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target INR Maximum*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/dashboard')}
                  className="mr-2"
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'Saving...' 
                  : isEditMode 
                    ? 'Update Information' 
                    : 'Save & Continue'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}