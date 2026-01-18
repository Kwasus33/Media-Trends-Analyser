'use client';

import { useState, useRef } from 'react';
import { CalendarClock, ChevronRight } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Box } from '@/components/Box';

type EventTimelineProps = {
  timeline: Record<string, string>;
  isExport?: boolean;
};

type PrintableReportProps = EventTimelineProps & { dates: string[] };

type TimelineNodeProps = {
  date: string;
  isActive: boolean;
  isPast: boolean;
  isLast: boolean;
  onClick: () => void;
  transitionDelay: string;
};

type TimelineContentProps = {
  date: string;
  content: string;
};

const ANIMATION_DURATION = 150;

export function EventTimeline({ timeline, isExport }: EventTimelineProps) {
  const sortedDates = Object.keys(timeline).sort();
  const [selectedDate, setSelectedDate] = useState(sortedDates[0]);
  const [prevIndex, setPrevIndex] = useState(0);

  const selectedIndex = sortedDates.indexOf(selectedDate);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (date: string) => {
    setPrevIndex(selectedIndex);
    setSelectedDate(date);

    if (scrollRef.current) {
      const selectedButton = scrollRef.current.querySelector(
        `[data-date="${date}"]`
      );

      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const direction = selectedIndex >= prevIndex ? 'forward' : 'backward';

  if (isExport) {
    return <PrintableTimeline timeline={timeline} dates={sortedDates} />;
  }

  return (
    <SectionWrapper
      title="Event Timeline"
      icon={<CalendarClock className="w-5 h-5 text-sky-400" />}
    >
      <div className="flex flex-col gap-4">
        {sortedDates.length > 1 && (
          <div
            ref={scrollRef}
            className="flex items-start justify-start px-0 py-4 sm:p-4 overflow-x-auto custom-scrollbar scroll-smooth"
          >
            {sortedDates.map((date, index) => {
              let delay = 0;

              if (direction === 'forward') {
                if (index >= prevIndex && index < selectedIndex) {
                  delay = (index - prevIndex) * ANIMATION_DURATION;
                }
              } else {
                if (index >= selectedIndex && index < prevIndex) {
                  const reversedIndex = prevIndex - 1 - index;
                  delay = reversedIndex * ANIMATION_DURATION;
                }
              }

              return (
                <TimelineNode
                  key={date}
                  date={date}
                  isActive={date === selectedDate}
                  isPast={index < selectedIndex}
                  isLast={index === sortedDates.length - 1}
                  onClick={() => handleNodeClick(date)}
                  transitionDelay={`${delay}ms`}
                />
              );
            })}
          </div>
        )}

        <TimelineContent date={selectedDate} content={timeline[selectedDate]} />
      </div>
    </SectionWrapper>
  );
}

function TimelineNode({
  date,
  isActive,
  isPast,
  isLast,
  onClick,
  transitionDelay,
}: TimelineNodeProps) {
  const dateObj = new Date(date);

  return (
    <div className="flex items-start relative shrink-0">
      <button
        data-date={date}
        onClick={onClick}
        className="group relative z-10 flex flex-col items-center gap-3 w-16 shrink-0 focus:outline-none"
      >
        <div
          className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            isActive
              ? 'bg-sky-500 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.6)] scale-125'
              : isPast
                ? 'bg-sky-900 border-sky-700 group-hover:bg-sky-400'
                : 'bg-gray-950 border-gray-600 group-hover:border-sky-400'
          }`}
        />

        <span
          className={`text-xs font-mono font-medium whitespace-nowrap transition-colors ${
            isActive
              ? 'text-sky-400'
              : 'text-gray-500 group-hover:text-gray-300'
          }`}
        >
          {dateObj.toLocaleDateString('en-GB', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </button>

      {!isLast && (
        <div className="w-20 sm:w-32 h-0.5 relative -mx-8 z-0 mt-1.75">
          <div className="absolute inset-0 bg-gray-800 rounded-full" />

          <div
            style={{
              transitionDelay,
              transitionDuration: `${ANIMATION_DURATION}ms`,
            }}
            className={`absolute inset-0 bg-sky-500/50 rounded-full transition-transform ease-linear origin-left ${
              isPast ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </div>
      )}
    </div>
  );
}

function TimelineContent({ date, content }: TimelineContentProps) {
  const hasContent = content && content.trim().length > 0;

  return (
    <Box className="w-full bg-black/20 border border-white/5 px-2 py-6 sm:p-6 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 hidden md:block">
        <CalendarClock className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <h4
          suppressHydrationWarning
          className="text-xl font-bold text-sky-400 mb-4 px-1 flex items-center gap-2"
        >
          {new Date(date).toLocaleDateString('en-GB', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </h4>

        {hasContent ? (
          <ul className="flex flex-col gap-4">
            {content.split(';').map((sentence, index) => {
              if (!sentence.trim()) return null;

              return (
                <li
                  key={index}
                  className="flex gap-1 sm:gap-3 text-gray-300 text-base leading-relaxed items-start"
                >
                  <ChevronRight className="w-5 h-5 mt-0.5 shrink-0 text-sky-500/50" />
                  <span>{sentence.trim()}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 gap-2 border border-dashed border-white/10 rounded-lg bg-white/5 mx-1">
            <span className="text-lg font-medium text-gray-400">
              No data available
            </span>
            <span className="text-sm">
              There are no recorded events for this date.
            </span>
          </div>
        )}
      </div>
    </Box>
  );
}

function PrintableTimeline({ timeline, dates }: PrintableReportProps) {
  return (
    <SectionWrapper
      title="Event Timeline"
      icon={<CalendarClock className="w-5 h-5 text-sky-400" />}
    >
      <div className="flex flex-col">
        {dates.map((date) => {
          const content = timeline[date];
          const hasContent = content && content.trim().length > 0;

          return (
            <div
              key={date}
              className="border-l-2 border-sky-500/30 pl-4 pb-2 my-4 break-inside-avoid"
            >
              <h4 className="text-lg font-bold text-sky-400 mb-2">
                {new Date(date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h4>

              {hasContent ? (
                <ul className="flex flex-col gap-2">
                  {content.split(';').map((sentence, index) =>
                    sentence.trim() ? (
                      <li key={index} className="text-gray-300 text-sm">
                        • {sentence.trim()}
                      </li>
                    ) : null
                  )}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-sm">
                  No events recorded.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
