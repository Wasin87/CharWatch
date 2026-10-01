/**
 * CHARWATCH Data Definitions & Types
 */

export type RiskTier = 'ADVISORY' | 'WARNING' | 'CRITICAL';

export interface RiverRegion {
  id: string;
  name: string;
  riverSystem: 'Jamuna' | 'Padma' | 'Meghna' | 'Brahmaputra';
  district: string;
  lat: number;
  lng: number;
  riskScore: number; // 0 - 100
  riskTier: RiskTier;
  erosionRate: number; // meters per year
  bankShiftMeters: number; // total shift in time window
  soilMoisturePercent: number; // %
  groundSubsidenceMm: number; // mm/yr
  radarCoherence: number; // 0.00 - 1.00
  backscatterLBandDb: number; // NISAR L-band dB
  backscatterCBandDb: number; // Sentinel-1 C-band dB
  activeCharsCount: number;
  estimatedAffectedPopulation: number;
  lastSatelliteObservation: string; // ISO Date
  description: string;
  historicalOutlines: {
    year: number;
    label: string;
    path: string; // SVG path data or relative points
  }[];
}

export interface SatelliteMission {
  id: string;
  name: string;
  fullName: string;
  agency: string;
  band: 'L-Band (24cm)' | 'C-Band (5.6cm)' | 'Optical (Multi)' | 'Altimetry';
  orbitAltitudeKm: number;
  revisitDays: number;
  spatialResolutionM: string;
  primaryPurpose: string;
  activeStatus: 'OPERATIONAL' | 'UPCOMING' | 'CALIBRATING';
  polarizations: string[];
  description: string;
  iconName: string;
}

export interface CharItem {
  id: string; // e.g. CW-DEMO-0241
  name: string;
  river: string;
  district: string;
  firstDetectedDate: string;
  currentAreaKm2: number;
  areaChangePercentYearly: number;
  stage: 'SUBMERGED' | 'SANDBAR' | 'EMERGING' | 'VEGETATED' | 'CHAR';
  stabilityScore: number; // 0 - 100
  vegetationIndexNDVI: number; // 0.0 - 1.0
  settlementCount: number;
  description: string;
  coordinates: { lat: number; lng: number };
}

export interface RadarTelemetryPoint {
  date: string;
  coherence: number;
  soilMoisture: number;
  backscatterVV: number;
  backscatterVH: number;
  bankShift: number;
}

export interface EarlyWarningAction {
  id: string;
  tier: RiskTier;
  title: string;
  actionText: string;
  targetRole: string;
  icon: string;
  timeframe: string;
  protocolSteps: string[];
}

export interface MissionGameStep {
  id: number;
  title: string;
  instruction: string;
  targetRegionId: string;
  expectedClassification: RiskTier;
}

export interface DataSourceSpec {
  name: string;
  organization: string;
  type: string;
  coverage: string;
  resolution: string;
  lastUpdated: string;
  license: string;
  status: 'VERIFIED SOURCE' | 'PROTOTYPE SIMULATED';
  link: string;
}
