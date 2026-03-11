import { notFound } from 'next/navigation';
import Link from 'next/link';
import { COFOG_CATEGORIES, getCategoryBySlug } from '../../lib/cofog';
import { fetchCofogData, getAvailableYears } from '../../lib/data';
import { CategoryDetail } from '../../components/CategoryDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const data = await fetchCofogData();
  const years = getAvailableYears(data);

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

export function generateStaticParams() {
  return COFOG_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}
