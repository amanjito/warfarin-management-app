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
        content: `You are a helpful medical assistant specializing in Warfarin medication information. 
        Provide accurate information about Warfarin, its usage, side effects, interactions, and general 
        anticoagulant therapy guidance. Keep responses concise but informative.
        DO NOT provide any personalized medical advice or dosing recommendations.
        Always suggest consulting healthcare providers for specific medical questions.`
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
    return "I'm sorry, I encountered an error processing your request. Please try again later.";
  }
}
*/
