'use client';

import { useState } from 'react';
import Link from 'next/link';
import { COFOG_CATEGORIES } from '../lib/cofog';
import type { CofogRow } from '../lib/data';
import { SECTOR_LABELS, SWISS_POPULATION, formatCHF, formatPerCapita, getYoyChange } from '../lib/data';
import { CategoryCard } from './CategoryCard';
import { BarChart, DoughnutChart, LineChart } from './Charts';
import { GrowthBadge } from './GrowthBadge';

interface DashboardProps {
  data: CofogRow[];
  years: number[];
}

type UnitMode = 'MCHF' | 'SHARE' | 'PER_CAPITA';

export function Dashboard({ data, years }: DashboardProps) {
  const [sector, setSector] = useState('S1312');
  const [year, setYear] = useState(years[0]);
  const [unit, setUnit] = useState<UnitMode>('MCHF');

  const cofogUnit = unit === 'PER_CAPITA' ? 'MCHF' : unit;

  const topLevel = COFOG_CATEGORIES.map((cat) => {
    const row = data.find(
      (r) => r.sector === sector && r.year === year && r.unit === cofogUnit && r.cofog === cat.code
    );
    const rawValue = row?.value ?? 0;
    const displayValue = unit === 'PER_CAPITA' ? (rawValue * 1_000_000) / SWISS_POPULATION : rawValue;
    return { ...cat, value: displayValue, rawMCHF: rawValue };
  });

  const maxValue = Math.max(...topLevel.map((t) => t.value));
  const totalRow = data.find(
    (r) => r.sector === sector && r.year === year && r.unit === 'MCHF' && r.cofog === 'GFTOT'
  );
  const totalMCHF = totalRow?.value ?? topLevel.reduce((s, t) => s + t.rawMCHF, 0);
  const sorted = [...topLevel].sort((a, b) => b.value - a.value);
  const top = sorted[0];
  const totalChange = getYoyChange(data, sector, year, 'GFTOT');

  const unitLabel = unit === 'MCHF' ? 'Million CHF' : unit === 'PER_CAPITA' ? 'CHF per Person' : '% of Total';

  const formatDisplayValue = (v: number) => {
    if (unit === 'PER_CAPITA') return 'CHF ' + formatCHF(v);
    if (unit === 'SHARE') return v.toFixed(1) + '%';
    return formatCHF(v) + ' M CHF';
  };

  const formatTotal = () => {
    if (unit === 'PER_CAPITA') return formatPerCapita(totalMCHF);
    if (unit === 'SHARE') return '100%';
    return formatCHF(totalMCHF) + ' M';
  };

  // Line chart data
  const allYears = [...new Set(data.filter((r) => r.sector === sector && r.unit === cofogUnit).map((r) => r.year))].sort();
  const lineDatasets = COFOG_CATEGORIES.map((cat) => ({
    label: cat.label,
    color: cat.color,
    data: allYears.map((y) => {
      const row = data.find((r) => r.sector === sector && r.year === y && r.unit === cofogUnit && r.cofog === cat.code);
      if (!row) return null;
      return unit === 'PER_CAPITA' ? (row.value * 1_000_000) / SWISS_POPULATION : row.value;
    }),
  }));

  const unitBtnClass = (mode: UnitMode) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      unit === mode
        ? 'bg-[#8B2D1E] text-white'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`;

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
            <button onClick={() => setUnit('MCHF')} className={unitBtnClass('MCHF')}>
              CHF (millions)
            </button>
            <button onClick={() => setUnit('PER_CAPITA')} className={unitBtnClass('PER_CAPITA')}>
              Per person
            </button>
            <button onClick={() => setUnit('SHARE')} className={unitBtnClass('SHARE')}>
              % of total
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-3xl font-bold text-[#8B2D1E]">
            {formatTotal()}
            <GrowthBadge change={totalChange} />
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total Spending ({year})
            {unit === 'PER_CAPITA' && (
              <span className="text-xs text-gray-400 block">
                based on {formatCHF(SWISS_POPULATION)} residents
              </span>
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xl font-bold text-gray-900">{top?.label}</p>
          <p className="text-sm text-gray-500 mt-1">
            Largest Category — {formatDisplayValue(top?.value ?? 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-3xl font-bold text-[#8B2D1E]">
            {topLevel.filter((t) => t.value > 0).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Active Spending Categories</p>
        </div>
      </div>

      {/* Analysis CTA */}
      <Link
        href="/analysis"
        className="block bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all mb-8 group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#8B2D1E] transition-colors">
              Spending Analysis — Domestic vs. Foreign vs. Sozialhilfe
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              See how much goes to residents, how much abroad, and how social assistance compares to other budget items.
            </p>
          </div>
          <span className="text-2xl text-gray-300 group-hover:text-[#8B2D1E] transition-colors ml-4">
            →
          </span>
        </div>
      </Link>

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
            change={getYoyChange(data, sector, year, cat.code)}
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
          Spending Over Time — click categories to show/hide
        </h3>
        <LineChart years={allYears} datasets={lineDatasets} filterable />
      </div>

      {/* Source */}
      <p className="text-center text-xs text-gray-400 py-6">
        Source:{' '}
        <a href="https://www.bfs.admin.ch/asset/en/ts-x-04.02.04.03" target="_blank" className="text-[#8B2D1E] hover:underline">
          Federal Statistical Office (BFS)
        </a>{' '}
        — COFOG Classification —{' '}
        <a href="https://opendata.swiss/en/dataset/staatsausgaben-nach-aufgabenbereichen-cofog6" target="_blank" className="text-[#8B2D1E] hover:underline">
          opendata.swiss
        </a>
      </p>
    </div>
  );
}
