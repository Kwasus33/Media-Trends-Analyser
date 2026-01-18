import { Lightbulb } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';

type KeyInsightsProps = {
  insights: string[];
};

export function KeyInsights({ insights }: KeyInsightsProps) {
  if (insights.length === 0) return null;

  const filteredInsights = insights.filter(
    (insight) => insight.trim().length > 0
  );

  return (
    <SectionWrapper
      title="Key Insights"
      icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}
    >
      <div className="flex flex-col gap-4 text-left">
        {filteredInsights.map((insight, index) => (
          <div
            key={index}
            className="group flex flex-col sm:flex-row gap-4 items-center sm:items-start p-4 rounded-xl bg-black/40 border border-gray-800 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all duration-300"
          >
            <span className="shrink-0 flex items-center justify-center w-16 sm:w-8 h-8 rounded-lg bg-gray-800 text-yellow-500 font-mono text-sm border border-gray-700 group-hover:border-yellow-500/50 transition-colors">
              {index + 1}
            </span>

            <div className="flex flex-col gap-1">
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors">
                {insight}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
