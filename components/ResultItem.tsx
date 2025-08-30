import React from 'react';
import type { Post } from '../types';
import { AcademicCapIcon, BookmarkIcon, ClipboardCopyIcon, UserRemoveIcon, XCircleIcon } from './icons';

interface ResultItemProps {
  post: Post;
  keywords: string[];
}

const highlightKeywords = (text: string, keywords: string[]): React.ReactNode => {
    if (!keywords?.length || !text?.trim()) {
        return text;
    }

    const filteredKeywords = keywords.filter(kw => kw.trim() !== '');
    if (filteredKeywords.length === 0) {
        return text;
    }

    // 1. Find all matches for all keywords.
    const matches: Array<{ start: number; end: number }> = [];
    for (const keyword of filteredKeywords) {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedKeyword, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({ start: match.index, end: match.index + match[0].length });
        }
    }

    if (matches.length === 0) {
        return text;
    }

    // 2. Merge overlapping intervals.
    // Sort by start index to process intervals in order.
    matches.sort((a, b) => a.start - b.start);
    
    const mergedIntervals: Array<{ start: number; end: number }> = [];
    let currentInterval = matches[0];

    for (let i = 1; i < matches.length; i++) {
        const nextInterval = matches[i];
        if (nextInterval.start < currentInterval.end) {
            // Overlap detected: extend the current interval if the next one ends later.
            currentInterval.end = Math.max(currentInterval.end, nextInterval.end);
        } else {
            // No overlap: push the completed interval and start a new one.
            mergedIntervals.push(currentInterval);
            currentInterval = nextInterval;
        }
    }
    mergedIntervals.push(currentInterval);


    // 3. Build the React nodes from the merged intervals.
    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    mergedIntervals.forEach((interval, i) => {
        // Add the text part before the current match
        if (interval.start > lastIndex) {
            result.push(text.substring(lastIndex, interval.start));
        }
        // Add the highlighted part
        result.push(
            <mark key={i} className="bg-yellow-200 not-italic font-semibold rounded px-1 py-0.5">
                {text.substring(interval.start, interval.end)}
            </mark>
        );
        lastIndex = interval.end;
    });

    // Add the remaining text after the last match
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }

    return <>{result}</>;
};


const ResultItem: React.FC<ResultItemProps> = ({ post, keywords }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow grid grid-cols-12 gap-4 items-start p-4 text-sm">
        {/* Category */}
        <div className="col-span-1 flex justify-center items-center h-full">
            <div className="p-2 bg-green-100 rounded-full">
                <AcademicCapIcon className="w-5 h-5 text-green-700" />
            </div>
        </div>

        {/* Date/Time */}
        <div className="col-span-1">
            <div className="font-semibold text-gray-800">{post.postDate.split(',')[0]}</div>
            <div className="text-gray-500">{post.postDate.split(',')[1]}</div>
        </div>

        {/* User */}
        <div className="col-span-2 flex items-center">
            <img src={`${post.user.avatarUrl}?random=${post.id}`} alt={post.user.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
                <div className="font-semibold text-gray-900">{post.user.name}</div>
                <div className="text-xs text-gray-500">{post.platform}</div>
            </div>
        </div>

        {/* Message */}
        <div className="col-span-5">
            <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-blue-600 hover:underline">
                {highlightKeywords(post.message, keywords)}
            </a>
        </div>
        
        {/* City */}
        <div className="col-span-2 text-gray-700">{post.city}</div>

        {/* Actions */}
        <div className="col-span-1 flex items-center justify-end space-x-2 text-gray-400">
            <button className="hover:text-blue-600"><BookmarkIcon className="w-5 h-5" /></button>
            <button className="hover:text-green-600"><ClipboardCopyIcon className="w-5 h-5" /></button>
            <button className="hover:text-orange-600"><UserRemoveIcon className="w-5 h-5" /></button>
            <button className="hover:text-red-600"><XCircleIcon className="w-5 h-5" /></button>
        </div>
    </div>
  );
};

export default ResultItem;