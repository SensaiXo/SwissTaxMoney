'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '../components/DataProvider';
import { COFOG_CATEGORIES } from '../lib/cofog';
import { SECTOR_LABELS, SWISS_POPULATION, formatCHF, getYoyChange } from '../lib/data';
import { LineChart } from '../components/Charts';
import { GrowthBadge } from '../components/GrowthBadge';

type UnitMode = 'MCHF' | 'PER_CAPITA';

export default function ComparePage() {
  const { data, years } = useData();
  const [selectedCodes, setSelectedCodes] = useState<string[]>([
    COFOG_CATEGORIES[0].code,
    COFOG_CATEGORIES[1].code,
  ]);
  const [sector, setSector] = useState('S1312');
  const [unit, setUnit] = useState<UnitMode>('MCHF');

  const toggleCategory = (code: string) => {
    setSelectedCodes((prev) => {
      if (prev.includes(code)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const cofogUnit = unit === 'PER_CAPITA' ? 'MCHF' : unit;
  const year = years[0];

  const allYears = [
    ...new Set(data.filter((r) => r.sector === sector && r.unit === cofogUnit).map((r) => r.year)),
  ].sort();

  const selectedCategories = COFOG_CATEGORIES.filter((c) => selectedCodes.includes(c.code));

  const lineDatasets = selectedCategories.map((cat) => ({
    label: cat.label,
    color: cat.color,
    data: allYears.map((y) => {
      const row = data.find(
        (r) => r.sector === sector && r.year === y && r.unit === cofogUnit && r.cofog === cat.code
      );
      if (!row) return null;
      return unit === 'PER_CAPITA' ? (row.value * 1_000_000) / SWISS_POPULATION : row.value;
    }),
  }));

  const formatValue = (v: number) => {
    if (unit === 'PER_CAPITA') return 'CHF ' + formatCHF(v);
    return formatCHF(v) + ' M CHF';
  };

  const unitLabel = unit === 'MCHF' ? 'Million CHF' : 'CHF per Person';

  const unitBtnClass = (mode: UnitMode) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      unit === mode
        ? 'bg-[#8B2D1E] text-white'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link
        href="/"
        className="text-sm text-[#8B2D1E] hover:underline mb-6 inline-block"
      >
        ← Back to Overview
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Categories</h2>
      <p className="text-gray-600 mb-6">
        Select categories below to compare their spending side by side.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
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
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</label>
          <div className="flex gap-1">
            <button onClick={() => setUnit('MCHF')} className={unitBtnClass('MCHF')}>
              CHF (millions)
            </button>
            <button onClick={() => setUnit('PER_CAPITA')} className={unitBtnClass('PER_CAPITA')}>
              Per person
            </button>
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {COFOG_CATEGORIES.map((cat) => {
          const active = selectedCodes.includes(cat.code);
          return (
            <button
              key={cat.code}
              onClick={() => toggleCategory(cat.code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                active
                  ? 'text-white border-transparent'
                  : 'text-gray-500 border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={active ? { backgroundColor: cat.color } : {}}
            >
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Latest Year ({year}) — {SECTOR_LABELS[sector] ?? sector}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {unit === 'PER_CAPITA' ? 'Per Person' : 'Amount (M CHF)'}
                </th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  YoY Change
                </th>
                <th className="py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[30%]">
                  Relative Size
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedCategories
                .map((cat) => {
                  const row = data.find(
                    (r) =>
                      r.sector === sector &&
                      r.year === year &&
                      r.unit === cofogUnit &&
                      r.cofog === cat.code
                  );
                  const rawValue = row?.value ?? 0;
                  const displayValue =
                    unit === 'PER_CAPITA'
                      ? (rawValue * 1_000_000) / SWISS_POPULATION
                      : rawValue;
                  const change = getYoyChange(data, sector, year, cat.code);
                  return { cat, displayValue, change };
                })
                .sort((a, b) => b.displayValue - a.displayValue)
                .map(({ cat, displayValue, change }) => {
                  const maxVal = Math.max(
                    ...selectedCategories.map((c) => {
                      const r = data.find(
                        (r) =>
                          r.sector === sector &&
                          r.year === year &&
                          r.unit === cofogUnit &&
                          r.cofog === c.code
                      );
                      const raw = r?.value ?? 0;
                      return unit === 'PER_CAPITA'
                        ? (raw * 1_000_000) / SWISS_POPULATION
                        : raw;
                    }),
                    1
                  );
                  const pct = (displayValue / maxVal) * 100;
                  return (
                    <tr
                      key={cat.code}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-3">
                        <span className="mr-2">{cat.icon}</span>
                        <span className="font-medium text-gray-900">{cat.label}</span>
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-semibold">
                        {formatValue(displayValue)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <GrowthBadge change={change} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: cat.color,
                            }}
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

      {/* Trend comparison chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Spending Over Time — {unitLabel}
        </h3>
        <div className="h-[400px]">
          <LineChart years={allYears} datasets={lineDatasets} />
        </div>
      </div>

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
