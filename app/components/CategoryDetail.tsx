'use client';

import { useState } from 'react';
import type { CofogCategory } from '../lib/cofog';
import type { CofogRow } from '../lib/data';
import { SECTOR_LABELS } from '../lib/data';
import { BarChart, DoughnutChart, LineChart } from './Charts';

interface CategoryDetailProps {
  category: CofogCategory;
  data: CofogRow[];
  years: number[];
}

export function CategoryDetail({ category, data, years }: CategoryDetailProps) {
  const [sector, setSector] = useState('S1312');
  const [year, setYear] = useState(years[0]);
  const [unit, setUnit] = useState<'MCHF' | 'SHARE'>('MCHF');

  // Get parent total
  const parentRow = data.find(
    (r) => r.sector === sector && r.year === year && r.unit === unit && r.cofog === category.code
  );
  const parentValue = parentRow?.value ?? 0;

  // Get subcategory values
  const subcatData = category.subcategories.map((sub) => {
    const row = data.find(
      (r) => r.sector === sector && r.year === year && r.unit === unit && r.cofog === sub.code
    );
    return { ...sub, value: row?.value ?? 0 };
  });

  const sorted = [...subcatData].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sorted.map((s) => s.value), 1);
  const unitLabel = unit === 'MCHF' ? 'Million CHF' : '% of Total';

  const formatValue = (v: number) =>
    unit === 'MCHF'
      ? new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(v) + ' M CHF'
      : v.toFixed(1) + '%';

  // Generate muted, professional colors for subcategories
  const subColors = subcatData.map((_, i) => {
    const hue = (i * 360) / subcatData.length + 200;
    return `hsl(${hue}, 30%, 45%)`;
  });

  // Line chart: trend for each subcategory
  const allYears = [
    ...new Set(data.filter((r) => r.sector === sector && r.unit === unit).map((r) => r.year)),
  ].sort();
  const lineDatasets = category.subcategories.map((sub, i) => ({
    label: sub.label,
    color: subColors[i],
    data: allYears.map((y) => {
      const row = data.find(
        (r) => r.sector === sector && r.year === y && r.unit === unit && r.cofog === sub.code
      );
      return row?.value ?? null;
    }),
  }));

  // Parent trend
  const parentTrend = allYears.map((y) => {
    const row = data.find(
      (r) => r.sector === sector && r.year === y && r.unit === 'MCHF' && r.cofog === category.code
    );
    return row?.value ?? null;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{category.label}</h2>
            <p className="text-lg font-semibold" style={{ color: category.color }}>
              {formatValue(parentValue)} ({year})
            </p>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl">{category.description}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Government Level
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B2D1E]"
          >
            {Object.entries(SECTOR_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B2D1E]"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</label>
          <div className="flex gap-1">
            <button
              onClick={() => setUnit('MCHF')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                unit === 'MCHF'
                  ? 'bg-[#8B2D1E] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              CHF (millions)
            </button>
            <button
              onClick={() => setUnit('SHARE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                unit === 'SHARE'
                  ? 'bg-[#8B2D1E] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              % of total
            </button>
          </div>
        </div>
      </div>

      {/* Subcategory Cards with descriptions */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Where the money goes — {category.subcategories.length} subcategories
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {sorted.map((sub, i) => {
          const pct = maxValue > 0 ? (sub.value / maxValue) * 100 : 0;
          const shareOfParent =
            parentValue > 0 && unit === 'MCHF'
              ? ((sub.value / parentValue) * 100).toFixed(1)
              : null;
          return (
            <div
              key={sub.code}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{sub.label}</h4>
                <span className="text-xs text-gray-400 font-mono">{sub.code}</span>
              </div>
              <p className="text-xl font-bold mb-1" style={{ color: category.color }}>
                {formatValue(sub.value)}
                {shareOfParent && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({shareOfParent}% of {category.label})
                  </span>
                )}
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: category.color }}
                />
              </div>
              <p className="text-sm text-gray-600">{sub.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Subcategory Breakdown</h3>
          <div className="h-[350px]">
            <BarChart
              labels={sorted.map((s) => s.label)}
              values={sorted.map((s) => s.value)}
              colors={sorted.map((_, i) => subColors[subcatData.indexOf(sorted[i])] || category.color)}
              unitLabel={unitLabel}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Share Within {category.label}</h3>
          <div className="h-[350px]">
            <DoughnutChart
              labels={subcatData.map((s) => s.label)}
              values={subcatData.map((s) => s.value)}
              colors={subColors}
            />
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Total {category.label} Spending Over Time
        </h3>
        <div className="h-[300px]">
          <LineChart
            years={allYears}
            datasets={[
              {
                label: category.label + ' (Total)',
                color: category.color,
                data: parentTrend,
              },
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Subcategories Over Time — click to show/hide
        </h3>
        <LineChart years={allYears} datasets={lineDatasets} filterable />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Detailed Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Subcategory
                </th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {unit === 'MCHF' ? 'Amount (M CHF)' : 'Share (%)'}
                </th>
                {unit === 'MCHF' && (
                  <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    % of Category
                  </th>
                )}
                <th className="py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[30%]">
                  Proportion
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((sub) => {
                const pct = maxValue > 0 ? (sub.value / maxValue) * 100 : 0;
                return (
                  <tr key={sub.code} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900">{sub.label}</td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      {formatValue(sub.value)}
                    </td>
                    {unit === 'MCHF' && (
                      <td className="py-3 px-3 text-right tabular-nums text-gray-500">
                        {parentValue > 0 ? ((sub.value / parentValue) * 100).toFixed(1) + '%' : '—'}
                      </td>
                    )}
                    <td className="py-3 px-3">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: category.color }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source */}
      <p className="text-center text-xs text-gray-400 py-6">
        Source:{' '}
        <a
          href="https://www.bfs.admin.ch/asset/en/ts-x-04.02.04.03"
          target="_blank"
          className="text-[#8B2D1E] hover:underline"
        >
          Federal Statistical Office (BFS)
        </a>{' '}
        — COFOG Classification
      </p>
    </div>
  );
}
