import { ReactNode } from 'react';

type Props = {
  title: string;
  icon?: React.ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionWrapper({
  title,
  icon,
  children,
  className = '',
}: Props) {
  return (
    <section className="w-full rounded-2xl border border-gray-800 bg-gray-900/20 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
        {icon && (
          <div className="p-2 bg-gray-800 rounded-lg text-white">{icon}</div>
        )}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className={`w-full ${className}`}>{children}</div>
    </section>
  );
}
