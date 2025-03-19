// Import this file when needed to make OpenAI API calls
// NOTE: The backend already handles OpenAI integration, so this is just a reference

/*
When using OpenAI API in this application, follow these guidelines:
1. Always use the newest OpenAI model "gpt-4o"
2. Use system messages that constrain the assistant to medication information only
3. When appropriate, use the response_format: { type: "json_object" } option
4. Prompt for JSON format output when structured data is needed
*/

// Example OpenAI integration for reference:

/*
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMedicationResponse(userMessage: string, conversationHistory: any[]) {
  try {
    const messages = [
      {
        role: "system",
        content: `شما یک دستیار پزشکی متخصص در اطلاعات دارویی وارفارین هستید. 
        اطلاعات دقیق درمورد وارفارین، نحوه مصرف، عوارض جانبی، تداخلات و راهنمایی‌های کلی درمان ضد انعقاد خون ارائه دهید.
        پاسخ‌ها را مختصر اما مفید نگه دارید. همیشه به زبان فارسی پاسخ دهید.
        هرگز توصیه پزشکی شخصی یا توصیه‌های دوز دارو ارائه ندهید.
        همیشه برای سوالات خاص پزشکی، مشورت با متخصصان مراقبت‌های بهداشتی را پیشنهاد دهید.`
      },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "متأسفم، در پردازش درخواست شما با خطا مواجه شدم. لطفاً بعداً دوباره تلاش کنید.";
  }
}
*/
