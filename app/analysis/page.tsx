'use client';

import Link from 'next/link';
import { useData } from '../components/DataProvider';
import { SpendingAnalysis } from '../components/SpendingAnalysis';

export default function AnalysisPage() {
  const { data, years } = useData();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 hover:text-[#8B2D1E] hover:border-gray-300 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Back to Overview
        </Link>
      </div>
      <SpendingAnalysis data={data} years={years} />
    </div>
  );
}
