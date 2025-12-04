import { Lightbulb } from 'lucide-react';

type Props = {
  insights: string[];
};

export function KeyInsights({ insights }: Props) {
  return (
    <div className="w-full bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-6">
        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="text-left">
          <h3 className="text-2xl font-bold text-white">Strategic Insights</h3>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-left">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="group flex gap-4 items-start p-4 rounded-xl bg-black/40 border border-gray-800 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all duration-300"
          >
            <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 text-yellow-500 font-mono text-sm border border-gray-700 group-hover:border-yellow-500/50 transition-colors">
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
    </div>
  );
}
