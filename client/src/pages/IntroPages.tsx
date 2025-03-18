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
      title: "Welcome to WarfarinTracker",
      description: "Your comprehensive companion for managing Warfarin medication and tracking your health progress.",
      icon: <HeartPulse className="h-16 w-16 text-primary" />,
      color: "bg-blue-50",
    },
    {
      title: "PT/INR Tracking",
      description: "Easily log and monitor your PT/INR test results over time with visual charts to observe trends.",
      icon: <TrendingUp className="h-16 w-16 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Medication Management",
      description: "Set up your medications and keep track of your dosage history with a few simple taps.",
      icon: <PlusCircle className="h-16 w-16 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Reminders",
      description: "Never miss a dose with customizable medication reminders that notify you at the right time.",
      icon: <Bell className="h-16 w-16 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      title: "Health Insights",
      description: "Get personalized information and guidance about Warfarin and its effects on your health.",
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
                <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">{slide.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="p-6">
        {currentSlide === introSlides.length - 1 ? (
          <Button 
            onClick={navigateToAuth} 
            className="w-full py-6"
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={navigateToAuth}
            >
              Skip
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentSlide(currentSlide + 1)}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntroPages;