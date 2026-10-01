import { RiverRegion, SatelliteMission, CharItem, EarlyWarningAction, DataSourceSpec } from '../types/charwatch';

export const SIMULATED_RIVER_REGIONS: RiverRegion[] = [
  {
    id: 'sirajganj-jamuna',
    name: 'Sirajganj Sector',
    riverSystem: 'Jamuna',
    district: 'Sirajganj',
    lat: 24.4539,
    lng: 89.7082,
    riskScore: 84,
    riskTier: 'CRITICAL',
    erosionRate: 340, // m/yr
    bankShiftMeters: 1280,
    soilMoisturePercent: 48.2,
    groundSubsidenceMm: 18.4,
    radarCoherence: 0.38, // low coherence = high surface shift
    backscatterLBandDb: -10.8,
    backscatterCBandDb: -14.1,
    activeCharsCount: 7,
    estimatedAffectedPopulation: 142000,
    lastSatelliteObservation: '2026-09-28',
    description: 'Severe active bank migration along western Jamuna embankment. High monsoonal fluid sheer stress inducing bank slippage.',
    historicalOutlines: [
      { year: 2020, label: 'T0 (2020)', path: 'M 20,40 Q 60,60 100,30 T 180,80 T 260,50' },
      { year: 2022, label: 'T1 (2022)', path: 'M 20,48 Q 65,68 105,38 T 185,88 T 265,58' },
      { year: 2024, label: 'T2 (2024)', path: 'M 20,58 Q 72,78 112,48 T 192,98 T 272,68' },
      { year: 2025, label: 'T3 (2025)', path: 'M 20,68 Q 80,88 120,58 T 200,108 T 280,78' },
      { year: 2026, label: 'CURRENT (2026)', path: 'M 20,78 Q 88,98 128,68 T 208,118 T 288,88' }
    ]
  },
  {
    id: 'sariakandi-bogra',
    name: 'Sariakandi Sector',
    riverSystem: 'Jamuna',
    district: 'Bogra',
    lat: 24.8986,
    lng: 89.6202,
    riskScore: 76,
    riskTier: 'WARNING',
    erosionRate: 210,
    bankShiftMeters: 840,
    soilMoisturePercent: 41.5,
    groundSubsidenceMm: 12.1,
    radarCoherence: 0.52,
    backscatterLBandDb: -11.5,
    backscatterCBandDb: -15.2,
    activeCharsCount: 12,
    estimatedAffectedPopulation: 98000,
    lastSatelliteObservation: '2026-09-27',
    description: 'Multiple braided river channels splitting around emerging sandbars. High risk to agricultural land on eastern bank.',
    historicalOutlines: [
      { year: 2020, label: 'T0 (2020)', path: 'M 30,30 Q 70,50 110,25 T 190,60 T 270,40' },
      { year: 2022, label: 'T1 (2022)', path: 'M 30,36 Q 74,56 114,31 T 194,66 T 274,46' },
      { year: 2024, label: 'T2 (2024)', path: 'M 30,44 Q 80,64 120,39 T 200,74 T 280,54' },
      { year: 2025, label: 'T3 (2025)', path: 'M 30,52 Q 86,72 126,47 T 206,82 T 286,62' },
      { year: 2026, label: 'CURRENT (2026)', path: 'M 30,60 Q 92,80 132,55 T 212,90 T 292,70' }
    ]
  },
  {
    id: 'kurigram-brahmaputra',
    name: 'Kurigram Sector',
    riverSystem: 'Brahmaputra',
    district: 'Kurigram',
    lat: 25.8054,
    lng: 89.6361,
    riskScore: 68,
    riskTier: 'WARNING',
    erosionRate: 185,
    bankShiftMeters: 620,
    soilMoisturePercent: 39.8,
    groundSubsidenceMm: 9.3,
    radarCoherence: 0.61,
    backscatterLBandDb: -12.2,
    backscatterCBandDb: -16.0,
    activeCharsCount: 19,
    estimatedAffectedPopulation: 115000,
    lastSatelliteObservation: '2026-09-29',
    description: 'Dynamic northern entry zone of Brahmaputra into Bangladesh. Frequent seasonal char formation and channel rearrangement.',
    historicalOutlines: [
      { year: 2020, label: 'T0 (2020)', path: 'M 10,20 Q 50,40 90,20 T 170,50 T 250,30' },
      { year: 2022, label: 'T1 (2022)', path: 'M 10,25 Q 53,43 93,23 T 173,53 T 253,33' },
      { year: 2024, label: 'T2 (2024)', path: 'M 10,32 Q 58,48 98,28 T 178,58 T 258,38' },
      { year: 2025, label: 'T3 (2025)', path: 'M 10,38 Q 62,52 102,32 T 182,62 T 262,42' },
      { year: 2026, label: 'CURRENT (2026)', path: 'M 10,44 Q 66,56 106,36 T 186,66 T 266,46' }
    ]
  },
  {
    id: 'chandpur-confluence',
    name: 'Chandpur Confluence',
    riverSystem: 'Meghna',
    district: 'Chandpur',
    lat: 23.2321,
    lng: 90.6631,
    riskScore: 89,
    riskTier: 'CRITICAL',
    erosionRate: 410,
    bankShiftMeters: 1650,
    soilMoisturePercent: 52.4,
    groundSubsidenceMm: 22.8,
    radarCoherence: 0.29,
    backscatterLBandDb: -9.8,
    backscatterCBandDb: -13.2,
    activeCharsCount: 5,
    estimatedAffectedPopulation: 210000,
    lastSatelliteObservation: '2026-09-28',
    description: 'Furious hydraulic confluence where Padma and Meghna join. High energy river current inducing severe bank carving.',
    historicalOutlines: [
      { year: 2020, label: 'T0 (2020)', path: 'M 25,50 Q 75,70 125,40 T 205,90 T 285,60' },
      { year: 2022, label: 'T1 (2022)', path: 'M 25,60 Q 82,78 132,48 T 212,98 T 292,68' },
      { year: 2024, label: 'T2 (2024)', path: 'M 25,72 Q 90,88 140,58 T 220,108 T 300,78' },
      { year: 2025, label: 'T3 (2025)', path: 'M 25,84 Q 98,98 148,68 T 228,118 T 308,88' },
      { year: 2026, label: 'CURRENT (2026)', path: 'M 25,96 Q 106,108 156,78 T 236,128 T 316,98' }
    ]
  },
  {
    id: 'shariatpur-padma',
    name: 'Shariatpur Sector',
    riverSystem: 'Padma',
    district: 'Shariatpur',
    lat: 23.2423,
    lng: 90.4347,
    riskScore: 61,
    riskTier: 'ADVISORY',
    erosionRate: 140,
    bankShiftMeters: 480,
    soilMoisturePercent: 36.2,
    groundSubsidenceMm: 6.8,
    radarCoherence: 0.72,
    backscatterLBandDb: -13.8,
    backscatterCBandDb: -17.4,
    activeCharsCount: 9,
    estimatedAffectedPopulation: 64000,
    lastSatelliteObservation: '2026-09-26',
    description: 'Stabilized south bank following Padma Bridge river training works. Mid-river char stabilization observed in L-band radar.',
    historicalOutlines: [
      { year: 2020, label: 'T0 (2020)', path: 'M 15,35 Q 55,55 95,35 T 175,65 T 255,45' },
      { year: 2022, label: 'T1 (2022)', path: 'M 15,38 Q 57,57 97,37 T 177,67 T 257,47' },
      { year: 2024, label: 'T2 (2024)', path: 'M 15,42 Q 60,60 100,40 T 180,70 T 260,50' },
      { year: 2025, label: 'T3 (2025)', path: 'M 15,45 Q 62,62 102,42 T 182,72 T 262,52' },
      { year: 2026, label: 'CURRENT (2026)', path: 'M 15,48 Q 64,64 104,44 T 184,74 T 264,54' }
    ]
  },
  {
    id: 'kazipur-embankment',
    name: 'Kazipur Embankment',
    riverSystem: 'Jamuna',
    district: 'Sirajganj',
    lat: 24.6469,
    lng: 89.6521,
    riskScore: 78,
    riskTier: 'WARNING',
    erosionRate: 260,
    bankShiftMeters: 920,
    soilMoisturePercent: 44.1,
    groundSubsidenceMm: 15.2,
    radarCoherence: 0.46,
    backscatterLBandDb: -11.1,
    backscatterCBandDb: -14.8,
    activeCharsCount: 11,
    estimatedAffectedPopulation: 87000,
    lastSatelliteObservation: '2026-09-29',
    description: 'Erosion threatening hard embankment structures. High temporal dielectric variance indicating moisture saturation along geotextile revetments.',
    historicalOutlines: [
      { year: 2020, label: 'T0 (2020)', path: 'M 20,25 Q 60,45 100,25 T 180,55 T 260,35' },
      { year: 2022, label: 'T1 (2022)', path: 'M 20,30 Q 64,49 104,29 T 184,59 T 264,39' },
      { year: 2024, label: 'T2 (2024)', path: 'M 20,38 Q 70,55 110,35 T 190,65 T 270,45' },
      { year: 2025, label: 'T3 (2025)', path: 'M 20,44 Q 75,60 115,40 T 195,70 T 275,50' },
      { year: 2026, label: 'CURRENT (2026)', path: 'M 20,50 Q 80,65 120,45 T 200,75 T 280,55' }
    ]
  }
];

export const SIMULATED_SATELLITES: SatelliteMission[] = [
  {
    id: 'nisar',
    name: 'NISAR',
    fullName: 'NASA-ISRO Synthetic Aperture Radar',
    agency: 'NASA / ISRO',
    band: 'L-Band (24cm)',
    orbitAltitudeKm: 747,
    revisitDays: 12,
    spatialResolutionM: '3 - 10m',
    primaryPurpose: 'Deep soil moisture, ground deformation, land surface change & sub-surface dielectric mapping.',
    activeStatus: 'OPERATIONAL',
    polarizations: ['HH', 'HV', 'VV', 'VH'],
    description: 'NISAR uses a 12-meter deployable reflector antenna operating in L-Band (1.25 GHz). L-band microwaves penetrate cloud cover, monsoonal haze, and dense canopy to directly image riverbank soil saturation and fine-scale erosion dynamics.',
    iconName: 'Radio'
  },
  {
    id: 'sentinel-1',
    name: 'Sentinel-1',
    fullName: 'Copernicus Sentinel-1 C-Band SAR',
    agency: 'ESA / Copernicus',
    band: 'C-Band (5.6cm)',
    orbitAltitudeKm: 693,
    revisitDays: 6,
    spatialResolutionM: '5x20m (IW mode)',
    primaryPurpose: 'High frequency land-water boundary mapping, riverbank outline change, interferometric coherence decay.',
    activeStatus: 'OPERATIONAL',
    polarizations: ['VV', 'VH'],
    description: 'Sentinel-1 provides high-revisit C-band radar backscatter. Superior for detecting surface roughness, water boundary extraction, and historical flood inundation tracking in Bangladesh.',
    iconName: 'Orbit'
  },
  {
    id: 'swot',
    name: 'SWOT',
    fullName: 'Surface Water and Ocean Topography',
    agency: 'NASA / CNES',
    band: 'Altimetry',
    orbitAltitudeKm: 890,
    revisitDays: 21,
    spatialResolutionM: '10 - 50m water surface elevation',
    primaryPurpose: 'Direct river surface elevation, slope gradients, and discharge volume estimates across major Bangladesh rivers.',
    activeStatus: 'OPERATIONAL',
    polarizations: ['Ka-band Radar Interferometer'],
    description: 'SWOT provides revolutionary 3D surface water elevation profiles, allowing CharWatch to measure hydraulic slope changes along Jamuna bank shear zones.',
    iconName: 'Waves'
  },
  {
    id: 'landsat-9',
    name: 'Landsat 9',
    fullName: 'NASA / USGS Landsat 9 OLI-2 / TIRS-2',
    agency: 'NASA / USGS',
    band: 'Optical (Multi)',
    orbitAltitudeKm: 705,
    revisitDays: 16,
    spatialResolutionM: '15 - 30m',
    primaryPurpose: 'Vegetation index (NDVI), multispectral land cover, and dry-season optical verification of char island settlements.',
    activeStatus: 'OPERATIONAL',
    polarizations: ['Visible', 'NIR', 'SWIR', 'TIR'],
    description: 'Complementary optical imagery used during cloud-free dry season windows to validate vegetation growth and agricultural land use on newly formed chars.',
    iconName: 'Eye'
  }
];

export const SIMULATED_CHARS: CharItem[] = [
  {
    id: 'CW-DEMO-0241',
    name: 'Charsera North Island',
    river: 'Jamuna River',
    district: 'Sirajganj',
    firstDetectedDate: '2022-10-14',
    currentAreaKm2: 4.82,
    areaChangePercentYearly: 14.5,
    stage: 'VEGETATED',
    stabilityScore: 68,
    vegetationIndexNDVI: 0.58,
    settlementCount: 1400,
    description: 'Emerging braided island showing rapid silt accretion on western flank. Catkin grass (Kashbon) colonization established.',
    coordinates: { lat: 24.4820, lng: 89.7420 }
  },
  {
    id: 'CW-DEMO-0118',
    name: 'Balia Shoal',
    river: 'Padma River',
    district: 'Shariatpur',
    firstDetectedDate: '2024-04-02',
    currentAreaKm2: 2.15,
    areaChangePercentYearly: 32.0,
    stage: 'EMERGING',
    stabilityScore: 42,
    vegetationIndexNDVI: 0.22,
    settlementCount: 180,
    description: 'Young silt bank emerging above low-water mark. Highly vulnerable to next monsoon flow shear.',
    coordinates: { lat: 23.2680, lng: 90.4610 }
  },
  {
    id: 'CW-DEMO-0309',
    name: 'Kashipur Permanent Char',
    river: 'Brahmaputra / Jamuna',
    district: 'Kurigram',
    firstDetectedDate: '2016-08-19',
    currentAreaKm2: 11.40,
    areaChangePercentYearly: 2.1,
    stage: 'CHAR',
    stabilityScore: 88,
    vegetationIndexNDVI: 0.74,
    settlementCount: 6200,
    description: 'Mature stabilized char with permanent agricultural fields, schools, and elevated tube-wells.',
    coordinates: { lat: 25.7610, lng: 89.6840 }
  },
  {
    id: 'CW-DEMO-0402',
    name: 'Shuriber Bar',
    river: 'Meghna River',
    district: 'Chandpur',
    firstDetectedDate: '2025-06-11',
    currentAreaKm2: 1.28,
    areaChangePercentYearly: -12.4,
    stage: 'SANDBAR',
    stabilityScore: 24,
    vegetationIndexNDVI: 0.08,
    settlementCount: 0,
    description: 'Submerged during peak high tide. High flow velocity around confluence causing ongoing erosion of trailing edge.',
    coordinates: { lat: 23.2150, lng: 90.6210 }
  }
];

export const SIMULATED_EARLY_WARNING_ACTIONS: EarlyWarningAction[] = [
  {
    id: 'act-advisory',
    tier: 'ADVISORY',
    title: 'Advisory Protocol — Routine Monitoring',
    actionText: 'Initiate daily Sentinel-1 / NISAR swath checks. Notify local Union Parishad disaster focal points.',
    targetRole: 'Local Disaster Management Committees (NDMC / UDMC)',
    icon: 'ShieldCheck',
    timeframe: 'Ongoing / 12-Day Swath Orbit',
    protocolSteps: [
      'Cross-check L-Band soil moisture index across riverbank revetments.',
      'Log baseline river water levels from Bangladesh Water Development Board (BWDB) gauges.',
      'Inform riverine agricultural communities of predicted channel shifts.'
    ]
  },
  {
    id: 'act-warning',
    tier: 'WARNING',
    title: 'Warning Protocol — Pre-Erosion Readiness',
    actionText: 'Deploy mobile embankments reinforcement teams. Pre-position emergency relief & livestock shelters.',
    targetRole: 'District Relief Officers & Bangladesh Red Crescent',
    icon: 'AlertTriangle',
    timeframe: '3 - 5 Days Before Anticipated Shift',
    protocolSteps: [
      'Accelerate satellite radar coherence check to detect sub-surface soil slippage.',
      'Issue SMS alerts to registered union parishad leaders along shifting bank sectors.',
      'Establish safe transit corridors for char island dwellers to elevated shelters.'
    ]
  },
  {
    id: 'act-critical',
    tier: 'CRITICAL',
    title: 'Critical Emergency Workflow — Immediate Response',
    actionText: 'Trigger emergency evacuation protocols for at-risk bank settlements. Deploy geo-bag embankment shielding.',
    targetRole: 'Ministry of Disaster Management & Water Resources',
    icon: 'AlertOctagon',
    timeframe: '0 - 48 Hours / Emergency State',
    protocolSteps: [
      'Mobilize Water Development Board emergency geo-textile bag drop teams.',
      'Coordinate boat evacuation fleet for isolated char island populations.',
      'Transmit high-frequency SAR flood and breach boundary maps to national response unit.'
    ]
  }
];

import { REAL_DATA_SOURCES } from './realScientificDatasets';

export const SIMULATED_DATA_SOURCES: DataSourceSpec[] = REAL_DATA_SOURCES;
