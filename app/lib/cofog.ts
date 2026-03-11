// COFOG (Classification of the Functions of Government) definitions
// Source: United Nations Statistics Division / Swiss Federal Statistical Office

export interface CofogCategory {
  code: string;
  label: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  subcategories: CofogSubcategory[];
}

export interface CofogSubcategory {
  code: string;
  label: string;
  description: string;
}

export const COFOG_CATEGORIES: CofogCategory[] = [
  {
    code: 'GF01',
    label: 'General Public Services',
    slug: 'general-public-services',
    icon: '🏛️',
    color: '#8B2D1E',
    description:
      'Covers the functioning of government itself — executive offices, legislative bodies, financial management, foreign affairs, public debt management, and transfers between government levels. This is the "overhead" of running the state.',
    subcategories: [
      {
        code: 'GF0101',
        label: 'Executive & Legislative Organs',
        description:
          'Salaries and operations of the Federal Council, cantonal governments, Grand Councils (cantonal parliaments), and municipal executives. Includes elections administration and political advisory bodies.',
      },
      {
        code: 'GF0102',
        label: 'Financial & Fiscal Affairs',
        description:
          'Tax administration (cantonal and federal tax offices), customs, treasury operations, budget management, and public accounting/auditing.',
      },
      {
        code: 'GF0103',
        label: 'External Affairs',
        description:
          'Foreign policy, diplomatic missions, consulates, contributions to international organizations (UN, ICRC, etc.), and development cooperation.',
      },
      {
        code: 'GF0104',
        label: 'Foreign Economic Aid',
        description:
          'International development aid, humanitarian assistance, and economic cooperation programs with developing countries.',
      },
      {
        code: 'GF0105',
        label: 'General Services',
        description:
          'Central procurement, statistics offices (including BFS), general planning, and shared government IT services and infrastructure.',
      },
      {
        code: 'GF0106',
        label: 'General Public Services n.e.c.',
        description:
          'Public services not elsewhere classified — miscellaneous administrative tasks and inter-cantonal coordination.',
      },
      {
        code: 'GF0107',
        label: 'Public Debt Transactions',
        description:
          'Interest payments on government debt, bond servicing costs. Switzerland\'s debt-brake mechanism (Schuldenbremse) limits how much this can grow.',
      },
      {
        code: 'GF0108',
        label: 'Transfers Between Government Levels',
        description:
          'Fiscal equalization payments (Finanzausgleich) between cantons and the Confederation, and transfers to municipalities. A key mechanism of Swiss federalism.',
      },
    ],
  },
  {
    code: 'GF02',
    label: 'Defence',
    slug: 'defence',
    icon: '🛡️',
    color: '#3B5998',
    description:
      'Military defence, civil defence, and foreign military aid. Switzerland maintains a militia-based army — most spending goes to the Swiss Armed Forces (Schweizer Armee) and civil protection (Zivilschutz).',
    subcategories: [
      {
        code: 'GF0201',
        label: 'Military Defence',
        description:
          'Swiss Armed Forces: personnel (militia and professional), equipment, training (Rekrutenschule), bases, and operations. Includes armasuisse (procurement agency).',
      },
      {
        code: 'GF0202',
        label: 'Civil Defence',
        description:
          'Zivilschutz (civil protection) — emergency shelters, disaster preparedness, sirens, and civilian protection infrastructure. Switzerland is famous for its extensive bunker network.',
      },
      {
        code: 'GF0203',
        label: 'Foreign Military Aid',
        description:
          'Military cooperation, peacekeeping contributions (e.g., Swisscoy in Kosovo), and military attaché offices.',
      },
      {
        code: 'GF0204',
        label: 'R&D Defence',
        description:
          'Military research and development, including technology evaluation and defence science programs.',
      },
      {
        code: 'GF0205',
        label: 'Defence n.e.c.',
        description:
          'Other defence-related spending not classified elsewhere.',
      },
    ],
  },
  {
    code: 'GF03',
    label: 'Public Order & Safety',
    slug: 'public-order-safety',
    icon: '⚖️',
    color: '#4A7C6F',
    description:
      'Police, courts, prisons, and fire services. In Switzerland, policing is primarily a cantonal responsibility — each canton has its own Kantonspolizei, plus municipal police in larger cities.',
    subcategories: [
      {
        code: 'GF0301',
        label: 'Police Services',
        description:
          'Cantonal police (Kantonspolizei), municipal police, federal police (fedpol), border guards, and traffic police. Includes crime investigation and public order maintenance.',
      },
      {
        code: 'GF0302',
        label: 'Fire Protection',
        description:
          'Fire brigades (mostly volunteer-based in Switzerland), fire prevention, and emergency response. Many communes have a Feuerwehrpflicht (mandatory fire service or replacement tax).',
      },
      {
        code: 'GF0303',
        label: 'Law Courts',
        description:
          'Federal Supreme Court (Bundesgericht), cantonal courts, district courts, administrative courts, and prosecution services (Staatsanwaltschaft).',
      },
      {
        code: 'GF0304',
        label: 'Prisons',
        description:
          'Correctional facilities, pre-trial detention, probation services, and rehabilitation programs. Managed at cantonal level with inter-cantonal concordats.',
      },
      {
        code: 'GF0305',
        label: 'R&D Public Order & Safety',
        description:
          'Research into policing methods, forensic science, and criminal justice systems.',
      },
      {
        code: 'GF0306',
        label: 'Public Order & Safety n.e.c.',
        description:
          'Other public safety expenditure — e.g., avalanche warning systems, cantonal crisis management.',
      },
    ],
  },
  {
    code: 'GF04',
    label: 'Economic Affairs',
    slug: 'economic-affairs',
    icon: '💼',
    color: '#A67C37',
    description:
      'Government spending on economic infrastructure and support — agriculture, energy, transport, communications, tourism, and industry support. Includes major transport projects like NEAT/AlpTransit.',
    subcategories: [
      {
        code: 'GF0401',
        label: 'General Economic & Commercial Affairs',
        description:
          'Economic policy, trade promotion (Switzerland Global Enterprise), competition regulation (WEKO/COMCO), and commercial affairs.',
      },
      {
        code: 'GF0402',
        label: 'Agriculture, Forestry, Fishing & Hunting',
        description:
          'Direct payments to farmers (Direktzahlungen), agricultural subsidies, structural improvement, Alpine farming support, forestry management, and food safety inspections.',
      },
      {
        code: 'GF0403',
        label: 'Fuel & Energy',
        description:
          'Energy policy, hydropower regulation, nuclear oversight (ENSI), renewable energy subsidies, and the national grid. Cantons own many hydroelectric plants.',
      },
      {
        code: 'GF0404',
        label: 'Mining, Manufacturing & Construction',
        description:
          'Industrial policy, construction standards, building inspections, and mining/geological surveys.',
      },
      {
        code: 'GF0405',
        label: 'Transport',
        description:
          'Roads (national highways, cantonal roads), railways (SBB/CFF subsidies, regional transport orders), public transport, cycling infrastructure. Includes megaprojects like the Gotthard/Lötschberg base tunnels.',
      },
      {
        code: 'GF0406',
        label: 'Communication',
        description:
          'Postal services (PostFinance regulation), telecommunications policy (BAKOM/OFCOM), broadband expansion, and media subsidies.',
      },
      {
        code: 'GF0407',
        label: 'Other Industries',
        description:
          'Tourism promotion (Switzerland Tourism), hospitality industry support, and other sector-specific programs.',
      },
      {
        code: 'GF0408',
        label: 'R&D Economic Affairs',
        description:
          'Applied economic research, Innosuisse (Swiss Innovation Agency), technology transfer, and industry-academic partnerships.',
      },
      {
        code: 'GF0409',
        label: 'Economic Affairs n.e.c.',
        description:
          'Other economic activities — e.g., regional development policy (Neue Regionalpolitik), economic promotion offices.',
      },
    ],
  },
  {
    code: 'GF05',
    label: 'Environmental Protection',
    slug: 'environmental-protection',
    icon: '🌿',
    color: '#6B5B8A',
    description:
      'Waste management, water treatment, pollution control, biodiversity protection, and climate policy. Switzerland invests heavily in clean water and recycling infrastructure.',
    subcategories: [
      {
        code: 'GF0501',
        label: 'Waste Management',
        description:
          'Waste collection, recycling (Switzerland recycles ~53% of waste), incineration plants (KVA), hazardous waste disposal, and the "polluter pays" bag-fee system.',
      },
      {
        code: 'GF0502',
        label: 'Waste Water Management',
        description:
          'Sewage treatment plants (ARA), water purification, sewer networks, and water quality monitoring. Swiss water treatment standards are among the world\'s highest.',
      },
      {
        code: 'GF0503',
        label: 'Pollution Abatement',
        description:
          'Air quality monitoring, noise protection, soil decontamination (Altlastensanierung), and emissions regulation.',
      },
      {
        code: 'GF0504',
        label: 'Protection of Biodiversity & Landscape',
        description:
          'National parks, nature reserves, species protection, landscape conservation, and ecological compensation areas in agriculture.',
      },
      {
        code: 'GF0505',
        label: 'R&D Environmental Protection',
        description:
          'Environmental research, climate science, and sustainability studies — often in partnership with ETH Zurich and EPFL.',
      },
      {
        code: 'GF0506',
        label: 'Environmental Protection n.e.c.',
        description:
          'Other environmental spending — e.g., climate adaptation measures, flood protection, natural hazard prevention.',
      },
    ],
  },
  {
    code: 'GF06',
    label: 'Housing & Community',
    slug: 'housing-community',
    icon: '🏘️',
    color: '#8A5A6B',
    description:
      'Housing development, community planning, water supply, and street lighting. Includes affordable housing initiatives — a hot topic in cities like Zurich and Geneva.',
    subcategories: [
      {
        code: 'GF0601',
        label: 'Housing Development',
        description:
          'Social housing construction, rental subsidies, housing cooperatives support (Genossenschaftswohnungen), and the Federal Housing Office programs.',
      },
      {
        code: 'GF0602',
        label: 'Community Development',
        description:
          'Urban planning, zoning, land-use regulation, town center revitalization, and public space design.',
      },
      {
        code: 'GF0603',
        label: 'Water Supply',
        description:
          'Drinking water infrastructure, reservoirs, water distribution networks, and water quality assurance. Swiss tap water quality is famously excellent.',
      },
      {
        code: 'GF0604',
        label: 'Street Lighting',
        description:
          'Public lighting infrastructure, LED conversion programs, and energy-efficient street lighting projects.',
      },
      {
        code: 'GF0605',
        label: 'R&D Housing & Community',
        description:
          'Research into sustainable construction, urban development, and housing policy.',
      },
      {
        code: 'GF0606',
        label: 'Housing & Community n.e.c.',
        description:
          'Other housing and community amenities not elsewhere classified.',
      },
    ],
  },
  {
    code: 'GF07',
    label: 'Health',
    slug: 'health',
    icon: '🏥',
    color: '#3D7A8A',
    description:
      'Hospital services, outpatient care, public health programs, and pharmaceuticals. Switzerland has mandatory health insurance (KVG/LAMal) — public spending here covers hospital infrastructure, subsidies, and prevention.',
    subcategories: [
      {
        code: 'GF0701',
        label: 'Medical Products & Equipment',
        description:
          'Pharmaceutical regulation (Swissmedic), medical device oversight, and government procurement of medical supplies.',
      },
      {
        code: 'GF0702',
        label: 'Outpatient Services',
        description:
          'Subsidies for outpatient clinics, Spitex (home care services), and ambulatory medical centers.',
      },
      {
        code: 'GF0703',
        label: 'Hospital Services',
        description:
          'Public hospital funding (Kantonsspitäler and Universitätsspitäler), hospital construction, and cantonal hospital lists. The largest health spending category.',
      },
      {
        code: 'GF0704',
        label: 'Public Health Services',
        description:
          'Disease prevention, vaccination programs, health promotion (Gesundheitsförderung Schweiz), food safety, and epidemiological surveillance (BAG/OFSP).',
      },
      {
        code: 'GF0705',
        label: 'R&D Health',
        description:
          'Medical research funding, clinical trials oversight, and health sciences research — often through SNF (Swiss National Science Foundation).',
      },
      {
        code: 'GF0706',
        label: 'Health n.e.c.',
        description:
          'Other health spending — e.g., premium reduction subsidies (Prämienverbilligung), cantonal health insurance support.',
      },
    ],
  },
  {
    code: 'GF08',
    label: 'Recreation, Culture & Religion',
    slug: 'recreation-culture-religion',
    icon: '🎭',
    color: '#5C7A3A',
    description:
      'Sports, cultural institutions, media, and religious affairs. Includes funding for Pro Helvetia, national museums, sports infrastructure, and support for Switzerland\'s four national languages.',
    subcategories: [
      {
        code: 'GF0801',
        label: 'Recreational & Sporting Services',
        description:
          'Public sports facilities, Swiss Olympic Association support, Youth+Sport programs (J+S), swimming pools, and outdoor recreation infrastructure.',
      },
      {
        code: 'GF0802',
        label: 'Cultural Services',
        description:
          'Museums, theaters, libraries, heritage preservation, Pro Helvetia (arts council), film funding, and support for cultural diversity across language regions.',
      },
      {
        code: 'GF0803',
        label: 'Broadcasting & Publishing',
        description:
          'SRG SSR (public broadcaster) funding via the Serafe fee, media diversity support, and press subsidies for regional newspapers.',
      },
      {
        code: 'GF0804',
        label: 'Religious & Community Services',
        description:
          'Church tax administration (where applicable), support for recognized religious communities, and interfaith dialogue programs.',
      },
      {
        code: 'GF0805',
        label: 'R&D Recreation, Culture & Religion',
        description:
          'Research in cultural studies, sports science, and heritage conservation.',
      },
      {
        code: 'GF0806',
        label: 'Recreation, Culture & Religion n.e.c.',
        description:
          'Other cultural and recreational spending not elsewhere classified.',
      },
    ],
  },
  {
    code: 'GF09',
    label: 'Education',
    slug: 'education',
    icon: '🎓',
    color: '#B36B3D',
    description:
      'The largest spending category for cantons. Covers everything from kindergarten to universities. Education is primarily a cantonal responsibility in Switzerland — each canton runs its own school system.',
    subcategories: [
      {
        code: 'GF0901',
        label: 'Pre-Primary & Primary Education',
        description:
          'Kindergarten (2 years, mandatory since HarmoS), primary school (Primarschule, 6 years). Funded and managed by cantons and communes. Teachers, school buildings, and materials.',
      },
      {
        code: 'GF0902',
        label: 'Secondary Education',
        description:
          'Lower secondary (Sekundarschule/Oberstufe, 3 years) and upper secondary: Gymnasium (leading to Matura), vocational schools (Berufsfachschulen), and Fachmittelschulen.',
      },
      {
        code: 'GF0903',
        label: 'Post-Secondary Non-Tertiary Education',
        description:
          'Higher vocational education (Höhere Berufsbildung), preparatory courses, and bridging programs between secondary and tertiary levels.',
      },
      {
        code: 'GF0904',
        label: 'Tertiary Education',
        description:
          'Universities (ETH Zurich, EPFL, cantonal universities), Fachhochschulen (universities of applied sciences), and Pädagogische Hochschulen (teacher training). Funded jointly by Confederation and cantons.',
      },
      {
        code: 'GF0905',
        label: 'Education Not Definable by Level',
        description:
          'Cross-level educational programs, continuing education, adult learning, and language courses for integration.',
      },
      {
        code: 'GF0906',
        label: 'Subsidiary Services to Education',
        description:
          'School transport, school meals (Mittagstisch), student counseling, school health services, and educational psychology.',
      },
      {
        code: 'GF0907',
        label: 'R&D Education',
        description:
          'Educational research, pedagogical development, and PISA-related studies. Often conducted through SERI (State Secretariat for Education, Research and Innovation).',
      },
      {
        code: 'GF0908',
        label: 'Education n.e.c.',
        description:
          'Other education spending — e.g., scholarships, cantonal student exchange programs, integration programs.',
      },
    ],
  },
  {
    code: 'GF10',
    label: 'Social Protection',
    slug: 'social-protection',
    icon: '🤝',
    color: '#4A5A8A',
    description:
      'The largest overall government spending category. Covers AHV/AVS (old-age pensions), IV/AI (disability), unemployment insurance, family allowances, social assistance (Sozialhilfe), and asylum support.',
    subcategories: [
      {
        code: 'GF1001',
        label: 'Sickness & Disability',
        description:
          'Disability insurance (IV/AI), sickness benefits, and support for people with disabilities — residential homes, workshops, and integration programs.',
      },
      {
        code: 'GF1002',
        label: 'Old Age',
        description:
          'AHV/AVS (1st pillar old-age pension), supplementary benefits (Ergänzungsleistungen/EL), and old-age care facilities. The largest single social spending item.',
      },
      {
        code: 'GF1003',
        label: 'Survivors',
        description:
          'Widows\'/widowers\' pensions, orphan benefits, and survivor support under AHV/AVS.',
      },
      {
        code: 'GF1004',
        label: 'Family & Children',
        description:
          'Family allowances (Familienzulagen), childcare subsidies (Kita), child protection services (KESB/APEA), and youth welfare.',
      },
      {
        code: 'GF1005',
        label: 'Unemployment',
        description:
          'Unemployment insurance (ALV/AC), regional employment centers (RAV/ORP), retraining programs, and short-time work compensation (Kurzarbeit).',
      },
      {
        code: 'GF1006',
        label: 'Housing',
        description:
          'Housing assistance for low-income households, rent subsidies, and emergency accommodation.',
      },
      {
        code: 'GF1007',
        label: 'Social Exclusion n.e.c.',
        description:
          'Social assistance (Sozialhilfe), asylum seeker support, integration programs, aid for the homeless, and addiction services.',
      },
      {
        code: 'GF1008',
        label: 'R&D Social Protection',
        description:
          'Research into social security systems, poverty studies, and labor market analysis.',
      },
      {
        code: 'GF1009',
        label: 'Social Protection n.e.c.',
        description:
          'Other social protection spending not elsewhere classified.',
      },
    ],
  },
];

export const TOP_LEVEL_CODES = COFOG_CATEGORIES.map((c) => c.code);

export function getCategoryBySlug(slug: string): CofogCategory | undefined {
  return COFOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByCode(code: string): CofogCategory | undefined {
  return COFOG_CATEGORIES.find((c) => c.code === code);
}
