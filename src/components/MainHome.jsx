import { Link } from 'react-router-dom';

export default function MainHome() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2344ffdd' fill-opacity='0.05'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-40 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 drop-shadow-glow text-emerald-300 font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-16 font-arabic">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>

          <Link
            to="/surah"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300"
          >
            Mulai Membaca
          </Link>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg
          className="fill-current text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
        >
          <path
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
