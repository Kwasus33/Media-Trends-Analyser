'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, BarChart3 } from 'lucide-react';

export function Header() {
  const handleReset = () => {
    if (window.location.search === '') {
      window.location.reload();
    } else {
      window.location.search = '';
    }
  };

  return (
    <header className="mb-12 text-center relative z-10 flex flex-col items-center">
      <h1
        onClick={handleReset}
        className="inline text-4xl md:text-6xl font-extrabold tracking-tight hover:opacity-90 transition-opacity cursor-pointer"
      >
        <span className="bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent">
          Media Trends
        </span>{' '}
        <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Analyser
        </span>
      </h1>

      <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto mb-8">
        AI-powered insights across global news sources and social platforms.
      </p>

      <NavigationMenu />
    </header>
  );
}

function NavigationMenu() {
  const pathname = usePathname();

  const isDaily = pathname === '/';
  const isPeriodic = pathname.startsWith('/periodic');

  const className = (isActive: boolean) => `
            relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
            ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `;

  return (
    <div className="inline-flex items-center p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
      <Link href="/" className={className(isDaily)}>
        <CalendarDays className="w-4 h-4" />
        <span>Daily Summary</span>
      </Link>

      <Link href="/periodic" className={className(isPeriodic)}>
        <BarChart3 className="w-4 h-4" />
        <span>Periodic Report</span>
      </Link>
    </div>
  );
}
