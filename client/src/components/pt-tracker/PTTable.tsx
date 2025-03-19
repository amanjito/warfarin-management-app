import { PtTest } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { toPersianDate, convertToPersianDigits } from "@/lib/dateUtils";
import jalaali from 'jalaali-js';
import { motion } from "framer-motion";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface PTTableProps {
  ptTests: PtTest[];
  onEdit?: (test: PtTest) => void;
  onDelete?: (test: PtTest) => void;
  showAll?: boolean;
}

export default function PTTable({ ptTests, onEdit, onDelete, showAll = false }: PTTableProps) {
  const [selectedTest, setSelectedTest] = useState<PtTest | null>(null);
  const [animate, setAnimate] = useState(true);
  
  // Group tests by month and year
  const groupedTests = ptTests.reduce((acc, test) => {
    const date = new Date(test.testDate);
    const persianDate = jalaali.toJalaali(date);
    const key = `${persianDate.jy}-${persianDate.jm}`;
    
    if (!acc[key]) {
      acc[key] = {
        year: persianDate.jy,
        month: persianDate.jm,
        tests: []
      };
    }
    
    acc[key].tests.push(test);
    return acc;
  }, {} as Record<string, { year: number, month: number, tests: PtTest[] }>);

  // Convert to array and sort by date (newest first)
  const groupedTestsArray = Object.values(groupedTests).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
  
  // Filter to show only recent months if not showing all
  const displayGroups = showAll ? groupedTestsArray : groupedTestsArray.slice(0, 3);
  
  // Helper to determine status based on INR value
  const getStatus = (inrValue: number) => {
    if (inrValue >= 2.0 && inrValue <= 3.0) {
      return {
        label: "در محدوده هدف",
        color: "green",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      };
    } else if (inrValue < 2.0) {
      return {
        label: "زیر محدوده هدف",
        color: "yellow",
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />
      };
    } else {
      return {
        label: "بالای محدوده هدف",
        color: "red",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      };
    }
  };
  
  // Get persian month name
  const getPersianMonthName = (month: number): string => {
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                           'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return persianMonths[month - 1];
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  if (ptTests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        هنوز آزمایش PT ثبت نشده است. از فرم بالا برای افزودن اولین آزمایش استفاده کنید.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {displayGroups.map((group) => (
        <motion.div 
          key={`${group.year}-${group.month}`}
          initial={animate ? "hidden" : false}
          animate={animate ? "show" : false}
          variants={containerVariants}
          className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4"
          onAnimationComplete={() => setAnimate(false)}
        >
          <div className="flex items-center mb-3">
            <Calendar className="h-5 w-5 ml-2 text-primary dark:text-primary/90" />
            <h3 className="font-semibold dark:text-white">
              {getPersianMonthName(group.month)} {convertToPersianDigits(group.year.toString())}
            </h3>
          </div>
          
          <div className="space-y-3">
            {group.tests.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()).map((test) => {
              const status = getStatus(test.inrValue);
              const persianDate = toPersianDate(new Date(test.testDate));
              const isSelected = selectedTest?.id === test.id;
              
              return (
                <motion.div 
                  key={test.id}
                  variants={itemVariants}
                  className={`rounded-lg border ${isSelected ? 'border-primary' : 'border-gray-200 dark:border-slate-700'} bg-white dark:bg-slate-800 p-3 shadow-sm transition-all hover:shadow dark:shadow-slate-900/30`}
                  onClick={() => setSelectedTest(isSelected ? null : test)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full ${
                        status.color === 'green' 
                          ? 'bg-green-100 dark:bg-green-900/50' 
                          : status.color === 'yellow'
                            ? 'bg-yellow-100 dark:bg-yellow-900/50'
                            : 'bg-red-100 dark:bg-red-900/50'
                      } flex items-center justify-center ml-3`}>
                        <span className="font-bold text-sm dark:text-white">{convertToPersianDigits(test.inrValue.toFixed(1))}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium dark:text-white">
                            {convertToPersianDigits(persianDate.jd.toString())} {getPersianMonthName(persianDate.jm)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`mr-2 ${
                              status.color === 'green' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : status.color === 'yellow'
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                            }`}
                          >
                            <div className="flex items-center">
                              {status.icon}
                              <span className="mr-1 text-xs">{status.label}</span>
                            </div>
                          </Badge>
                        </div>
                        {isSelected && test.notes && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-sm text-gray-600"
                          >
                            <Separator className="my-2" />
                            <p className="whitespace-pre-wrap">{test.notes}</p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    {(onEdit || onDelete) && (
                      <div className="flex space-x-1 mr-0 ml-0">
                        {onEdit && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(test);
                              }}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">ویرایش</span>
                            </Button>
                          </motion.div>
                        )}
                        {onDelete && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(test);
                              }}
                              className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">حذف</span>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
