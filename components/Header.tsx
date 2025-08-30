
import React from 'react';
import { PlusIcon, RefreshIcon, PlayIcon, DownloadIcon, CogIcon, GiftIcon } from './icons';
import { PLATFORMS } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">Лента сообщений</h1>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button className="p-2 bg-white rounded-md shadow-sm">
            <PlusIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center ml-2 space-x-1">
            {PLATFORMS.map(platform => (
              <button key={platform.name} className={`px-3 py-1 text-sm font-semibold rounded-md ${platform.active ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>
                {platform.name}
              </button>
            ))}
            <button className="px-2 py-1 text-sm font-semibold text-gray-500 hover:bg-gray-200 rounded-md">...</button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        { [RefreshIcon, PlayIcon, DownloadIcon, CogIcon, GiftIcon].map((Icon, index) => (
            <button key={index} className="p-2 text-gray-500 bg-white rounded-full shadow-sm hover:bg-gray-100 hover:text-gray-800 transition-colors">
                <Icon className="w-5 h-5" />
            </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
