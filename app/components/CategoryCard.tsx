import Link from 'next/link';
import type { CofogCategory } from '../lib/cofog';
import { formatCHF } from '../lib/data';
import { GrowthBadge } from './GrowthBadge';

interface CategoryCardProps {
  category: CofogCategory;
  value: number;
  unit: string;
  maxValue: number;
  change?: number | null;
}

export function CategoryCard({ category, value, unit, maxValue, change }: CategoryCardProps) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const display =
    unit === 'PER_CAPITA'
      ? 'CHF ' + formatCHF(value)
      : unit === 'MCHF'
        ? formatCHF(value) + ' M CHF'
        : value.toFixed(1) + '%';

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="font-semibold text-gray-900 group-hover:text-[#8B2D1E] transition-colors">
            {category.label}
          </h3>
        </div>
        <span className="text-sm text-gray-400 group-hover:text-[#8B2D1E] transition-colors">
          →
        </span>
      </div>
      <p className="text-2xl font-bold mb-3" style={{ color: category.color }}>
        {display}
        <GrowthBadge change={change ?? null} />
      </p>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: category.color }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-3 line-clamp-2">{category.description}</p>
    </Link>
  );
}
