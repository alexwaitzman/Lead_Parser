
import React from 'react';
import type { Post } from '../types';
import ResultItem from './ResultItem';

interface ResultsFeedProps {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  keywords: string[];
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="flex items-center w-1/4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                    <div className="w-1/2 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="w-1/6">
                       <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const ResultsFeed: React.FC<ResultsFeedProps> = ({ posts, isLoading, error, keywords }) => {
  if (isLoading) {
    return (
        <div className="mt-6">
            <SkeletonLoader/>
        </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-red-600">Произошла ошибка</h3>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="mt-6 text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">Сообщений не найдено</h3>
        <p className="mt-2 text-gray-600">Попробуйте изменить ключевые слова или расширить фильтры.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="text-xs text-gray-500 grid grid-cols-12 gap-4 px-4 mb-2">
                <div className="col-span-1">Катег.</div>
                <div className="col-span-1">Дата/время</div>
                <div className="col-span-2">Пользователь</div>
                <div className="col-span-5">Сообщение</div>
                <div className="col-span-2">Город</div>
                <div className="col-span-1"></div>
            </div>
            <div className="space-y-2">
                {posts.map(post => (
                  <ResultItem key={post.id} post={post} keywords={keywords} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsFeed;
