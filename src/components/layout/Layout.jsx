import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-900 border-t-200 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p className="text-lg font-semibold text-emerald-500 mb-4">
            © {new Date().getFullYear()} Al-Quran Web
          </p>
          <p className="text-sm">
            Data Al-Quran disediakan oleh{' '}
            <a
              href="https://quran.api-docs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:underline transition-all duration-300"
            >
              Quran.com API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
