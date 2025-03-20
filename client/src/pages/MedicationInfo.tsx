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
import { motion } from "framer-motion";

export default function MedicationInfo() {
  const [activeSection, setActiveSection] = useState("what-is-warfarin");
  
  // Warfarin information sections
  const sections = [
    {
      id: "what-is-warfarin",
      title: "وارفارین چیست؟",
      content: (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            وارفارین (کومادین) یک داروی ضدانعقاد است که به جلوگیری از تشکیل یا بزرگ شدن لخته‌های خون کمک می‌کند. این دارو با کاهش توانایی انعقاد خون عمل می‌کند.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            وارفارین معمولاً برای افراد با شرایط زیر تجویز می‌شود:
          </p>
          <ul className="list-disc pr-5 text-sm text-gray-700 dark:text-gray-300 mb-3 text-right">
            <li>فیبریلاسیون دهلیزی</li>
            <li>ترومبوز ورید عمقی (DVT)</li>
            <li>آمبولی ریوی</li>
            <li>دریچه‌های مصنوعی قلب</li>
            <li>سابقه سکته</li>
          </ul>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            نظارت منظم بر <span className="unicode-bidi">INR</span> (نسبت نرمال شده بین‌المللی) شما هنگام مصرف وارفارین برای اطمینان از دریافت دوز مناسب ضروری است.
          </p>
        </>
      )
    },
    {
      id: "how-to-take",
      title: "نحوه مصرف وارفارین",
      content: (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            وارفارین را دقیقاً طبق دستور پزشک مصرف کنید. دستورالعمل‌های مهم:
          </p>
          <ul className="list-disc pr-5 text-sm text-gray-700 dark:text-gray-300 mb-3 text-right">
            <li>هر روز در ساعت مشخصی مصرف کنید، معمولاً در عصر</li>
            <li>می‌تواند با غذا یا بدون غذا مصرف شود</li>
            <li>بدون مشورت با پزشک، دوز خود را تغییر ندهید</li>
            <li>اگر یک دوز را فراموش کردید، به محض یادآوری در همان روز آن را مصرف کنید</li>
            <li>برای جبران دوز فراموش شده، دوز دوبرابر مصرف نکنید</li>
            <li>قرار ملاقات‌های منظم برای آزمایش <span className="unicode-bidi">INR</span> را رعایت کنید</li>
          </ul>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-r-4 border-yellow-400 p-3 text-sm text-right">
            <p className="font-medium text-yellow-800 dark:text-yellow-300">مهم</p>
            <p className="text-yellow-700 dark:text-yellow-200">هرگز بدون صحبت با پزشک خود، مصرف وارفارین را متوقف نکنید.</p>
          </div>
        </>
      )
    },
    {
      id: "side-effects",
      title: "عوارض جانبی",
      content: (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            عوارض جانبی رایج وارفارین ممکن است شامل موارد زیر باشد:
          </p>
          <ul className="list-disc pr-5 text-sm text-gray-700 dark:text-gray-300 mb-3 text-right">
            <li>خونریزی لثه هنگام مسواک زدن</li>
            <li>خون‌دماغ</li>
            <li>کبودی آسان</li>
            <li>خونریزی طولانی از بریدگی‌ها</li>
          </ul>
          <div className="bg-red-50 dark:bg-red-900/30 border-r-4 border-red-400 p-3 text-sm mb-3 text-right">
            <p className="font-medium text-red-800 dark:text-red-300">در صورت بروز موارد زیر فوراً به پزشک مراجعه کنید:</p>
            <ul className="list-disc pr-5 text-red-700 dark:text-red-200">
              <li>خونریزی شدید یا غیرمعمول</li>
              <li>ادرار قرمز یا قهوه‌ای</li>
              <li>مدفوع سیاه یا خونی</li>
              <li>استفراغی که شبیه تفاله قهوه است</li>
              <li>سرفه خونی</li>
              <li>سردرد شدید یا سرگیجه</li>
              <li>درد یا تورم غیرمعمول مفصل</li>
            </ul>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
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
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            وارفارین با بسیاری از غذاها، مکمل‌ها و داروها تداخل دارد. حفظ ثبات در رژیم غذایی هنگام مصرف وارفارین مهم است.
          </p>
          
          <h4 className="font-medium text-sm mb-2 text-right dark:text-white">غذاهای حاوی ویتامین K ممکن است اثربخشی وارفارین را کاهش دهند:</h4>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {["کیل", "اسفناج", "کلم بروکسل", "کلم برگ", "بروکلی", "چای سبز"].map((food, index) => (
              <div key={index} className="bg-green-50 dark:bg-green-900/30 p-2 rounded text-xs flex items-center dark:text-green-200">
                <svg 
                  className="mr-1 text-green-600 dark:text-green-300 h-3 w-3" 
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
          
          <h4 className="font-medium text-sm mb-2 text-right dark:text-white">داروهایی که باید با پزشک خود در مورد آن‌ها صحبت کنید:</h4>
          <ul className="list-disc pr-5 text-sm text-gray-700 dark:text-gray-300 mb-3 text-right">
            <li>آنتی‌بیوتیک‌ها</li>
            <li>داروهای ضدالتهاب (مانند آسپرین، ایبوپروفن)</li>
            <li>داروهای ضدافسردگی</li>
            <li>آنتی‌اسیدها</li>
            <li>مکمل‌های ویتامینی (به ویژه ویتامین K)</li>
            <li>مکمل‌های گیاهی (مانند علف چای، جینسنگ)</li>
          </ul>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-400 p-3 text-sm text-right">
            <p className="font-medium text-blue-800 dark:text-blue-300">توصیه</p>
            <p className="text-blue-700 dark:text-blue-200">همیشه قبل از شروع هر داروی جدید یا مکمل، همه پزشکان خود را از مصرف وارفارین مطلع کنید.</p>
          </div>
        </>
      )
    },
    {
      id: "emergency-info",
      title: "اطلاعات اضطراری",
      content: (
        <>
          <div className="bg-red-50 dark:bg-red-900/30 border-r-4 border-red-500 p-3 mb-4 text-right">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">همیشه شناسایی که نشان می‌دهد وارفارین مصرف می‌کنید را همراه داشته باشید.</p>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">در موارد اضطراری:</p>
          <ol className="list-decimal pr-5 text-sm text-gray-700 dark:text-gray-300 mb-4 text-right">
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
      <h2 className="text-2xl font-semibold mb-6 text-right dark:text-white">اطلاعات وارفارین</h2>
      
      {/* Current Medication */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="mb-6 cursor-pointer overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <motion.div 
                className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0 ml-4"
                whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Pill className="h-8 w-8 text-primary dark:text-primary-foreground" />
                </motion.div>
              </motion.div>
              <div className="flex flex-col">
                <motion.div 
                  className="text-right mb-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium dark:text-white">وارفارین</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">داروی ضدانعقاد</p>
                </motion.div>
                <div className="flex flex-col gap-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 text-right">
                      محدوده هدف <span className="unicode-bidi">INR</span>: ۲/۰-۳/۰
                    </Badge>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-right">
                      دوز فعلی: ۵ میلی‌گرم
                    </Badge>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
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
