import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { CalendarCheck, PlusCircle, Bell, HeartPulse, ArrowRight, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function IntroPages() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const introSlides = [
    {
      title: "به نرم‌افزار واراترک خوش آمدید",
      description: "همراه جامع شما برای مدیریت داروی وارفارین و پیگیری روند سلامتی‌تان",
      icon: <HeartPulse className="h-16 w-16 text-primary" />,
      color: "bg-blue-50",
    },
    {
      title: "پیگیری PT/INR",
      description: "به آسانی نتایج آزمایش PT/INR خود را در طول زمان ثبت و با نمودارهای تصویری روند آن را مشاهده کنید",
      icon: <TrendingUp className="h-16 w-16 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "مدیریت دارو",
      description: "داروهای خود را تنظیم کنید و با چند ضربه ساده سابقه دوز مصرفی خود را پیگیری کنید",
      icon: <PlusCircle className="h-16 w-16 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "یادآوری‌ها",
      description: "با یادآورهای قابل تنظیم دارویی که در زمان مناسب به شما اطلاع می‌دهند، هرگز مصرف دارو را فراموش نکنید",
      icon: <Bell className="h-16 w-16 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      title: "بینش‌های سلامتی",
      description: "اطلاعات و راهنمایی‌های شخصی‌سازی شده درباره وارفارین و تأثیر آن بر سلامتی خود دریافت کنید",
      icon: <CalendarCheck className="h-16 w-16 text-primary" />,
      color: "bg-blue-50",
    },
  ];

  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.activeIndex);
  };

  const navigateToAuth = () => {
    setLocation('/auth');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={false}
          pagination={{ clickable: true }}
          onSlideChange={handleSlideChange}
          className="w-full h-[500px]"
        >
          {introSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className={`${slide.color} w-32 h-32 rounded-full flex items-center justify-center mb-8`}>
                  {slide.icon}
                </div>
                <h2 className="text-2xl font-bold mb-4 font-vazirmatn">{slide.title}</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-right font-vazirmatn leading-relaxed">{slide.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="p-6">
        {currentSlide === introSlides.length - 1 ? (
          <Button 
            onClick={navigateToAuth} 
            className="w-full py-6 font-vazirmatn"
          >
            شروع کنید <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
          </Button>
        ) : (
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={navigateToAuth}
              className="font-vazirmatn"
            >
              رد کردن
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentSlide(currentSlide + 1)}
              className="font-vazirmatn"
            >
              بعدی <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntroPages;