
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import type { Post } from '../types';

// This function is the entry point for the serverless function.
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Check for API key
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set on the server.");
    return res.status(500).json({ error: "Server configuration error." });
  }

  try {
    const { keywords } = req.body;
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ error: "Keywords must be an array." });
    }

    if (keywords.length === 0) {
      return res.status(200).json([]);
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = generatePrompt(keywords);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              category: { type: Type.STRING },
              postDate: { type: Type.STRING },
              user: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  avatarUrl: { type: Type.STRING },
                },
              },
              message: { type: Type.STRING },
              city: { type: Type.STRING },
              postUrl: { type: Type.STRING },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Add a unique ID to each post
    const dataWithIds = parsedData.map((post: Omit<Post, 'id'>) => ({
        ...post,
        id: crypto.randomUUID(),
    }));

    return res.status(200).json(dataWithIds);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: "Failed to fetch data from AI service." });
  }
}

// Keep the prompt generation logic with the API call
const generatePrompt = (keywords: string[]): string => `
You are a social media feed generator. Your task is to create a list of realistic social media posts based on a set of keywords. These posts must be from people LOOKING FOR an English language tutor or English lessons for themselves or their children.

CRITICAL RULE: DO NOT generate posts that are advertisements FROM tutors or language schools. Only generate posts from potential students or their parents.

The user is searching with these keywords: [${keywords.join(', ')}].

Generate 5 to 10 posts. For each post, provide the following information in the specified JSON format.
- platform: One of 'VK', 'Telegram', 'Facebook', 'YouDo'.
- category: Always set this to 'Репетиторы'.
- postDate: A recent timestamp, like 'Сегодня, 17:20' or 'Вчера, 10:05'.
- user: An object with a 'name' (a realistic Russian/Ukrainian name) and an 'avatarUrl' (using 'https://picsum.photos/40/40').
- message: The text of the post. It should sound natural and include some of the keywords.
- city: A realistic city in Russia, Ukraine, or Belarus (e.g., 'Москва', 'Киев', 'Минск', 'Красноярск'). Some can be 'н/д'.
- postUrl: A placeholder URL like 'https://vk.com/post/12345'.

Ensure the message content clearly indicates a search for a service, not an offer of one. For example, use phrases like 'Ищу репетитора', 'Посоветуйте учителя', 'Нужны уроки английского'.
`;
