'use client';

import { useState } from 'react';
import type { CofogRow } from '../lib/data';
import { SECTOR_LABELS } from '../lib/data';
import {
  ALL_SPENDING_GROUPS,
  SIMPLE_GROUPS,
  type SpendingGroup,
} from '../lib/spending-categories';
import { BarChart, DoughnutChart, LineChart } from './Charts';

interface SpendingAnalysisProps {
  data: CofogRow[];
  years: number[];
}

function sumGroup(
  data: CofogRow[],
  sector: string,
  year: number,
  group: SpendingGroup
): number {
  return group.cofogCodes.reduce((sum, code) => {
    const row = data.find(
      (r) =>
        r.sector === sector &&
        r.year === year &&
        r.unit === 'MCHF' &&
        r.cofog === code
    );
    return sum + (row?.value ?? 0);
  }, 0);
}

function sumGroups(
  data: CofogRow[],
  sector: string,
  year: number,
  groups: SpendingGroup[]
): number {
  return groups.reduce((sum, g) => sum + sumGroup(data, sector, year, g), 0);
}

export function SpendingAnalysis({ data, years }: SpendingAnalysisProps) {
  const [sector, setSector] = useState('S13');
  const [year, setYear] = useState(years[0]);

  // Calculate totals for each group
  const groupTotals = ALL_SPENDING_GROUPS.map((group) => ({
    ...group,
    value: sumGroup(data, sector, year, group),
  }));

  const grandTotal = groupTotals.reduce((s, g) => s + g.value, 0);

  // Simple breakdown: domestic vs foreign vs migration vs gov
  const simpleData = Object.entries(SIMPLE_GROUPS).map(([key, config]) => ({
    key,
    label: config.label,
    color: config.color,
    value: sumGroups(data, sector, year, config.groups),
  }));

  // Domestic total (everything except foreign & social assistance)
  const domesticTotal =
    simpleData.find((s) => s.key === 'domestic')?.value ?? 0;
  const foreignTotal = simpleData.find((s) => s.key === 'foreign')?.value ?? 0;
  const socialAssistanceTotal =
    simpleData.find((s) => s.key === 'socialAssistance')?.value ?? 0;
  const govOpsTotal =
    simpleData.find((s) => s.key === 'government')?.value ?? 0;
  // Estimated asylum-specific portion (~25-30% of GF1007 based on SEM data)
  const estimatedAsylumCost = Math.round(socialAssistanceTotal * 0.25);
  const estimatedDomesticSozialhilfe = socialAssistanceTotal - estimatedAsylumCost;

  const formatCHF = (v: number) =>
    new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(v);
  const pct = (v: number) =>
    grandTotal > 0 ? ((v / grandTotal) * 100).toFixed(1) : '0';

  // Trend data for simple groups
  const allYears = [
    ...new Set(
      data
        .filter((r) => r.sector === sector && r.unit === 'MCHF')
        .map((r) => r.year)
    ),
  ].sort();

  const trendDatasets = Object.entries(SIMPLE_GROUPS).map(([, config]) => ({
    label: config.label,
    color: config.color,
    data: allYears.map((y) => sumGroups(data, sector, y, config.groups)),
  }));

  // Budget comparison chart
  const budgetComparison = [
    {
      label: 'Sozialhilfe & Asylum (GF1007)',
      value: socialAssistanceTotal,
      color: '#8B2D1E',
    },
    {
      label: 'Est. Asylum portion (~25%)',
      value: estimatedAsylumCost,
      color: '#C4726A',
    },
    {
      label: 'Est. Domestic Sozialhilfe (~75%)',
      value: estimatedDomesticSozialhilfe,
      color: '#D4A59A',
    },
    {
      label: 'Old Age (AHV/AVS)',
      value:
        data.find(
          (r) =>
            r.sector === sector &&
            r.year === year &&
            r.unit === 'MCHF' &&
            r.cofog === 'GF1002'
        )?.value ?? 0,
      color: '#4A5A8A',
    },
    {
      label: 'Education (Total)',
      value:
        data.find(
          (r) =>
            r.sector === sector &&
            r.year === year &&
            r.unit === 'MCHF' &&
            r.cofog === 'GF09'
        )?.value ?? 0,
      color: '#B36B3D',
    },
    {
      label: 'Health (Total)',
      value:
        data.find(
          (r) =>
            r.sector === sector &&
            r.year === year &&
            r.unit === 'MCHF' &&
            r.cofog === 'GF07'
        )?.value ?? 0,
      color: '#3D7A8A',
    },
    {
      label: 'Transport',
      value:
        data.find(
          (r) =>
            r.sector === sector &&
            r.year === year &&
            r.unit === 'MCHF' &&
            r.cofog === 'GF0405'
        )?.value ?? 0,
      color: '#A67C37',
    },
    {
      label: 'Defence (Total)',
      value:
        data.find(
          (r) =>
            r.sector === sector &&
            r.year === year &&
            r.unit === 'MCHF' &&
            r.cofog === 'GF02'
        )?.value ?? 0,
      color: '#3B5998',
    },
    {
      label: 'Foreign Aid',
      value: foreignTotal,
      color: '#6B5B8A',
    },
  ].sort((a, b) => b.value - a.value);

  // Migration trend vs other items
  const migrationTrend = allYears.map(
    (y) =>
      data.find(
        (r) =>
          r.sector === sector &&
          r.year === y &&
          r.unit === 'MCHF' &&
          r.cofog === 'GF1007'
      )?.value ?? 0
  );
  const ahvTrend = allYears.map(
    (y) =>
      data.find(
        (r) =>
          r.sector === sector &&
          r.year === y &&
          r.unit === 'MCHF' &&
          r.cofog === 'GF1002'
      )?.value ?? 0
  );
  const educationTrend = allYears.map(
    (y) =>
      data.find(
        (r) =>
          r.sector === sector &&
          r.year === y &&
          r.unit === 'MCHF' &&
          r.cofog === 'GF09'
      )?.value ?? 0
  );
  const foreignAidTrend = allYears.map((y) => {
    const ext =
      data.find(
        (r) =>
          r.sector === sector &&
          r.year === y &&
          r.unit === 'MCHF' &&
          r.cofog === 'GF0103'
      )?.value ?? 0;
    const aid =
      data.find(
        (r) =>
          r.sector === sector &&
          r.year === y &&
          r.unit === 'MCHF' &&
          r.cofog === 'GF0104'
      )?.value ?? 0;
    return ext + aid;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Spending Analysis — Where Does the Money Actually Go?
        </h2>
        <p className="text-gray-600 max-w-3xl">
          Breakdown of Swiss government spending by purpose. Important: &quot;For People
          in Switzerland&quot; means everyone living here — Swiss citizens, C-permit holders, B-permit
          holders, and temporary residents. COFOG data does not distinguish by nationality or
          permit type. The &quot;Sozialhilfe & Asylum&quot; category (GF1007) mixes domestic welfare
          with asylum costs — see the estimated split below.
        </p>
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
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B2D1E]"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {simpleData.map((item) => (
          <div
            key={item.key}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <p className="text-2xl font-bold" style={{ color: item.color }}>
              {pct(item.value)}%
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {formatCHF(item.value)} M
            </p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Main split visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Who Does the Money Serve? ({year})
          </h3>
          <div className="h-[350px]">
            <DoughnutChart
              labels={simpleData.map((s) => `${s.label} (${pct(s.value)}%)`)}
              values={simpleData.map((s) => s.value)}
              colors={simpleData.map((s) => s.color)}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Detailed Breakdown ({year})
          </h3>
          <div className="h-[350px]">
            <BarChart
              labels={groupTotals.map((g) => g.shortLabel)}
              values={groupTotals.map((g) => g.value)}
              colors={groupTotals.map((g) => g.color)}
              unitLabel="Million CHF"
            />
          </div>
        </div>
      </div>

      {/* Detailed Group Breakdown */}
      <div className="space-y-3 mb-8">
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Breakdown by Purpose
        </h3>
        {groupTotals
          .sort((a, b) => b.value - a.value)
          .map((group) => {
            const pctOfTotal = grandTotal > 0 ? (group.value / grandTotal) * 100 : 0;
            return (
              <div
                key={group.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {group.label}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {group.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p
                      className="text-xl font-bold"
                      style={{ color: group.color }}
                    >
                      {formatCHF(group.value)} M CHF
                    </p>
                    <p className="text-sm text-gray-500">
                      {pctOfTotal.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${pctOfTotal}%`,
                      backgroundColor: group.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Sozialhilfe & Asylum breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sozialhilfe & Asylum — The Real Split
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          GF1007 ({formatCHF(socialAssistanceTotal)} M CHF) is often cited as &quot;migration
          costs&quot; but it combines domestic social assistance (Sozialhilfe) with asylum spending.
          Based on SEM and BFS reports, roughly 25% is asylum-specific, 75% is domestic welfare
          for all residents (Swiss citizens, C/B permit holders).
        </p>

        {/* Estimated split visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Estimated Domestic Sozialhilfe (~75%)
            </p>
            <p className="text-2xl font-bold text-[#D4A59A]">
              ~{formatCHF(estimatedDomesticSozialhilfe)} M CHF
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Welfare for Swiss citizens + permanent residents (C-permit)
              + recognized refugees who have been granted asylum
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Estimated Asylum & Integration (~25%)
            </p>
            <p className="text-2xl font-bold text-[#C4726A]">
              ~{formatCHF(estimatedAsylumCost)} M CHF
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Asylum seeker support, refugee housing, integration programs,
              emergency accommodation
            </p>
          </div>
        </div>

        <div className="h-[400px]">
          <BarChart
            labels={budgetComparison.map((m) => m.label)}
            values={budgetComparison.map((m) => m.value)}
            colors={budgetComparison.map((m) => m.color)}
            unitLabel="Million CHF"
            horizontal
          />
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">GF1007 Total (Sozialhilfe + Asylum)</p>
            <p className="text-lg font-bold text-[#8B2D1E]">
              {formatCHF(socialAssistanceTotal)} M CHF
            </p>
            <p className="text-xs text-gray-400">{pct(socialAssistanceTotal)}% of total spending</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Foreign Aid (Ausland)</p>
            <p className="text-lg font-bold text-[#A67C37]">
              {formatCHF(foreignTotal)} M CHF
            </p>
            <p className="text-xs text-gray-400">{pct(foreignTotal)}% of total</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              Domestic services (all residents)
            </p>
            <p className="text-lg font-bold text-[#3D7A8A]">
              {formatCHF(domesticTotal)} M CHF
            </p>
            <p className="text-xs text-gray-400">{pct(domesticTotal)}% of total</p>
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Domestic vs. Foreign vs. Sozialhilfe/Asylum — Over Time
        </h3>
        <LineChart years={allYears} datasets={trendDatasets} filterable />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Sozialhilfe & Asylum vs. Major Budget Items — Over Time
        </h3>
        <LineChart
          years={allYears}
          datasets={[
            { label: 'Sozialhilfe & Asylum (GF1007)', color: '#8B2D1E', data: migrationTrend },
            { label: 'Old Age / AHV (GF1002)', color: '#4A5A8A', data: ahvTrend },
            { label: 'Education (GF09)', color: '#B36B3D', data: educationTrend },
            { label: 'Foreign Affairs + Aid', color: '#A67C37', data: foreignAidTrend },
          ]}
          filterable
        />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="text-sm text-amber-800 font-medium mb-1">
          Important Notes on This Analysis
        </p>
        <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>
            <strong>&quot;For People in Switzerland&quot;</strong> means ALL residents — Swiss passport
            holders, C-permit (Niederlassungsbewilligung), B-permit (Aufenthaltsbewilligung),
            L-permit (short-term), and cross-border workers (G-permit). COFOG data does not
            distinguish by nationality or permit type.
          </li>
          <li>
            GF1007 (&quot;Social Exclusion n.e.c.&quot;) combines domestic Sozialhilfe with
            asylum costs. The ~25/75% split shown is an estimate based on SEM
            (State Secretariat for Migration) annual reports. The exact ratio varies
            by year and government level.
          </li>
          <li>
            Education, health, and transport spending serves everyone living in
            Switzerland regardless of citizenship. Swiss citizens and permanent
            residents use the same schools, hospitals, and SBB trains.
          </li>
          <li>
            All figures in millions of CHF. Source: BFS / opendata.swiss.
          </li>
        </ul>
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
        — COFOG Classification —{' '}
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
