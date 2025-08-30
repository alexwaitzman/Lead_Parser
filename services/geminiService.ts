
import type { Post } from '../types';

export const fetchSocialMediaPosts = async (keywords: string[]): Promise<Post[]> => {
  if (keywords.length === 0) {
      return [];
  }

  try {
    const response = await fetch('/api/generate-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keywords }),
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
