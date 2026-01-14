'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/Button';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const isDesktop = useBreakpoint('sm');

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const label = copied ? 'Copied Link' : 'Share';
  const iconStyle = 'w-6 h-8 sm:w-4 sm:h-4';

  return (
    <Button
      onClick={handleShare}
      className={`flex items-center gap-2 transition-all border border-gray-700 shadow-gray-500/10
        ${
          copied
            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
            : 'bg-transparent text-gray-300 hover:bg-white/5'
        }`}
    >
      {copied ? (
        <Check className={iconStyle} />
      ) : (
        <Share2 className={iconStyle} />
      )}
      {isDesktop && label}
    </Button>
  );
}
