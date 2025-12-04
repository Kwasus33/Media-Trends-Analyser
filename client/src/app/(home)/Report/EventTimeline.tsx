import { CalendarClock, Circle } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';

type EventTimelineProps = {
  timeline: Record<string, string>;
};

export function EventTimeline({ timeline }: EventTimelineProps) {
  const sortedEntries = Object.entries(timeline).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  return (
    <SectionWrapper
      title="Event Timeline"
      icon={<CalendarClock className="w-5 h-5 text-sky-400" />}
    >
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-4 pb-4">
        <div className="relative ml-3.5 border-l-2 border-gray-800 space-y-8 py-2">
          {sortedEntries.map(([date, content]) => (
            <div key={date} className="relative pl-8">
              <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-gray-950 border-2 border-sky-500 z-10 shadow-[0_0_10px_rgba(14,165,233,0.3)]" />

              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-950/30 border border-sky-500/20 text-sky-300 text-sm font-mono font-medium">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="p-5 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                <ul className="flex flex-col gap-3">
                  {content.split(';').map((sentence, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-gray-300 text-sm md:text-base leading-relaxed"
                    >
                      <Circle className="w-1.5 h-1.5 mt-2 shrink-0 fill-gray-500 text-transparent" />
                      <span>{sentence.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
