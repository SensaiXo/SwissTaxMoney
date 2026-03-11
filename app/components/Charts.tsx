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
}

export function BarChart({ labels, values, colors, unitLabel }: BarChartProps) {
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
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: unitLabel },
          },
          x: {
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
}

export function LineChart({ years, datasets }: LineChartProps) {
  return (
    <Line
      data={{
        labels: years.map(String),
        datasets: datasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color,
          backgroundColor: ds.color + '22',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: false,
        })),
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}
