import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ChatMessage from "@/components/assistant/ChatMessage";
import ChatInput from "@/components/assistant/ChatInput";
import { AssistantMessage } from "@shared/schema";

export default function Assistant() {
  const [newMessage, setNewMessage] = useState("");
  
  // Fetch assistant messages
  const { data: messages, isLoading } = useQuery<AssistantMessage[]>({
    queryKey: ['/api/assistant-messages'],
  });
  
  // Create mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/assistant-messages', { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assistant-messages'] });
      setNewMessage(""); // Clear input after sending
    },
  });
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };
  
  const handleQuickQuestion = (question: string) => {
    sendMessageMutation.mutate(question);
  };
  
  // Frequently asked questions
  const faqs = [
    "محدوده هدف INR برای اکثر بیماران چیست؟",
    "آیا می‌توانم هنگام مصرف وارفارین الکل بنوشم؟",
    "از چه داروهای بدون نسخه باید اجتناب کنم؟",
    "چگونه باید برای جراحی در حین مصرف وارفارین آماده شوم؟"
  ];
  
  // Quick suggestions
  const suggestions = [
    "تداخلات غذایی؟",
    "عوارض جانبی؟", 
    "محدودیت‌های فعالیتی؟", 
    "چه زمانی با پزشک تماس بگیرم؟"
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">دستیار هوشمند</h2>
      
      {/* AI Chat Interface */}
      <Card className="mb-6 flex flex-col h-[calc(100vh-250px)]">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#E91E63] rounded-full flex items-center justify-center mr-3">
              <svg
                className="h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">دستیار وارفارین</h3>
              <p className="text-xs text-gray-500">سوالات دارویی خود را بپرسید</p>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-500">در حال بارگذاری پیام‌ها...</p>
          ) : messages && messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message.content} 
                isUser={message.isUser} 
              />
            ))
          ) : (
            <p className="text-center text-gray-500">هنوز پیامی وجود ندارد. برای شروع، سوالی بپرسید!</p>
          )}
        </div>
        
        {/* Chat Input */}
        <ChatInput 
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          suggestions={suggestions}
          onSuggestionClick={handleQuickQuestion}
          disabled={sendMessageMutation.isPending}
          isPending={sendMessageMutation.isPending}
        />
      </Card>
      
      {/* Common Questions */}
      <Card>
        <div className="p-4">
          <h3 className="font-medium mb-4">سوالات متداول</h3>
          <ul className="divide-y divide-gray-200">
            {faqs.map((question, index) => (
              <li key={index} className="py-3">
                <Button
                  variant="ghost"
                  className="w-full text-left justify-between font-normal hover:bg-gray-50"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={sendMessageMutation.isPending}
                >
                  <span className="font-medium">{question}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
