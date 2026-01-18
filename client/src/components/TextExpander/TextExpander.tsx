'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type TextExpanderProps = {
  children: React.ReactNode;
  collapsedHeight?: number;
  className?: string;
  buttonColor?: string;
  buttonClassName?: string;
  fadeHeight?: number;
};

export function TextExpander({
  children,
  collapsedHeight = 200,
  className = '',
  buttonColor = 'text-indigo-400',
  buttonClassName = 'bg-black/20 backdrop-blur-md hover:bg-black/40',
  fadeHeight = 110,
}: TextExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [fullHeight, setFullHeight] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        const scrollHeight = contentRef.current.scrollHeight;
        setFullHeight(scrollHeight);
        setShowButton(scrollHeight > collapsedHeight);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children, collapsedHeight]);

  const fadeStart = Math.max(0, collapsedHeight - fadeHeight);

  const maskStyle =
    !isExpanded && showButton
      ? {
          maskImage: `linear-gradient(to bottom, black ${fadeStart}px, transparent ${collapsedHeight}px)`,
          WebkitMaskImage: `linear-gradient(to bottom, black ${fadeStart}px, transparent ${collapsedHeight}px)`,
        }
      : {};

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{
          maxHeight: isExpanded ? fullHeight : collapsedHeight,
        }}
      >
        <div ref={contentRef} style={maskStyle}>
          {children}
        </div>

        {!isExpanded && showButton && (
          <div className="absolute bottom-2 left-0 w-full flex justify-center z-10">
            <button
              onClick={() => setIsExpanded(true)}
              className={`
                flex items-center gap-1 text-sm font-medium hover:underline focus:outline-none
                px-3 py-1 rounded-full transition-all shadow-lg
                ${buttonClassName} ${buttonColor}
              `}
            >
              Read More <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isExpanded && showButton && (
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={() => setIsExpanded(false)}
            className={`
              flex items-center gap-1 p-1 text-sm font-medium hover:underline focus:outline-none
              ${buttonColor}
            `}
          >
            Show Less <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
