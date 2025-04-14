import { BookOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import JuzGrid from '../components/juz/JuzGrid';
import SurahList from '../components/surah/SurahList';

export default function SurahPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const tabs = [
    {
      id: 'all',
      name: 'Semua Surah',
      icon: <BookOpenIcon className="h-5 w-5" />
    },
    {
      id: 'juz',
      name: 'Juz',
      icon: <BookOpenIcon className="h-5 w-5" />
    }
  ];

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Daftar Surah Al-Quran
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg shadow-sm p-1 inline-flex border border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        {(activeTab === 'all' || activeTab === 'juz') && (
          <div className="mb-8 relative max-w-2xl mx-auto">
            <div
              className={`flex items-center border ${
                isSearchFocused
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-gray-600'
              } bg-gray-800 rounded-lg overflow-hidden transition-all duration-200`}
            >
              <div className="pl-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari surah atau juz berdasarkan nama atau nomor..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'all' && <SurahList searchTerm={searchTerm} />}
        {activeTab === 'juz' && <JuzGrid searchTerm={searchTerm} />}
      </div>
    </div>
  );
}
