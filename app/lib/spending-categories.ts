// Categorization of COFOG codes into domestic/foreign/migration/operations
// Based on the actual purpose of each spending function

export interface SpendingGroup {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  description: string;
  cofogCodes: string[];
}

// Direct services and benefits for the Swiss population
export const FOR_SWISS_PEOPLE: SpendingGroup = {
  id: 'swiss-people',
  label: 'For Swiss Residents — Direct Services & Benefits',
  shortLabel: 'For Swiss Residents',
  color: '#3D7A8A',
  description:
    'Spending that directly benefits people living in Switzerland: pensions, health, education, family support, unemployment insurance, public transport, and local infrastructure.',
  cofogCodes: [
    // Education (all domestic)
    'GF0901', 'GF0902', 'GF0903', 'GF0904', 'GF0905', 'GF0906', 'GF0907', 'GF0908',
    // Health
    'GF0701', 'GF0702', 'GF0703', 'GF0704', 'GF0705', 'GF0706',
    // Social Protection - direct Swiss benefits
    'GF1001', // Sickness & Disability (IV/AI)
    'GF1002', // Old Age (AHV/AVS)
    'GF1003', // Survivors
    'GF1004', // Family & Children
    'GF1005', // Unemployment (ALV/AC)
    'GF1006', // Housing assistance
    'GF1008', // R&D Social Protection
    'GF1009', // Social Protection n.e.c.
    // Transport & Infrastructure
    'GF0405', // Transport (roads, SBB, tunnels)
    'GF0406', // Communication
    // Environment
    'GF0501', 'GF0502', 'GF0503', 'GF0504', 'GF0505', 'GF0506',
    // Housing & Community
    'GF0601', 'GF0602', 'GF0603', 'GF0604', 'GF0605', 'GF0606',
    // Recreation, Culture
    'GF0801', 'GF0802', 'GF0803', 'GF0804', 'GF0805', 'GF0806',
    // Public Order (domestic safety)
    'GF0301', 'GF0302', 'GF0303', 'GF0304', 'GF0305', 'GF0306',
    // Energy, Agriculture, Industry
    'GF0402', 'GF0403', 'GF0404', 'GF0407',
  ],
};

// Foreign affairs, international aid, foreign military
export const FOREIGN_SPENDING: SpendingGroup = {
  id: 'foreign',
  label: 'Foreign & International — Ausland',
  shortLabel: 'Foreign / Ausland',
  color: '#A67C37',
  description:
    'Spending directed abroad: foreign affairs, diplomatic missions, international organizations (UN, ICRC), development aid, foreign economic assistance, and foreign military cooperation.',
  cofogCodes: [
    'GF0103', // External Affairs
    'GF0104', // Foreign Economic Aid
    'GF0203', // Foreign Military Aid
  ],
};

// Migration, asylum, integration
export const MIGRATION_SPENDING: SpendingGroup = {
  id: 'migration',
  label: 'Migration, Asylum & Integration',
  shortLabel: 'Migration & Asylum',
  color: '#8B2D1E',
  description:
    'Spending on asylum seekers, refugee support, integration programs, and social exclusion (Sozialhilfe for non-citizens). Note: this is captured under GF1007 "Social Exclusion n.e.c." which also includes domestic social assistance — the exact split is not available in COFOG data, but migration costs are a significant portion.',
  cofogCodes: [
    'GF1007', // Social Exclusion n.e.c. (asylum, integration, Sozialhilfe)
  ],
};

// Government operations, debt, transfers
export const GOVERNMENT_OPERATIONS: SpendingGroup = {
  id: 'government-ops',
  label: 'Government Operations & Administration',
  shortLabel: 'Gov. Operations',
  color: '#6B5B8A',
  description:
    'The cost of running government itself: executive/legislative bodies, tax administration, public debt interest, fiscal equalization between cantons, general planning, and statistics offices.',
  cofogCodes: [
    'GF0101', // Executive & Legislative
    'GF0102', // Financial & Fiscal Affairs
    'GF0105', // General Services
    'GF0106', // General Public Services n.e.c.
    'GF0107', // Public Debt
    'GF0108', // Transfers Between Government Levels
  ],
};

// Defence (domestic, but separate category)
export const DEFENCE_SPENDING: SpendingGroup = {
  id: 'defence',
  label: 'Defence & Civil Protection',
  shortLabel: 'Defence',
  color: '#3B5998',
  description:
    'Swiss Armed Forces (militia army), civil protection (Zivilschutz), military R&D, and emergency shelter infrastructure.',
  cofogCodes: [
    'GF0201', // Military Defence
    'GF0202', // Civil Defence
    'GF0204', // R&D Defence
    'GF0205', // Defence n.e.c.
  ],
};

// Economic policy & research
export const ECONOMIC_POLICY: SpendingGroup = {
  id: 'economic-policy',
  label: 'Economic Policy & Innovation',
  shortLabel: 'Economic Policy',
  color: '#4A7C6F',
  description:
    'Trade promotion, economic regulation (WEKO/COMCO), Innosuisse innovation agency, regional development policy, and other economic support programs.',
  cofogCodes: [
    'GF0401', // General Economic Affairs
    'GF0408', // R&D Economic Affairs
    'GF0409', // Economic Affairs n.e.c.
  ],
};

export const ALL_SPENDING_GROUPS: SpendingGroup[] = [
  FOR_SWISS_PEOPLE,
  GOVERNMENT_OPERATIONS,
  FOREIGN_SPENDING,
  MIGRATION_SPENDING,
  DEFENCE_SPENDING,
  ECONOMIC_POLICY,
];

// Simplified view: Swiss vs Foreign vs Migration
export const SIMPLE_GROUPS = {
  domestic: {
    label: 'For People in Switzerland',
    color: '#3D7A8A',
    groups: [FOR_SWISS_PEOPLE, DEFENCE_SPENDING, ECONOMIC_POLICY],
  },
  government: {
    label: 'Government Operations',
    color: '#6B5B8A',
    groups: [GOVERNMENT_OPERATIONS],
  },
  foreign: {
    label: 'Foreign / Ausland',
    color: '#A67C37',
    groups: [FOREIGN_SPENDING],
  },
  migration: {
    label: 'Migration & Asylum',
    color: '#8B2D1E',
    groups: [MIGRATION_SPENDING],
  },
};
