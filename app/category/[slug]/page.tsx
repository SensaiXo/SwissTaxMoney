'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug } from '../../lib/cofog';
import { useData } from '../../components/DataProvider';
import { CategoryDetail } from '../../components/CategoryDetail';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug);
  const { data, years } = useData();

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Category not found</h2>
        <Link href="/" className="text-[#8B2D1E] hover:underline">Back to Overview</Link>
      </div>
    );
  }

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
      <CategoryDetail category={category} data={data} years={years} />
    </div>
  );
}
