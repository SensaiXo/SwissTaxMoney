'use client';

import { useData } from './components/DataProvider';
import { Dashboard } from './components/Dashboard';

export default function Home() {
  const { data, years } = useData();
  return <Dashboard data={data} years={years} />;
}
