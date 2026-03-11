// Fetch and parse COFOG data from BFS (Federal Statistical Office)

const DATA_URL =
  'https://dam-api.bfs.admin.ch/hub/api/dam/assets/30225295/master';

// Swiss permanent resident population (BFS STATPOP 2023)
export const SWISS_POPULATION = 8_962_000;

export interface CofogRow {
  sector: string;
  year: number;
  cofog: string;
  unit: string;
  value: number;
}

function parseCSV(text: string): CofogRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0];
  const delim = header.includes(';') ? ';' : ',';
  const cols = header.split(delim).map((c) => c.trim().replace(/^"|"$/g, ''));

  const iSector = cols.indexOf('SECTOR');
  const iPeriod = cols.indexOf('PERIOD');
  const iCofog = cols.indexOf('COFOG');
  const iUnit = cols.indexOf('UNIT_MEAS');
  const iValue = cols.indexOf('VALUE');

  if ([iSector, iPeriod, iCofog, iUnit, iValue].includes(-1)) {
    throw new Error('Unexpected CSV columns: ' + cols.join(', '));
  }

  const rows: CofogRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(delim).map((c) => c.trim().replace(/^"|"$/g, ''));
    const val = parseFloat(parts[iValue]);
    if (isNaN(val)) continue;
    rows.push({
      sector: parts[iSector],
      year: parseInt(parts[iPeriod]),
      cofog: parts[iCofog],
      unit: parts[iUnit],
      value: val,
    });
  }
  return rows;
}

export async function fetchCofogData(): Promise<CofogRow[]> {
  const resp = await fetch(DATA_URL);
  if (!resp.ok) throw new Error(`BFS API returned ${resp.status}`);
  const text = await resp.text();
  return parseCSV(text);
}

export function getAvailableYears(data: CofogRow[]): number[] {
  return [...new Set(data.map((r) => r.year))].sort((a, b) => b - a);
}

export function formatCHF(v: number): string {
  return new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(v);
}

export function formatPerCapita(mchf: number): string {
  const perPerson = (mchf * 1_000_000) / SWISS_POPULATION;
  return 'CHF ' + new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(perPerson);
}

export function getYoyChange(
  data: CofogRow[],
  sector: string,
  year: number,
  cofog: string
): number | null {
  const current = data.find(
    (r) => r.sector === sector && r.year === year && r.unit === 'MCHF' && r.cofog === cofog
  );
  const previous = data.find(
    (r) => r.sector === sector && r.year === year - 1 && r.unit === 'MCHF' && r.cofog === cofog
  );
  if (!current || !previous || previous.value === 0) return null;
  return ((current.value - previous.value) / previous.value) * 100;
}

export const SECTOR_LABELS: Record<string, string> = {
  S13: 'All Government',
  S1311: 'Federal (Confederation)',
  S1312: 'Cantons',
  S1313: 'Municipalities',
  S1314: 'Social Insurance',
};
