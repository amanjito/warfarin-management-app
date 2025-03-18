import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { User } from '@shared/schema';
import MedicalHistoryForm from '@/components/profile/MedicalHistoryForm';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, User as UserIcon, HeartPulse, Clock, LucideHandMetal } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users/current'],
    queryFn: getQueryFn<User>({ on401: 'returnNull' }),
  });
  
  // Calculate the time since starting warfarin
  const calculateWarfarinDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? `, ${months} ${months === 1 ? 'month' : 'months'}` : ''}`;
    }
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40 rounded-md" />
          <Skeleton className="h-40 rounded-md" />
          <Skeleton className="h-40 rounded-md" />
        </div>
        
        <Skeleton className="h-64 w-full mt-6 rounded-md" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Profile Unavailable</h1>
        <p className="text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }
  
  // If in edit mode, show the form
  if (isEditing) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">Edit Medical Information</h1>
        <MedicalHistoryForm 
          userId={user.id}
          defaultValues={{
            medicalConditions: user.medicalConditions || '',
            allergies: user.allergies || '',
            primaryPhysician: user.primaryPhysician || '',
            emergencyContact: user.emergencyContact || '',
            anticoagulantIndicationReason: user.anticoagulantIndicationReason || '',
            dateStartedWarfarin: user.dateStartedWarfarin || '',
            lastInrDate: user.lastInrDate || '',
            lastInrValue: user.lastInrValue || 0,
            targetInrMin: user.targetInrMin || 2.0,
            targetInrMax: user.targetInrMax || 3.0,
          }}
          isEditMode={true}
          onComplete={() => setIsEditing(false)}
        />
      </div>
    );
  }
  
  // Calculate warfarin duration
  const warfarinDuration = user.dateStartedWarfarin 
    ? calculateWarfarinDuration(user.dateStartedWarfarin)
    : 'Unknown';
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Medical Profile</h1>
          <p className="text-gray-600">Your personal and medical information</p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserIcon className="mr-2 h-5 w-5 text-primary" />
              Patient Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <p className="font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">Gender: {user.gender || 'Not specified'}</p>
              <p className="text-sm text-gray-500">Date of Birth: {user.birthDate || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <HeartPulse className="mr-2 h-5 w-5 text-primary" />
              Therapy Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <p className="text-sm">
                <span className="font-medium">Indication: </span>
                {user.anticoagulantIndicationReason || 'Not specified'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Target INR: </span>
                {user.targetInrMin}-{user.targetInrMax}
              </p>
              <p className="text-sm">
                <span className="font-medium">Duration: </span>
                {warfarinDuration}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Last INR Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <p className="text-sm">
                <span className="font-medium">Date: </span>
                {user.lastInrDate ? formatDate(user.lastInrDate) : 'Not recorded'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Value: </span>
                {user.lastInrValue || 'Not recorded'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status: </span>
                {user.lastInrValue && user.targetInrMin && user.targetInrMax ? (
                  user.lastInrValue < user.targetInrMin
                    ? <span className="text-amber-600">Below target range</span>
                    : user.lastInrValue > user.targetInrMax
                      ? <span className="text-red-600">Above target range</span>
                      : <span className="text-green-600">Within target range</span>
                ) : 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="medical" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="medical" className="flex-1">Medical Conditions</TabsTrigger>
          <TabsTrigger value="allergies" className="flex-1">Allergies</TabsTrigger>
          <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="medical" className="p-0 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
              <CardDescription>Your current medical conditions and diagnoses</CardDescription>
            </CardHeader>
            <CardContent>
              {user.medicalConditions ? (
                <div className="whitespace-pre-line">{user.medicalConditions}</div>
              ) : (
                <p className="text-gray-500 italic">No medical conditions recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allergies" className="p-0 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>Your allergies to medications, foods, or other items</CardDescription>
            </CardHeader>
            <CardContent>
              {user.allergies ? (
                <div className="whitespace-pre-line">{user.allergies}</div>
              ) : (
                <p className="text-gray-500 italic">No allergies recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="p-0 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Important Contacts</CardTitle>
              <CardDescription>Your healthcare providers and emergency contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Primary Physician</h3>
                {user.primaryPhysician ? (
                  <p>{user.primaryPhysician}</p>
                ) : (
                  <p className="text-gray-500 italic">No primary physician recorded</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Emergency Contact</h3>
                {user.emergencyContact ? (
                  <p>{user.emergencyContact}</p>
                ) : (
                  <p className="text-gray-500 italic">No emergency contact recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}