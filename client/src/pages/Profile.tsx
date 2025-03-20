import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarCheck, User, UserCircle, Lock, Phone, Mail, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Profile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    birthDate: string | null;
    avatarUrl: string | null;
  } | null>(null);

  // Profile forms state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Get user data from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user profile data from our API
          const response = await apiRequest('GET', '/api/users/' + user.id);
          const userData = await response.json();
          
          setUserData({
            id: user.id,
            email: user.email || '',
            name: userData.name || user.user_metadata?.name || '',
            phone: userData.phone || user.user_metadata?.phone || '',
            birthDate: userData.birthDate || user.user_metadata?.birthDate || '',
            avatarUrl: userData.avatarUrl || user.user_metadata?.avatarUrl || '',
          });
          
          // Set initial form values
          setName(userData.name || user.user_metadata?.name || '');
          setPhone(userData.phone || user.user_metadata?.phone || '');
          setBirthDate(userData.birthDate || user.user_metadata?.birthDate || '');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        toast({
          title: 'خطا در بارگیری پروفایل',
          description: 'مشکلی در دریافت اطلاعات پروفایل شما رخ داد. لطفا دوباره تلاش کنید.',
          variant: 'destructive',
        });
      }
    };
    
    loadUserProfile();
  }, [toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll just simulate an API call and show success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update user metadata in Supabase (in a real app)
      // await supabase.auth.updateUser({
      //   data: { name, phone, birthDate }
      // });
      
      // Update profile in our database
      // await apiRequest('PATCH', '/api/users/' + userData?.id, { name, phone, birthDate });
      
      toast({
        title: 'پروفایل به‌روزرسانی شد',
        description: 'اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'خطا در به‌روزرسانی',
        description: 'مشکلی در به‌روزرسانی پروفایل رخ داد. لطفا دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('رمزهای عبور جدید مطابقت ندارند');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would update the password with Supabase
      // const { error } = await supabase.auth.updateUser({
      //   password: newPassword
      // });
      
      // For demo, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: 'رمز عبور به‌روزرسانی شد',
        description: 'رمز عبور شما با موفقیت تغییر یافت.',
      });
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'خطا در تغییر رمز عبور',
        description: 'مشکلی در تغییر رمز عبور رخ داد. لطفا دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getNameInitials = (name: string) => {
    if (!name) return 'WT';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={userData?.avatarUrl || ''} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {userData?.name ? getNameInitials(userData.name) : <UserCircle />}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{userData?.name || 'کاربر'}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center">{userData?.email}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">
            <User className="ml-2 h-4 w-4" />
            اطلاعات شخصی
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="ml-2 h-4 w-4" />
            امنیت
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات شخصی</CardTitle>
              <CardDescription>
                اطلاعات پروفایل خود را در اینجا مدیریت کنید. این اطلاعات برای خدمات شخصی‌سازی شده استفاده می‌شود.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      className="pr-10"
                      placeholder="نام و نام خانوادگی خود را وارد کنید"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pr-10"
                      value={userData?.email || ''}
                      disabled
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ایمیل اصلی شما قابل تغییر نیست
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره موبایل</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pr-10" 
                      placeholder="09123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate">تاریخ تولد</Label>
                  <div className="relative">
                    <CalendarCheck className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="birthDate"
                      type="date"
                      className="pr-10"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>امنیت حساب کاربری</CardTitle>
              <CardDescription>
                رمز عبور خود را به‌روزرسانی کنید تا امنیت حساب کاربری خود را حفظ کنید.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>خطا</AlertTitle>
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">رمز عبور فعلی</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">رمز عبور جدید</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    رمز عبور باید حداقل ۶ کاراکتر باشد
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تکرار رمز عبور جدید</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'در حال به‌روزرسانی...' : 'تغییر رمز عبور'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}