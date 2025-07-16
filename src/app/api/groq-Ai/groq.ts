import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function askgroq(customPrompt?: string) {
  const chatCompletion = await getGroqChatCompletion(customPrompt);
  // Print the completion returned by the LLM.
  return chatCompletion.choices[0].message.content;
  // You can also return the chatCompletion object if you need more details.
}

export async function getGroqChatCompletion(customPrompt?: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `You are a helpful assistant that helps users with their personal finance questions. You can provide advice on budgeting, saving, and spending: ${customPrompt}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
