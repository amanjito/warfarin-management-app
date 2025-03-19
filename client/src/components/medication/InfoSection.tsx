import { ReactNode } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface InfoSectionProps {
  id: string;
  title: string;
  content: ReactNode;
}

export default function InfoSection({ id, title, content }: InfoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}
    >
      <AccordionItem value={id} className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/60 overflow-hidden transition-all duration-300">
        <AccordionTrigger className="px-4 py-3 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 hover:no-underline group">
          <motion.h3 
            className="font-medium text-right w-full dark:text-white"
            whileTap={{ scale: 0.98 }}
          >
            {title}
          </motion.h3>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {content}
          </motion.div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
}
