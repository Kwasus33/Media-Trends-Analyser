export type Category =
  | 'Technology'
  | 'Politics'
  | 'Economy'
  | 'Sport'
  | 'Culture'
  | 'Society';

type CategoryDetails = {
  color: string;
  bg: string;
  text: string;
  border: string;
};

export const CATEGORIES: Record<Category | 'default', CategoryDetails> = {
  Politics: {
    color: '#10b981',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  Sport: {
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  Technology: {
    color: '#3b82f6',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  Economy: {
    color: '#8b5cf6',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/20',
  },
  Culture: {
    color: '#ec4899',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  Society: {
    color: '#6366f1',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
  },
  default: {
    color: '#9ca3af',
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
  },
};

export function getCategoryConfig(category: string): CategoryDetails {
  return CATEGORIES[category as Category] || CATEGORIES.default;
}
