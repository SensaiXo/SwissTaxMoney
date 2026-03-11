'use client';

interface GrowthBadgeProps {
  change: number | null;
}

export function GrowthBadge({ change }: GrowthBadgeProps) {
  if (change === null) return null;

  const isPositive = change > 0;
  const isNeutral = Math.abs(change) < 0.1;

  if (isNeutral) {
    return (
      <span className="inline-flex items-center text-xs text-gray-400 ml-1">
        0%
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium ml-1 ${
        isPositive ? 'text-amber-600' : 'text-emerald-600'
      }`}
    >
      {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
    </span>
  );
}
