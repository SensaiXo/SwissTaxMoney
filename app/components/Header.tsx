import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-[#C42B1C] text-white px-8 py-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-white rounded relative flex-shrink-0">
            <div className="absolute bg-[#C42B1C] w-[10px] h-[22px] top-[6px] left-[14px]" />
            <div className="absolute bg-[#C42B1C] w-[22px] h-[10px] top-[14px] left-[6px]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Where Does Swiss Tax Money Go?</h1>
            <p className="text-sm opacity-90">
              State expenditure by function (COFOG) — Federal Statistical Office
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/analysis"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors"
          >
            Spending Analysis
          </Link>
        </nav>
      </div>
    </header>
  );
}
