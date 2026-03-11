'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

interface BarChartProps {
  labels: string[];
  values: number[];
  colors: string[];
  unitLabel: string;
  horizontal?: boolean;
}

export function BarChart({ labels, values, colors, unitLabel, horizontal }: BarChartProps) {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: unitLabel,
            data: values,
            backgroundColor: colors,
            borderRadius: 4,
          },
        ],
      }}
      options={{
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ...(horizontal ? {} : { title: { display: true, text: unitLabel } }),
          },
          x: {
            ...(horizontal ? { title: { display: true, text: unitLabel } } : {}),
            ticks: { maxRotation: 45, font: { size: 11 } },
          },
        },
      }}
    />
  );
}

interface DoughnutChartProps {
  labels: string[];
  values: number[];
  colors: string[];
}

export function DoughnutChart({ labels, values, colors }: DoughnutChartProps) {
  return (
    <Doughnut
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      }}
    />
  );
}

interface LineChartProps {
  years: number[];
  datasets: {
    label: string;
    data: (number | null)[];
    color: string;
  }[];
  filterable?: boolean;
}

export function LineChart({ years, datasets, filterable }: LineChartProps) {
  const [activeIndices, setActiveIndices] = useState<Set<number>>(
    new Set(datasets.map((_, i) => i))
  );

  const toggleDataset = (idx: number) => {
    setActiveIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        if (next.size > 1) next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const showAll = () => setActiveIndices(new Set(datasets.map((_, i) => i)));
  const showNone = () => {
    // Show only the largest dataset
    let maxIdx = 0;
    let maxSum = 0;
    datasets.forEach((ds, i) => {
      const sum = ds.data.reduce((s: number, v) => s + (v ?? 0), 0);
      if (sum > maxSum) { maxSum = sum; maxIdx = i; }
    });
    setActiveIndices(new Set([maxIdx]));
  };

  const visibleDatasets = datasets.map((ds, i) => ({
    label: ds.label,
    data: activeIndices.has(i) ? ds.data : ds.data.map(() => null),
    borderColor: activeIndices.has(i) ? ds.color : ds.color + '30',
    backgroundColor: ds.color + '22',
    borderWidth: activeIndices.has(i) ? 2.5 : 0,
    pointRadius: activeIndices.size <= 3 && activeIndices.has(i) ? 3 : 0,
    pointHoverRadius: 5,
    tension: 0.3,
    fill: false,
  }));

  return (
    <div>
      {filterable && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={showAll}
            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100"
          >
            All
          </button>
          <button
            onClick={showNone}
            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100"
          >
            Largest only
          </button>
          <span className="text-gray-300 mx-1">|</span>
          {datasets.map((ds, i) => (
            <button
              key={i}
              onClick={() => toggleDataset(i)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                activeIndices.has(i)
                  ? 'border-transparent text-white font-medium'
                  : 'border-gray-200 text-gray-400 bg-white'
              }`}
              style={activeIndices.has(i) ? { backgroundColor: ds.color } : {}}
            >
              {ds.label}
            </button>
          ))}
        </div>
      )}
      <div className={filterable ? 'h-[350px]' : 'h-full'}>
        <Line
          data={{
            labels: years.map(String),
            datasets: visibleDatasets,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                display: !filterable,
                position: 'bottom',
                labels: { boxWidth: 12, font: { size: 11 } },
              },
              tooltip: {
                filter: (item) => item.raw !== null,
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
    </div>
  );
}
