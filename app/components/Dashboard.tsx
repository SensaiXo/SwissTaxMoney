'use client';

import { useState } from 'react';
import { COFOG_CATEGORIES } from '../lib/cofog';
import type { CofogRow } from '../lib/data';
import { SECTOR_LABELS } from '../lib/data';
import { CategoryCard } from './CategoryCard';
import { BarChart, DoughnutChart, LineChart } from './Charts';

interface DashboardProps {
  data: CofogRow[];
  years: number[];
}

export function Dashboard({ data, years }: DashboardProps) {
  const [sector, setSector] = useState('S1312');
  const [year, setYear] = useState(years[0]);
  const [unit, setUnit] = useState<'MCHF' | 'SHARE'>('MCHF');

  const topLevel = COFOG_CATEGORIES.map((cat) => {
    const row = data.find(
      (r) => r.sector === sector && r.year === year && r.unit === unit && r.cofog === cat.code
    );
    return { ...cat, value: row?.value ?? 0 };
  });

  const maxValue = Math.max(...topLevel.map((t) => t.value));
  const totalRow = data.find(
    (r) => r.sector === sector && r.year === year && r.unit === 'MCHF' && r.cofog === 'GFTOT'
  );
  const total = totalRow?.value ?? topLevel.reduce((s, t) => s + t.value, 0);
  const sorted = [...topLevel].sort((a, b) => b.value - a.value);
  const top = sorted[0];

  const unitLabel = unit === 'MCHF' ? 'Million CHF' : '% of Total';

  // Line chart data
  const allYears = [...new Set(data.filter((r) => r.sector === sector && r.unit === unit).map((r) => r.year))].sort();
  const lineDatasets = COFOG_CATEGORIES.map((cat) => ({
    label: cat.label,
    color: cat.color,
    data: allYears.map((y) => {
      const row = data.find((r) => r.sector === sector && r.year === y && r.unit === unit && r.cofog === cat.code);
      return row?.value ?? null;
    }),
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-3xl font-bold text-[#8B2D1E]">
            {unit === 'MCHF'
              ? new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(total) + ' M'
              : '100%'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Spending ({year})</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xl font-bold text-gray-900">{top?.label}</p>
          <p className="text-sm text-gray-500 mt-1">
            Largest Category —{' '}
            {unit === 'MCHF'
              ? new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(top?.value ?? 0) + ' M CHF'
              : (top?.value ?? 0).toFixed(1) + '%'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-3xl font-bold text-[#8B2D1E]">
            {topLevel.filter((t) => t.value > 0).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Active Spending Categories</p>
        </div>
      </div>

      {/* Category Cards Grid */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Spending Categories — click to explore subcategories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sorted.map((cat) => (
          <CategoryCard
            key={cat.code}
            category={cat}
            value={cat.value}
            unit={unit}
            maxValue={maxValue}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Spending by Category</h3>
          <div className="h-[350px]">
            <BarChart
              labels={sorted.map((t) => t.label)}
              values={sorted.map((t) => t.value)}
              colors={sorted.map((t) => t.color)}
              unitLabel={unitLabel}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Share of Total Spending</h3>
          <div className="h-[350px]">
            <DoughnutChart
              labels={topLevel.map((t) => t.label)}
              values={topLevel.map((t) => t.value)}
              colors={topLevel.map((t) => t.color)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Spending Over Time — All Categories
        </h3>
        <div className="h-[400px]">
          <LineChart years={allYears} datasets={lineDatasets} />
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
        — Classification of the Functions of Government (COFOG) —{' '}
        <a
          href="https://opendata.swiss/en/dataset/staatsausgaben-nach-aufgabenbereichen-cofog6"
          target="_blank"
          className="text-[#8B2D1E] hover:underline"
        >
          opendata.swiss
        </a>
      </p>
    </div>
  );
}
