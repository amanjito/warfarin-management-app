import { ReactNode } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface InfoSectionProps {
  id: string;
  title: string;
  content: ReactNode;
}

export default function InfoSection({ id, title, content }: InfoSectionProps) {
  return (
    <AccordionItem value={id} className="bg-white rounded-lg shadow overflow-hidden">
      <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 hover:no-underline">
        <h3 className="font-medium text-right w-full">{title}</h3>
      </AccordionTrigger>
      <AccordionContent className="px-4 py-3">
        {content}
      </AccordionContent>
    </AccordionItem>
  );
}
