import { fetchCofogData, getAvailableYears } from './lib/data';
import { Dashboard } from './components/Dashboard';

export default async function Home() {
  const data = await fetchCofogData();
  const years = getAvailableYears(data);

  return <Dashboard data={data} years={years} />;
}
