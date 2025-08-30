
import type { Post, Platform } from '../types';

/**
 * Fetches social media posts from the backend API based on keywords and selected platforms.
 * @param keywords - An array of keywords to search for.
 * @param platforms - An array of social media platforms to search within (e.g., 'VK', 'Telegram').
 * @returns A promise that resolves to an array of Post objects.
 * @throws Will throw an error if the API request fails or the response is not ok.
 */
export const fetchSocialMediaPosts = async (keywords: string[], platforms: Platform[]): Promise<Post[]> => {
  if (keywords.length === 0 || platforms.length === 0) {
      return [];
  }

  try {
    const response = await fetch('/api/generate-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keywords, platforms }),
    });

    if (!response.ok) {
        // Try to parse the error message from the serverless function
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    const posts: Post[] = await response.json();
    return posts;

  } catch (error) {
    console.error("Error fetching data from API route:", error);
    // Re-throw a more user-friendly error message
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    throw new Error(`Failed to parse social media posts. The AI might be busy or there's a network issue. Please try again later. (Details: ${message})`);
  }
};
