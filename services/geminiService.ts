
import { GoogleGenAI, Type } from "@google/genai";
import type { Post } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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

export const fetchSocialMediaPosts = async (keywords: string[]): Promise<Post[]> => {
  if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
  }
  if (keywords.length === 0) {
      return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: generatePrompt(keywords),
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
    return parsedData.map((post: Omit<Post, 'id'>) => ({
        ...post,
        id: crypto.randomUUID(),
    }));

  } catch (error) {
    console.error("Error fetching data from Gemini API:", error);
    throw new Error("Failed to parse social media posts. The AI might be busy. Please try again later.");
  }
};
