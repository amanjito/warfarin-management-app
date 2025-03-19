import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, AlertCircle, PhoneCall, CreditCard } from "lucide-react";
import InfoSection from "@/components/medication/InfoSection";
import { Button } from "@/components/ui/button";

export default function MedicationInfo() {
  const [activeSection, setActiveSection] = useState("what-is-warfarin");
  
  // Warfarin information sections
  const sections = [
    {
      id: "what-is-warfarin",
      title: "وارفارین چیست؟",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            وارفارین (کومادین) یک داروی ضدانعقاد است که به جلوگیری از تشکیل یا بزرگ شدن لخته‌های خون کمک می‌کند. این دارو با کاهش توانایی انعقاد خون عمل می‌کند.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            وارفارین معمولاً برای افراد با شرایط زیر تجویز می‌شود:
          </p>
          <ul className="list-disc pr-5 text-sm text-gray-700 mb-3 text-right">
            <li>فیبریلاسیون دهلیزی</li>
            <li>ترومبوز ورید عمقی (DVT)</li>
            <li>آمبولی ریوی</li>
            <li>دریچه‌های مصنوعی قلب</li>
            <li>سابقه سکته</li>
          </ul>
          <p className="text-sm text-gray-700">
            نظارت منظم بر INR (نسبت نرمال شده بین‌المللی) شما هنگام مصرف وارفارین برای اطمینان از دریافت دوز مناسب ضروری است.
          </p>
        </>
      )
    },
    {
      id: "how-to-take",
      title: "نحوه مصرف وارفارین",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            وارفارین را دقیقاً طبق دستور پزشک مصرف کنید. دستورالعمل‌های مهم:
          </p>
          <ul className="list-disc pr-5 text-sm text-gray-700 mb-3 text-right">
            <li>هر روز در ساعت مشخصی مصرف کنید، معمولاً در عصر</li>
            <li>می‌تواند با غذا یا بدون غذا مصرف شود</li>
            <li>بدون مشورت با پزشک، دوز خود را تغییر ندهید</li>
            <li>اگر یک دوز را فراموش کردید، به محض یادآوری در همان روز آن را مصرف کنید</li>
            <li>برای جبران دوز فراموش شده، دوز دوبرابر مصرف نکنید</li>
            <li>قرار ملاقات‌های منظم برای آزمایش INR را رعایت کنید</li>
          </ul>
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-3 text-sm text-right">
            <p className="font-medium text-yellow-800">مهم</p>
            <p className="text-yellow-700">هرگز بدون صحبت با پزشک خود، مصرف وارفارین را متوقف نکنید.</p>
          </div>
        </>
      )
    },
    {
      id: "side-effects",
      title: "عوارض جانبی",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            عوارض جانبی رایج وارفارین ممکن است شامل موارد زیر باشد:
          </p>
          <ul className="list-disc pr-5 text-sm text-gray-700 mb-3 text-right">
            <li>خونریزی لثه هنگام مسواک زدن</li>
            <li>خون‌دماغ</li>
            <li>کبودی آسان</li>
            <li>خونریزی طولانی از بریدگی‌ها</li>
          </ul>
          <div className="bg-red-50 border-r-4 border-red-400 p-3 text-sm mb-3 text-right">
            <p className="font-medium text-red-800">در صورت بروز موارد زیر فوراً به پزشک مراجعه کنید:</p>
            <ul className="list-disc pr-5 text-red-700">
              <li>خونریزی شدید یا غیرمعمول</li>
              <li>ادرار قرمز یا قهوه‌ای</li>
              <li>مدفوع سیاه یا خونی</li>
              <li>استفراغی که شبیه تفاله قهوه است</li>
              <li>سرفه خونی</li>
              <li>سردرد شدید یا سرگیجه</li>
              <li>درد یا تورم غیرمعمول مفصل</li>
            </ul>
          </div>
          <p className="text-sm text-gray-700">
            هرگونه علائم غیرمعمول را فوراً به پزشک خود گزارش دهید.
          </p>
        </>
      )
    },
    {
      id: "food-interactions",
      title: "تداخلات غذایی و دارویی",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            وارفارین با بسیاری از غذاها، مکمل‌ها و داروها تداخل دارد. حفظ ثبات در رژیم غذایی هنگام مصرف وارفارین مهم است.
          </p>
          
          <h4 className="font-medium text-sm mb-2 text-right">غذاهای حاوی ویتامین K ممکن است اثربخشی وارفارین را کاهش دهند:</h4>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {["کیل", "اسفناج", "کلم بروکسل", "کلم برگ", "بروکلی", "چای سبز"].map((food, index) => (
              <div key={index} className="bg-green-50 p-2 rounded text-xs flex items-center">
                <svg 
                  className="mr-1 text-green-600 h-3 w-3" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6.8 21a22 22 0 0 1 10.4 0" />
                  <path d="M5 15.3C3.3 13.6 2.3 11.4 2 9c4 0 7.3 1 9.6 3.3a18.8 18.8 0 0 1 6.2 6.8" />
                  <path d="M12 12a22 22 0 0 0-1.5-4.3A22 22 0 0 1 8 3" />
                  <path d="M3 3c11.1 11.1 11.1 5.5 5 5.5a7.9 7.9 0 0 1-3.5-5.5" />
                </svg>
                {food}
              </div>
            ))}
          </div>
          
          <h4 className="font-medium text-sm mb-2 text-right">داروهایی که باید با پزشک خود در مورد آن‌ها صحبت کنید:</h4>
          <ul className="list-disc pr-5 text-sm text-gray-700 mb-3 text-right">
            <li>آنتی‌بیوتیک‌ها</li>
            <li>داروهای ضدالتهاب (مانند آسپرین، ایبوپروفن)</li>
            <li>داروهای ضدافسردگی</li>
            <li>آنتی‌اسیدها</li>
            <li>مکمل‌های ویتامینی (به ویژه ویتامین K)</li>
            <li>مکمل‌های گیاهی (مانند علف چای، جینسنگ)</li>
          </ul>
          
          <div className="bg-blue-50 border-r-4 border-blue-400 p-3 text-sm text-right">
            <p className="font-medium text-blue-800">توصیه</p>
            <p className="text-blue-700">همیشه قبل از شروع هر داروی جدید یا مکمل، همه پزشکان خود را از مصرف وارفارین مطلع کنید.</p>
          </div>
        </>
      )
    },
    {
      id: "emergency-info",
      title: "اطلاعات اضطراری",
      content: (
        <>
          <div className="bg-red-50 border-r-4 border-red-500 p-3 mb-4 text-right">
            <p className="text-sm font-medium text-red-700">همیشه شناسایی که نشان می‌دهد وارفارین مصرف می‌کنید را همراه داشته باشید.</p>
          </div>
          
          <p className="text-sm text-gray-700 mb-3">در موارد اضطراری:</p>
          <ol className="list-decimal pr-5 text-sm text-gray-700 mb-4 text-right">
            <li className="mb-2">در صورت خونریزی شدید یا آسیب، فوراً با خدمات اورژانس (115) تماس بگیرید</li>
            <li className="mb-2">به کادر پزشکی اطلاع دهید که وارفارین مصرف می‌کنید</li>
            <li className="mb-2">برای راهنمایی در مورد خونریزی‌های جزئی با پزشک خود تماس بگیرید</li>
          </ol>
        </>
      )
    }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-right">اطلاعات وارفارین</h2>
      
      {/* Current Medication */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 flex flex-col text-right mr-4">
              <div className="mb-1">
                <h3 className="font-medium">وارفارین</h3>
                <p className="text-sm text-gray-500">داروی ضدانعقاد</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 text-right w-auto">
                  محدوده هدف INR: ۲/۰-۳/۰
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-right w-auto">
                  دوز فعلی: ۵ میلی‌گرم
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Information Sections */}
      <div className="space-y-4">
        <Accordion type="single" collapsible defaultValue="what-is-warfarin">
          {sections.map((section) => (
            <InfoSection 
              key={section.id} 
              id={section.id} 
              title={section.title} 
              content={section.content}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
