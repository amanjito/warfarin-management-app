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
      title: "What is Warfarin?",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            Warfarin (Coumadin) is an anticoagulant medication that helps prevent blood clots from forming or growing larger. It works by decreasing the clotting ability of the blood.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            Warfarin is commonly prescribed for people with:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
            <li>Atrial fibrillation</li>
            <li>Deep vein thrombosis (DVT)</li>
            <li>Pulmonary embolism</li>
            <li>Artificial heart valves</li>
            <li>History of stroke</li>
          </ul>
          <p className="text-sm text-gray-700">
            Regular monitoring of your INR (International Normalized Ratio) is essential while taking warfarin to ensure you're receiving the right dose.
          </p>
        </>
      )
    },
    {
      id: "how-to-take",
      title: "How to Take Warfarin",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            Take warfarin exactly as prescribed by your healthcare provider. Here are important guidelines:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
            <li>Take at the same time each day, usually in the evening</li>
            <li>Can be taken with or without food</li>
            <li>Do not change your dose without consulting your doctor</li>
            <li>If you miss a dose, take it as soon as you remember on the same day</li>
            <li>Do not take a double dose to make up for a missed dose</li>
            <li>Keep regular appointments for INR testing</li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
            <p className="font-medium text-yellow-800">Important</p>
            <p className="text-yellow-700">Never stop taking warfarin without talking to your healthcare provider first.</p>
          </div>
        </>
      )
    },
    {
      id: "side-effects",
      title: "Side Effects",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            Common side effects of warfarin may include:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
            <li>Bleeding gums when brushing teeth</li>
            <li>Nosebleeds</li>
            <li>Easy bruising</li>
            <li>Prolonged bleeding from cuts</li>
          </ul>
          <div className="bg-red-50 border-l-4 border-red-400 p-3 text-sm mb-3">
            <p className="font-medium text-red-800">Seek medical attention immediately if you experience:</p>
            <ul className="list-disc pl-5 text-red-700">
              <li>Severe or unusual bleeding</li>
              <li>Red or brown urine</li>
              <li>Black or bloody stool</li>
              <li>Vomit that looks like coffee grounds</li>
              <li>Coughing up blood</li>
              <li>Severe headache or dizziness</li>
              <li>Unusual joint pain or swelling</li>
            </ul>
          </div>
          <p className="text-sm text-gray-700">
            Report any unusual symptoms to your healthcare provider promptly.
          </p>
        </>
      )
    },
    {
      id: "food-interactions",
      title: "Food and Medication Interactions",
      content: (
        <>
          <p className="text-sm text-gray-700 mb-3">
            Warfarin interacts with many foods, supplements, and medications. It's important to maintain consistency in your diet while taking warfarin.
          </p>
          
          <h4 className="font-medium text-sm mb-2">Foods containing vitamin K may reduce warfarin's effectiveness:</h4>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {["Kale", "Spinach", "Brussels sprouts", "Collard greens", "Broccoli", "Green tea"].map((food, index) => (
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
          
          <h4 className="font-medium text-sm mb-2">Medications to discuss with your doctor:</h4>
          <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
            <li>Antibiotics</li>
            <li>Anti-inflammatory drugs (like aspirin, ibuprofen)</li>
            <li>Antidepressants</li>
            <li>Antacids</li>
            <li>Vitamin supplements (especially vitamin K)</li>
            <li>Herbal supplements (like St. John's Wort, ginseng)</li>
          </ul>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm">
            <p className="font-medium text-blue-800">Recommendation</p>
            <p className="text-blue-700">Always inform all healthcare providers that you are taking warfarin before starting any new medication or supplement.</p>
          </div>
        </>
      )
    },
    {
      id: "emergency-info",
      title: "Emergency Information",
      content: (
        <>
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <p className="text-sm font-medium text-red-700">Always carry identification that states you take warfarin.</p>
          </div>
          
          <p className="text-sm text-gray-700 mb-3">In case of emergency:</p>
          <ol className="list-decimal pl-5 text-sm text-gray-700 mb-4">
            <li className="mb-2">Call emergency services (911) immediately for severe bleeding or injury</li>
            <li className="mb-2">Inform medical personnel that you take warfarin</li>
            <li className="mb-2">Contact your healthcare provider for guidance on minor bleeding episodes</li>
          </ol>
          
          <div className="border border-gray-200 rounded-lg p-3 mb-3">
            <h4 className="font-medium text-sm mb-2">Emergency Contact Information</h4>
            <p className="text-sm mb-1"><span className="font-medium">Doctor:</span> Dr. Elizabeth Chen</p>
            <p className="text-sm mb-1"><span className="font-medium">Phone:</span> (555) 123-4567</p>
            <p className="text-sm"><span className="font-medium">Anticoagulation Clinic:</span> (555) 987-6543</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="destructive">
              <AlertCircle className="mr-1 h-4 w-4" /> Emergency Contacts
            </Button>
            <Button variant="outline" className="text-primary border-primary">
              <CreditCard className="mr-1 h-4 w-4" /> Medical ID Card
            </Button>
          </div>
        </>
      )
    }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Warfarin Information</h2>
      
      {/* Current Medication */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Warfarin</h3>
              <p className="text-sm text-gray-500 mb-2">Anticoagulant medication</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Current Dose: 5mg
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                  Target INR: 2.0-3.0
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
          )).filter(section => !section.title.includes('Emergency Contact Information'))}
        </Accordion>
      </div>
    </div>
  );
}
