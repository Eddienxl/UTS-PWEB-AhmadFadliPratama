import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quranAPI } from '../quranAPI';

// Component for displaying a single Surah within a Juz
const SurahInJuz = ({ surah }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-700 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm mr-4">
          {surah.number}
        </div>
        <div>
          <h4 className="font-medium text-white">{surah.name}</h4>
          <p className="text-sm text-gray-400">{surah.translation}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-arabic text-white">{surah.name_arabic}</p>
        <p className="text-sm text-gray-400">{surah.ayahs} Ayat</p>
      </div>
    </div>
  );
};

export default function JuzGrid({ searchTerm = '' }) {
  const [juzs, setJuzs] = useState([]);
  const [surahsByJuz, setSurahsByJuz] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJuzs, setFilteredJuzs] = useState([]);

  useEffect(() => {
    fetchJuzs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJuzs(juzs);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    
    // Filter juzs based on juz number and surah names/translations
    const filteredResults = juzs.filter(juz => {
      const surahsInThisJuz = surahsByJuz[juz.juz_number] || [];
      const juzMatch = `juz ${juz.juz_number}`.includes(searchTermLower);
      const surahMatch = surahsInThisJuz.some(surah => 
        surah.name.toLowerCase().includes(searchTermLower) ||
        surah.translation.toLowerCase().includes(searchTermLower)
      );
      return juzMatch || surahMatch;
    });

    setFilteredJuzs(filteredResults);
  }, [searchTerm, juzs, surahsByJuz]);

  const fetchJuzs = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getAllJuzs();
  
      const isArray = Array.isArray(data);
  
      if (isArray) {
        setJuzs(data); // karena data langsung array of juzs
        fetchSurahsForJuzs(data);
      } else if (data?.juzs && Array.isArray(data.juzs)) {
        setJuzs(data.juzs);
        fetchSurahsForJuzs(data.juzs);
      } else {
        setError('Data juz tidak valid.');
        console.error('Invalid data format for juzs:', data);
      }
    } catch (err) {
      setError('Gagal memuat data juz. Silakan coba lagi nanti.');
      console.error('Error fetching juzs:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchSurahsForJuzs = async (juzs) => {
    try {
      const surahDataPromises = juzs.map(async (juz) => {
        const surahsInJuz = await quranAPI.getSurahsInJuz(juz.juz_number);
        return { juzNumber: juz.juz_number, surahs: surahsInJuz };
      });

      const surahDataResults = await Promise.all(surahDataPromises);
      const surahsByJuzMap = surahDataResults.reduce((acc, { juzNumber, surahs }) => {
        acc[juzNumber] = surahs;
        return acc;
      }, {});

      setSurahsByJuz(surahsByJuzMap);
    } catch (err) {
      setError('Gagal memuat data surah. Silakan coba lagi nanti.');
      console.error('Error fetching surahs:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-800 border border-red-600 rounded-lg p-4 text-center text-red-200">
        {error}
        <button
          onClick={fetchJuzs}
          className="mt-2 text-sm text-red-200 hover:text-red-400 underline"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (filteredJuzs.length === 0 && searchTerm) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-2">
          Tidak ada hasil untuk "{searchTerm}"
        </h3>
        <p className="text-gray-400">
          Coba kata kunci lain atau periksa ejaan Anda.
        </p>
      </div>
    );
  }

  // Group juzs into pairs for display
  const groupedJuzs = [];
  for (let i = 0; i < filteredJuzs.length; i += 2) {
    groupedJuzs.push(filteredJuzs.slice(i, i + 2));
  }

  return (
    <div className="space-y-6">
      {groupedJuzs.map((juzPair, pairIndex) => (
        <div key={`pair-${pairIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {juzPair.map((juz) => (
            <div key={`juz-${juz.juz_number}`} className="bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center p-4">
                <h3 className="font-semibold text-lg text-white">
                  Juz {juz.juz_number}
                </h3>
                <Link
                  to={`/juz/${juz.juz_number}`}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Read Juz
                </Link>
              </div>

              <div className="bg-gray-700 rounded-lg shadow-sm overflow-hidden">
                {surahsByJuz[juz.juz_number] && surahsByJuz[juz.juz_number].length > 0 ? (
                  <div className="divide-y divide-gray-600 p-4">
                    {surahsByJuz[juz.juz_number].map((surah, surahIndex) => (
                      <SurahInJuz 
                        key={`juz-${juz.juz_number}-surah-${surah.number}-${surahIndex}`} 
                        surah={surah} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 p-4">
                    <p>Surah information not available</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
