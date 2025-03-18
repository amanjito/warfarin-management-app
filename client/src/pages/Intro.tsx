import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Pagination, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import icons
import { Pill, Bell, Activity, ChevronRight, Calendar, Heart, BarChart2 } from 'lucide-react';

export default function Intro() {
  const [location, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const totalSlides = 5;

  const goToAuth = () => {
    setLocation('/auth');
  };

  const introSlides = [
    {
      title: "Welcome to WarfarinTracker",
      subtitle: "Your comprehensive medication management app",
      icon: <Heart className="h-16 w-16 text-primary" />,
      description: "A simple way to manage your warfarin medication, track PT/INR tests, and stay on schedule with helpful reminders.",
    },
    {
      title: "Medication Management",
      subtitle: "Keep track of your warfarin doses",
      icon: <Pill className="h-16 w-16 text-primary" />,
      description: "Easily log your medication intake, view your history, and monitor your adherence patterns.",
    },
    {
      title: "PT/INR Test Tracking",
      subtitle: "Monitor your PT/INR test results",
      icon: <BarChart2 className="h-16 w-16 text-primary" />,
      description: "Record and visualize your PT/INR test results over time to better understand your health trends.",
    },
    {
      title: "Smart Reminders",
      subtitle: "Never miss a dose again",
      icon: <Bell className="h-16 w-16 text-primary" />,
      description: "Set up customized reminders for your medication schedule with timely notifications.",
    },
    {
      title: "Health Summary",
      subtitle: "Get insights about your health",
      icon: <Activity className="h-16 w-16 text-primary" />,
      description: "View your health trends and get a comprehensive overview of your medication and test history.",
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-card">
      <div className="flex-1 overflow-hidden">
        <Swiper
          modules={[Pagination, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.activeIndex);
          }}
          className="h-full"
        >
          {introSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
                <div className="bg-primary/10 p-8 rounded-full mb-8">
                  {slide.icon}
                </div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{slide.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{slide.subtitle}</p>
                <p className="text-base text-muted-foreground max-w-md">{slide.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="p-6 space-y-4">
        {currentSlide < totalSlides - 1 ? (
          <div className="flex justify-between">
            <Button variant="ghost" onClick={goToAuth}>
              Skip
            </Button>
            <Button onClick={() => swiperRef.current?.slideNext()}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={goToAuth}>
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
}