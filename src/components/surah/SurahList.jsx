import { useEffect, useState } from 'react';
import { quranAPI } from '../quranAPI';
import SurahCard from './SurahCard';

export default function SurahList({ searchTerm = '' }) {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  useEffect(() => {
    if (searchTerm !== '') {
      setSearchQuery(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    filterSurahs();
  }, [searchQuery, surahs]);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getAllSurahs();
      if (Array.isArray(data)) {
        setSurahs(data);
        setFilteredSurahs(data);
      } else if (data?.chapters && Array.isArray(data.chapters)) {
        setSurahs(data.chapters);
        setFilteredSurahs(data.chapters);
      } else {
        setError('Data surah tidak valid.');
        console.error('Invalid data format for surahs:', data);
      }
    } catch (err) {
      setError('Gagal memuat data surah. Silakan coba lagi nanti.');
      console.error('Error fetching surahs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSurahs = () => {
    if (!Array.isArray(surahs)) {
      console.error('Expected surahs to be an array but got:', surahs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = surahs.filter(surah => 
      surah.name_simple.toLowerCase().includes(query) ||
      surah.translated_name.name.toLowerCase().includes(query) ||
      surah.id.toString().includes(query)
    );
    setFilteredSurahs(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-center text-red-300 shadow-md">
        {error}
        <button
          onClick={fetchSurahs}
          className="mt-2 text-sm text-red-400 hover:text-red-200 underline"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!Array.isArray(filteredSurahs) || filteredSurahs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Tidak ada surah yang sesuai dengan pencarian Anda.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 px-4 py-8 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurahs.map(surah => (
          <SurahCard
            key={surah.id}
            surah={surah}
            onClick={() => {
              console.log('Selected surah:', surah);
            }}
          />
        ))}
      </div>
    </div>
  );
}
