
import React, { useState } from 'react';
import { PlusIcon, ChevronDownIcon, CloseIcon, CalendarIcon } from './icons';

interface FiltersProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

const FilterButton: React.FC<{ children: React.ReactNode; active?: boolean; hasDropdown?: boolean }> = ({ children, active, hasDropdown }) => (
  <button className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border rounded-full transition-colors ${
      active
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`}>
    <span>{children}</span>
    {hasDropdown && <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
  </button>
);

const TimeButton: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active }) => (
  <button className={`px-4 py-1 text-sm rounded-full transition-colors ${
      active
        ? 'bg-green-600 text-white'
        : 'text-gray-600 hover:bg-gray-200'
    }`}>
    {children}
  </button>
);


const Filters: React.FC<FiltersProps> = ({ keywords, onKeywordsChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword.toLowerCase())) {
      onKeywordsChange([...keywords, newKeyword.toLowerCase()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    onKeywordsChange(keywords.filter(k => k !== keywordToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };


  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="font-semibold">Фильтры</h2>
        <ChevronDownIcon className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
              <div></div>
              <div className="flex items-center space-x-4 text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                      <span>Строгая фильтрация</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                      <span>Локации «н/д»</span>
                  </label>
                  <button className="text-blue-600 hover:underline">Сбросить</button>
              </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center flex-wrap gap-2">
              <div className="relative flex items-center border border-gray-300 rounded-md">
                 <span className="pl-3 pr-2 text-sm text-gray-700 font-medium">Ключевые слова</span>
                 <button onClick={addKeyword} className="p-1.5 border-l border-gray-300 text-gray-500 hover:bg-gray-100">
                    <PlusIcon className="w-4 h-4" />
                 </button>
              </div>

              {keywords.map(keyword => (
                <div key={keyword} className="flex items-center bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                  <span>{keyword}</span>
                  <button onClick={() => removeKeyword(keyword)} className="ml-1.5 text-green-600 hover:text-green-800">
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
             <div className="mt-2 pl-2">
                <input 
                    type="text" 
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Добавить ключевое слово и нажать Enter..."
                    className="w-full sm:w-1/3 p-1 bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-blue-500 rounded"
                />
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center gap-3">
             <FilterButton hasDropdown>Локация</FilterButton>
             <FilterButton hasDropdown>Источник</FilterButton>
             <FilterButton active>ВКонтакте</FilterButton>
             <FilterButton hasDropdown>Категория</FilterButton>
             
             <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                <TimeButton active>Все</TimeButton>
                <TimeButton>Посты</TimeButton>
                <TimeButton>Комментарии</TimeButton>
             </div>
             
             <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                <TimeButton>Всё время</TimeButton>
                <TimeButton active>Сутки</TimeButton>
                <TimeButton>3 дня</TimeButton>
                <TimeButton>Неделя</TimeButton>
             </div>

             <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span>Выбрать даты</span>
             </button>
             <FilterButton hasDropdown>Дополнительно</FilterButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
