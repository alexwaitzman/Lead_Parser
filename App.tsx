
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import ResultsFeed from './components/ResultsFeed';
import { fetchSocialMediaPosts } from './services/geminiService';
import type { Post, Platform } from './types';
import { INITIAL_KEYWORDS } from './constants';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string[]>(INITIAL_KEYWORDS);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['VK']);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (currentKeywords: string[], currentPlatforms: Platform[]) => {
    if (currentKeywords.length === 0 || currentPlatforms.length === 0) {
      setPosts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await fetchSocialMediaPosts(currentKeywords, currentPlatforms);
      setPosts(fetchedPosts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(keywords, selectedPlatforms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeywordsChange = (newKeywords: string[]) => {
    setKeywords(newKeywords);
    handleSearch(newKeywords, selectedPlatforms);
  };

  const handlePlatformsChange = (newPlatforms: Platform[]) => {
    setSelectedPlatforms(newPlatforms);
    handleSearch(keywords, newPlatforms);
  }

  return (
    <div className="min-h-screen text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Header />
        <main className="mt-6">
          <Filters 
            keywords={keywords} 
            onKeywordsChange={handleKeywordsChange}
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={handlePlatformsChange}
          />
          <ResultsFeed posts={posts} isLoading={isLoading} error={error} keywords={keywords} />
        </main>
      </div>
    </div>
  );
};

export default App;