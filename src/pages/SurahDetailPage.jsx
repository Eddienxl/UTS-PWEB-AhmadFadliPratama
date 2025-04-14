import { ChevronLeftIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quranAPI } from '../components/quranAPI';

export default function SurahDetailPage() {
  const { surahNumber } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoadingReciters, setIsLoadingReciters] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSurahDetails();
    fetchReciters();
  }, [surahNumber]);

  useEffect(() => {
    if (selectedReciter) {
      fetchAudio();
    }
  }, [selectedReciter]);

  const fetchReciters = async () => {
    try {
      setIsLoadingReciters(true);
      const data = await quranAPI.getReciters();
      setReciters(data.recitations);
      if (data.recitations.length > 0) {
        setSelectedReciter(data.recitations[0].id);
      }
    } catch (err) {
      console.error('Error fetching reciters:', err);
    } finally {
      setIsLoadingReciters(false);
    }
  };

  const fetchAudio = async () => {
    try {
      setIsLoadingAudio(true);
      const data = await quranAPI.getSurahAudio(selectedReciter, surahNumber);
      setAudioUrl(data.audio_file.audio_url);
    } catch (err) {
      console.error('Error fetching audio:', err);
      setAudioUrl(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReciterChange = (e) => {
    setSelectedReciter(e.target.value);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const fetchSurahDetails = async () => {
    try {
      setLoading(true);
      const data = await quranAPI.getSurahDetails(surahNumber);
      const versesWithNumbers = data.verses.map((verse, index) => ({
        ...verse,
        verse_number: index + 1
      }));
      setSurahData({
        ...data,
        verses: versesWithNumbers
      });
    } catch (err) {
      setError('Gagal memuat detail surah. Silakan coba lagi nanti.');
      console.error('Error fetching surah details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-800/20 border border-red-500 text-red-300 rounded-lg p-4 text-center">
          {error}
          <button
            onClick={fetchSurahDetails}
            className="mt-2 text-sm text-red-400 hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!surahData) return null;

  const { surah, verses, translations, transliterations } = surahData;

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Audio controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedReciter}
              onChange={handleReciterChange}
              disabled={isLoadingReciters}
              className="flex-1 bg-gray-900 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {isLoadingReciters ? (
                <option>Loading...</option>
              ) : (
                reciters.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.reciter_name}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={handlePlayPause}
              disabled={!audioUrl || isLoadingAudio}
              className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:opacity-50"
            >
              {isLoadingAudio ? (
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-75"></div>
              ) : isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>

        {/* Back link and title */}
        <Link
          to="/surah"
          className="inline-flex items-center text-gray-400 hover:text-emerald-400 mb-6"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Kembali ke Daftar Surah
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{surah.name_simple} ({surah.name_arabic})</h1>
          <p className="text-gray-400 mb-2">{surah.translated_name.name}</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span>{surah.verses_count} Ayat</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="capitalize">{surah.revelation_place}</span>
          </div>
        </div>

        {/* Verses */}
        <div className="space-y-6">
          {verses.map((verse, index) => (
            <div
              key={verse.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white font-semibold text-lg">
                  {index + 1}
                </div>
              </div>

              <div className="text-right mb-4 select-all">
                <p className="font-arabic text-3xl leading-loose text-white">
                  {verse.text_uthmani}
                </p>
              </div>

              {transliterations && transliterations[index] && (
                <div className="mb-4">
                  <p className="text-gray-400 italic leading-relaxed">
                    {transliterations[index].text}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-300 leading-relaxed">
                  {translations[index].text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
