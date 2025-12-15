'use client';

export function HeaderLogo() {
  const handleReset = () => {
    if (window.location.pathname === '/' && window.location.search === '') {
      window.location.reload();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="mb-12 text-center relative z-10">
      <h1
        onClick={handleReset}
        className="text-5xl md:text-6xl font-extrabold tracking-tight hover:opacity-90 transition-opacity cursor-pointer"
      >
        <span className="bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent">
          Media Trends
        </span>{' '}
        <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Analyser
        </span>
      </h1>
      <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
        AI-powered insights across global news sources and social platforms.
      </p>
    </header>
  );
}
