import { ChatGroq } from "@langchain/groq";

export const getModel = () => {
  return new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0, // Deterministic output
    apiKey: process.env.GROQ_API_KEY,
  });
};
