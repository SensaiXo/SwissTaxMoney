// Fetch and parse COFOG data from BFS (Federal Statistical Office)

const DATA_URL =
  'https://dam-api.bfs.admin.ch/hub/api/dam/assets/30225295/master';

export interface CofogRow {
  sector: string;
  year: number;
  cofog: string;
  unit: string;
  value: number;
}

let cachedData: CofogRow[] | null = null;

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
  if (cachedData) return cachedData;

  const resp = await fetch(DATA_URL, { next: { revalidate: 86400 } });
  if (!resp.ok) throw new Error(`BFS API returned ${resp.status}`);
  const text = await resp.text();
  cachedData = parseCSV(text);
  return cachedData;
}

export function getAvailableYears(data: CofogRow[]): number[] {
  return [...new Set(data.map((r) => r.year))].sort((a, b) => b - a);
}

export function getTopLevelData(
  data: CofogRow[],
  sector: string,
  year: number,
  unit: string
) {
  return data.filter(
    (r) =>
      r.sector === sector &&
      r.year === year &&
      r.unit === unit &&
      /^GF\d{2}$/.test(r.cofog) &&
      r.cofog !== 'GFTOT'
  );
}

export function getSubcategoryData(
  data: CofogRow[],
  sector: string,
  year: number,
  unit: string,
  parentCode: string
) {
  const prefix = parentCode; // e.g. "GF09"
  return data.filter(
    (r) =>
      r.sector === sector &&
      r.year === year &&
      r.unit === unit &&
      r.cofog.startsWith(prefix) &&
      r.cofog.length === 6 // subcategories are GF0901, GF0902, etc.
  );
}

export function getTotalForCategory(
  data: CofogRow[],
  sector: string,
  year: number,
  unit: string,
  code: string
): number {
  const row = data.find(
    (r) => r.sector === sector && r.year === year && r.unit === unit && r.cofog === code
  );
  return row?.value ?? 0;
}

export function getTimeSeriesForCode(
  data: CofogRow[],
  sector: string,
  unit: string,
  code: string
): { year: number; value: number }[] {
  return data
    .filter((r) => r.sector === sector && r.unit === unit && r.cofog === code)
    .map((r) => ({ year: r.year, value: r.value }))
    .sort((a, b) => a.year - b.year);
}

export const SECTOR_LABELS: Record<string, string> = {
  S13: 'All Government',
  S1311: 'Federal (Confederation)',
  S1312: 'Cantons',
  S1313: 'Municipalities',
  S1314: 'Social Insurance',
};
