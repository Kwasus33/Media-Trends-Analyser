import { TrendingUp, TrendingDown, Sparkles, Activity } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';

type TrendsData = {
  rising: string[];
  declining: string[];
  emerging: string[];
};

type TrendAnalysisProps = {
  trends: TrendsData;
};

export function TrendAnalysis({ trends }: TrendAnalysisProps) {
  return (
    <SectionWrapper
      title="Trend Analysis"
      icon={<Activity className="w-5 h-5 text-red-600" />}
    >
      <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-6 w-full text-left">
        <TrendGroup
          title="Rising Trends"
          items={trends.rising}
          icon={<TrendingUp className="w-5 h-5" />}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-900/20 border-emerald-500/20"
        />

        <TrendGroup
          title="Emerging Signals"
          items={trends.emerging}
          icon={<Sparkles className="w-5 h-5" />}
          colorClass="text-blue-400"
          bgClass="bg-blue-900/20 border-blue-500/20"
        />

        <TrendGroup
          title="Declining Topics"
          items={trends.declining}
          icon={<TrendingDown className="w-5 h-5" />}
          colorClass="text-rose-400"
          bgClass="bg-rose-900/20 border-rose-500/20"
        />
      </div>
    </SectionWrapper>
  );
}

function TrendGroup({
  title,
  items,
  icon,
  colorClass,
  bgClass,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div
      className={`flex flex-col gap-4 p-4 sm:p-6 rounded-xl border ${bgClass} transition-all hover:bg-opacity-30`}
    >
      <div
        className={`flex items-center gap-2 font-bold text-lg ${colorClass}`}
      >
        {icon}
        <h3>{title}</h3>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-white/5 hover:border-white/10 transition-colors"
          >
            <span
              className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')}`}
            />
            <span className="text-gray-300 text-sm font-medium leading-relaxed">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
