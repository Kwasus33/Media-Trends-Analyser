import { Loader2 } from 'lucide-react';

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title,
  description,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center py-20 ${className}`}
    >
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <h3 className="text-xl font-medium text-white">{title}</h3>
      <p className="text-gray-400 text-sm mt-2">{description}</p>
    </div>
  );
}
