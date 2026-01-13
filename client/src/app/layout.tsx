import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/Header';
import './globals.css';
import { ScrollToTop } from '@/components/ScrollToTop';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Media Trends Analyser',
  description:
    'Stay up to date with the latest trends in social media and news',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-950 selection:bg-indigo-500/30`}
      >
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-250 h-125 bg-indigo-600/20 blur-[120px] rounded-full opacity-60" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <main className="grow w-full p-8">
            <Header />
            {children}
          </main>

          <footer className="w-full py-8 mt-auto flex flex-col gap-2 items-center justify-center text-sm text-gray-500">
            <p>Media Trends Analyser &copy; {currentYear}</p>

            <p className="flex gap-1">
              Created by{' '}
              <span className="text-gray-300 font-medium">SIAIdziwAIk</span>
            </p>
          </footer>
        </div>

        <ScrollToTop />
      </body>
    </html>
  );
}
