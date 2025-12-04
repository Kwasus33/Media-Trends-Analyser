import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen flex flex-col`}
      >
        <div className="grow">{children}</div>

        <footer className="w-full py-8 text-center border-t border-gray-900 mt-auto bg-black">
          <div className="flex flex-col gap-2 items-center justify-center text-sm text-gray-500">
            <p>Media Trends Analyser &copy; {currentYear}</p>

            <p className="flex gap-1">
              Created by{' '}
              <span className="text-gray-300 font-medium">SIAIdziwAIk</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
