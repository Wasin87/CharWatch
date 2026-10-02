/**
 * NASA Global Imagery Browse Services (GIBS) Official Layer Configuration
 * 
 * Defines authentic, operational NASA Earth Observation imagery layers available
 * through NASA GIBS WMTS/WMS for Global & Bangladesh River Observatories in EPSG:3857.
 */

export type GIBSImageryType = 
  | 'OPTICAL_REFLECTANCE'
  | 'FALSE_COLOR_HYDROLOGY'
  | 'HIGH_RES_OPTICAL'
  | 'MICROWAVE_SOIL_MOISTURE';

export interface GIBSLayerConfig {
  id: string;
  layerIdentifier: string;
  title: string;
  subtitle: string;
  description: string;
  imageryType: GIBSImageryType;
  typeBadge: string;
  sensor: string;
  satellite: string;
  agency: string;
  spatialResolution: string;
  tileMatrixSet: string;
  format: 'jpg' | 'png';
  minZoom: number;
  maxZoom: number;
  minDate?: string;
  maxDate?: string;
  defaultDate: string;
  defaultOpacity: number;
  defaultVisibility: boolean;
  scientificRole: string;
  interpretationGuide: string;
  isRadar: boolean;
  attribution: string;
  docUrl: string;
}

export const GIBS_LAYERS: GIBSLayerConfig[] = [
  {
    id: 'modis-terra-truecolor',
    layerIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    title: 'MODIS Terra True Color (Corrected Reflectance)',
    subtitle: 'Daily Optical Surface Reflectance (Red, Green, Blue)',
    description: 'Natural color composite from the Moderate Resolution Imaging Spectroradiometer (MODIS) aboard NASA’s Terra satellite. Shows realistic earth surface colors, cloud systems, mega-river corridor siltation, and global delta dynamics.',
    imageryType: 'OPTICAL_REFLECTANCE',
    typeBadge: 'OPTICAL · REFLECTANCE',
    sensor: 'MODIS (Bands 1, 4, 3)',
    satellite: 'Terra (EOS AM-1)',
    agency: 'NASA EOSDIS',
    spatialResolution: '250m at nadir',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
    minZoom: 1,
    maxZoom: 9,
    minDate: '2000-02-24',
    defaultDate: '2024-08-15',
    defaultOpacity: 1.0,
    defaultVisibility: true,
    scientificRole: 'Synoptic optical baseline for global mega-rivers, deltaic sediment plumes, and char island morphology.',
    interpretationGuide: 'Rivers appear brownish/tan when carrying heavy sediment loads. Deep clear ocean appears dark navy/black. Vegetation appears deep green.',
    isRadar: false,
    attribution: 'NASA EOSDIS GIBS / MODIS Terra',
    docUrl: 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/modis'
  },
  {
    id: 'modis-terra-721',
    layerIdentifier: 'MODIS_Terra_CorrectedReflectance_Bands721',
    title: 'MODIS Terra False Color (Bands 7-2-1 / Land-Water Boundary)',
    subtitle: 'Shortwave Infrared, Near-Infrared, Red Composite',
    description: 'Specialized optical false-color combination using SWIR (Band 7), NIR (Band 2), and Red (Band 1). Sharpens the boundary between open water, saturated sandbars, wetlands, and dense vegetation.',
    imageryType: 'FALSE_COLOR_HYDROLOGY',
    typeBadge: 'OPTICAL · HYDRO-SPECTRAL',
    sensor: 'MODIS (Bands 7, 2, 1)',
    satellite: 'Terra (EOS AM-1)',
    agency: 'NASA EOSDIS',
    spatialResolution: '250m at nadir',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
    minZoom: 1,
    maxZoom: 9,
    minDate: '2000-02-24',
    defaultDate: '2024-08-15',
    defaultOpacity: 1.0,
    defaultVisibility: false,
    scientificRole: 'Direct optical land-water delineation, flood extent mapping, and global delta accretion monitoring.',
    interpretationGuide: 'Open water and active river channels appear deep black/dark blue. Living vegetation is vivid bright green. Bare riverbed sand and newly formed chars appear cyan or tan.',
    isRadar: false,
    attribution: 'NASA EOSDIS GIBS / MODIS Bands 7-2-1',
    docUrl: 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products'
  },
  {
    id: 'viirs-snpp-truecolor',
    layerIdentifier: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    title: 'VIIRS SNPP True Color (Corrected Reflectance)',
    subtitle: 'Visible Infrared Imaging Radiometer Suite (Daytime)',
    description: 'High-fidelity natural color imagery from Suomi NPP VIIRS. Provides crisp daytime optical coverage with consistent geometric resolution across the entire swath edge.',
    imageryType: 'OPTICAL_REFLECTANCE',
    typeBadge: 'OPTICAL · TRUE COLOR',
    sensor: 'VIIRS (Bands M5, M4, M3)',
    satellite: 'Suomi NPP',
    agency: 'NASA / NOAA',
    spatialResolution: '250m / 375m',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
    minZoom: 1,
    maxZoom: 9,
    minDate: '2012-01-19',
    defaultDate: '2024-08-15',
    defaultOpacity: 1.0,
    defaultVisibility: false,
    scientificRole: 'High-contrast optical baseline for tracking worldwide sediment plumes and coastline changes.',
    interpretationGuide: 'Allows cloud-free day-to-day visual comparison of global coastal and river delta boundaries.',
    isRadar: false,
    attribution: 'NASA / NOAA / Suomi NPP VIIRS',
    docUrl: 'https://earthdata.nasa.gov/sensors/viirs'
  },
  {
    id: 'modis-aqua-truecolor',
    layerIdentifier: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    title: 'MODIS Aqua True Color (Afternoon Swath)',
    subtitle: 'Daily Afternoon Optical Surface Reflectance',
    description: 'Afternoon pass (1:30 PM local crossing time) from NASA’s Aqua satellite, capturing diurnal changes in sediment transport and cloud dynamics.',
    imageryType: 'OPTICAL_REFLECTANCE',
    typeBadge: 'OPTICAL · AFTERNOON PASS',
    sensor: 'MODIS (Bands 1, 4, 3)',
    satellite: 'Aqua (EOS PM-1)',
    agency: 'NASA EOSDIS',
    spatialResolution: '250m at nadir',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
    minZoom: 1,
    maxZoom: 9,
    minDate: '2002-07-04',
    defaultDate: '2024-08-15',
    defaultOpacity: 1.0,
    defaultVisibility: false,
    scientificRole: 'Afternoon optical baseline providing secondary daily cloud clearance opportunity.',
    interpretationGuide: 'Complements morning Terra pass to confirm dynamic water boundaries.',
    isRadar: false,
    attribution: 'NASA EOSDIS GIBS / MODIS Aqua',
    docUrl: 'https://www.earthdata.nasa.gov/sensors/modis'
  },
  {
    id: 'modis-aqua-721',
    layerIdentifier: 'MODIS_Aqua_CorrectedReflectance_Bands721',
    title: 'MODIS Aqua False Color (Bands 7-2-1)',
    subtitle: 'Afternoon Infrared Land-Water Boundary Delineation',
    description: 'Afternoon SWIR/NIR false color showing floodwater expanse and high-moisture sandbars in intense high contrast.',
    imageryType: 'FALSE_COLOR_HYDROLOGY',
    typeBadge: 'OPTICAL · HYDRO-SPECTRAL',
    sensor: 'MODIS (Bands 7, 2, 1)',
    satellite: 'Aqua (EOS PM-1)',
    agency: 'NASA EOSDIS',
    spatialResolution: '250m at nadir',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
    minZoom: 1,
    maxZoom: 9,
    minDate: '2002-07-04',
    defaultDate: '2024-08-15',
    defaultOpacity: 1.0,
    defaultVisibility: false,
    scientificRole: 'High-contrast flood inundation and char emergence delineation.',
    interpretationGuide: 'Water appears dark black/blue; vegetation is bright electric green.',
    isRadar: false,
    attribution: 'NASA EOSDIS GIBS / MODIS Aqua 7-2-1',
    docUrl: 'https://wiki.earthdata.nasa.gov/display/GIBS/'
  },
  {
    id: 'viirs-noaa20-truecolor',
    layerIdentifier: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
    title: 'VIIRS NOAA-20 True Color (JPSS-1)',
    subtitle: 'Joint Polar Satellite System High-Resolution Optical Mosaic',
    description: 'High-resolution multi-band optical imagery from NOAA-20 VIIRS, operating in tandem with Suomi NPP.',
    imageryType: 'OPTICAL_REFLECTANCE',
    typeBadge: 'OPTICAL · HIGH RESOLUTION',
    sensor: 'VIIRS (Bands M5, M4, M3)',
    satellite: 'NOAA-20 (JPSS-1)',
    agency: 'NASA / NOAA',
    spatialResolution: '375m Imagery Bands',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    format: 'jpg',
    minZoom: 1,
    maxZoom: 9,
    minDate: '2018-01-05',
    defaultDate: '2024-08-15',
    defaultOpacity: 1.0,
    defaultVisibility: false,
    scientificRole: 'Multi-satellite constellation cross-verification of global morphodynamics.',
    interpretationGuide: 'Provides crisp daytime optical context.',
    isRadar: false,
    attribution: 'NASA / NOAA JPSS Project',
    docUrl: 'https://www.jpss.noaa.gov/'
  }
];

export interface RiverPreset {
  id: string;
  name: string;
  regionCategory: 'BANGLADESH' | 'AMERICAS' | 'ASIA_PACIFIC' | 'AFRICA_EUROPE' | 'GLOBAL_OVERVIEW';
  country: string;
  riverSystem: string;
  lat: number;
  lng: number;
  zoom: number;
  erosionRateM: number;
  charCount: number;
  saturationPct: number;
  status: 'CRITICAL' | 'WARNING' | 'MONITORING';
  scarpLengthKm: number;
  keyFeature: string;
  description: string;
}

export const RIVER_PRESETS: RiverPreset[] = [
  // --- BANGLADESH DELTA CORRIDORS ---
  {
    id: 'bangladesh_all',
    name: 'All Bangladesh Delta',
    regionCategory: 'BANGLADESH',
    country: 'Bangladesh',
    riverSystem: 'Brahmaputra-Padma-Meghna Basin',
    lat: 23.8500,
    lng: 90.1500,
    zoom: 7,
    erosionRateM: 280,
    charCount: 24,
    saturationPct: 44.5,
    status: 'WARNING',
    scarpLengthKm: 42.0,
    keyFeature: 'Synoptic Ganges-Brahmaputra-Meghna mega-delta network receiving Himalaya runoff.',
    description: 'Full synoptic overview of the world’s most dynamic braided river delta network.'
  },
  {
    id: 'jamuna_sirajganj',
    name: 'Sirajganj Sector · Jamuna River',
    regionCategory: 'BANGLADESH',
    country: 'Bangladesh',
    riverSystem: 'Jamuna River',
    lat: 24.4530,
    lng: 89.7020,
    zoom: 11,
    erosionRateM: 340,
    charCount: 8,
    saturationPct: 48.2,
    status: 'CRITICAL',
    scarpLengthKm: 14.5,
    keyFeature: 'Town Protection Hardpoint revetment experiencing severe bank-toe scour vortices.',
    description: 'High-energy braided corridor with rapid seasonal char turnover and embankment retreat.'
  },
  {
    id: 'jamuna_bahadurabad',
    name: 'Bahadurabad Reach · Upper Jamuna',
    regionCategory: 'BANGLADESH',
    country: 'Bangladesh',
    riverSystem: 'Upper Jamuna / Brahmaputra',
    lat: 25.1050,
    lng: 89.6700,
    zoom: 11,
    erosionRateM: 310,
    charCount: 12,
    saturationPct: 46.0,
    status: 'CRITICAL',
    scarpLengthKm: 18.2,
    keyFeature: 'Major braided channel bifurcation with intense seasonal sandbar accretion.',
    description: 'Monsoon discharge entry corridor experiencing severe multi-thread channel migration.'
  },
  {
    id: 'padma_shariatpur',
    name: 'Mawa & Shariatpur · Padma River',
    regionCategory: 'BANGLADESH',
    country: 'Bangladesh',
    riverSystem: 'Padma River',
    lat: 23.4420,
    lng: 90.2850,
    zoom: 11,
    erosionRateM: 210,
    charCount: 6,
    saturationPct: 41.8,
    status: 'WARNING',
    scarpLengthKm: 12.0,
    keyFeature: 'Downstream high-discharge meandering reach with large inhabited char complexes.',
    description: 'Alluvial migration corridor along the lower Padma river basin.'
  },
  {
    id: 'meghna_chandpur',
    name: 'Chandpur Estuary · Lower Meghna',
    regionCategory: 'BANGLADESH',
    country: 'Bangladesh',
    riverSystem: 'Lower Meghna',
    lat: 23.2320,
    lng: 90.6410,
    zoom: 11,
    erosionRateM: 190,
    charCount: 5,
    saturationPct: 39.4,
    status: 'MONITORING',
    scarpLengthKm: 9.8,
    keyFeature: 'Tidal confluence receiving combined discharge of Padma and Meghna into the Bay of Bengal.',
    description: 'Hydro-dynamic delta mouth with heavy sediment plumes and coastal char formation.'
  },
  {
    id: 'sundarbans_mangrove',
    name: 'Sundarbans Delta Front',
    regionCategory: 'BANGLADESH',
    country: 'Bangladesh / India',
    riverSystem: 'Ganges Deltaic Mangrove',
    lat: 21.8500,
    lng: 89.4500,
    zoom: 9,
    erosionRateM: 160,
    charCount: 32,
    saturationPct: 52.0,
    status: 'WARNING',
    scarpLengthKm: 35.0,
    keyFeature: 'World’s largest halophytic mangrove forest and coastal buffer against cyclone surges.',
    description: 'Dynamic tidal wetlands and coastal island erosion under sea level rise.'
  },
  {
    id: 'kurigram_chilmari',
    name: 'Kurigram & Chilmari · Brahmaputra Entry',
    regionCategory: 'BANGLADESH',
    country: 'Bangladesh',
    riverSystem: 'Brahmaputra Basin',
    lat: 25.6800,
    lng: 89.7200,
    zoom: 11,
    erosionRateM: 290,
    charCount: 14,
    saturationPct: 45.1,
    status: 'CRITICAL',
    scarpLengthKm: 16.4,
    keyFeature: 'Northern international border entry sector with extreme sediment braiding.',
    description: 'Multi-thread braided river system with emerging unstable char archipelagos.'
  },

  // --- AMERICAS MEGA-RIVERS & DELTAS ---
  {
    id: 'amazon_delta',
    name: 'Amazon River Mega Delta',
    regionCategory: 'AMERICAS',
    country: 'Brazil',
    riverSystem: 'Amazon River',
    lat: 0.0500,
    lng: -50.5000,
    zoom: 7,
    erosionRateM: 120,
    charCount: 45,
    saturationPct: 55.4,
    status: 'MONITORING',
    scarpLengthKm: 180.0,
    keyFeature: 'World’s largest river discharge (209,000 m³/s) forming a massive Atlantic sediment plume.',
    description: 'Equatorial mega-estuary with expansive fluvial islands and dynamic tidal bores (Pororoca).'
  },
  {
    id: 'mississippi_delta',
    name: 'Mississippi River Birdfoot Delta',
    regionCategory: 'AMERICAS',
    country: 'United States',
    riverSystem: 'Mississippi River',
    lat: 29.1500,
    lng: -89.2500,
    zoom: 9,
    erosionRateM: 95,
    charCount: 18,
    saturationPct: 49.0,
    status: 'CRITICAL',
    scarpLengthKm: 65.0,
    keyFeature: 'Rapid coastal wetland subsidence and sediment diversion projects in the Gulf of Mexico.',
    description: 'Classic birdfoot delta experiencing accelerated coastal land loss and barrier island erosion.'
  },
  {
    id: 'parana_rio_plata',
    name: 'Paraná River & Río de la Plata',
    regionCategory: 'AMERICAS',
    country: 'Argentina / Uruguay',
    riverSystem: 'Paraná / Uruguay Rivers',
    lat: -34.5000,
    lng: -58.2000,
    zoom: 8,
    erosionRateM: 70,
    charCount: 22,
    saturationPct: 43.1,
    status: 'MONITORING',
    scarpLengthKm: 52.0,
    keyFeature: 'Turbid funnel-shaped estuary with active prograding delta advancing into the bay.',
    description: 'South American mega-basin with extensive forested island archipelagos.'
  },

  // --- ASIA-PACIFIC MEGA-DELTAS ---
  {
    id: 'mekong_delta',
    name: 'Mekong River Delta',
    regionCategory: 'ASIA_PACIFIC',
    country: 'Vietnam / Cambodia',
    riverSystem: 'Mekong River (Cuu Long)',
    lat: 10.0500,
    lng: 105.8000,
    zoom: 8,
    erosionRateM: 180,
    charCount: 28,
    saturationPct: 51.2,
    status: 'CRITICAL',
    scarpLengthKm: 48.0,
    keyFeature: 'Severe sediment starvation from upstream dams, groundwater extraction, and coastal retreat.',
    description: 'Dense agricultural delta network sustaining 20+ million people under climate stress.'
  },
  {
    id: 'yellow_river_delta',
    name: 'Yellow River (Huang He) Delta',
    regionCategory: 'ASIA_PACIFIC',
    country: 'China',
    riverSystem: 'Yellow River (Huang He)',
    lat: 37.7500,
    lng: 119.2000,
    zoom: 9,
    erosionRateM: 220,
    charCount: 15,
    saturationPct: 47.8,
    status: 'WARNING',
    scarpLengthKm: 38.0,
    keyFeature: 'Historically the world’s highest sediment-concentration river with rapid delta lobe switching.',
    description: 'Bohai Sea progradation zone characterized by intensive sediment management.'
  },
  {
    id: 'yangtze_delta',
    name: 'Yangtze River (Chang Jiang) Delta',
    regionCategory: 'ASIA_PACIFIC',
    country: 'China',
    riverSystem: 'Yangtze River',
    lat: 31.5000,
    lng: 121.8000,
    zoom: 8,
    erosionRateM: 85,
    charCount: 19,
    saturationPct: 44.0,
    status: 'MONITORING',
    scarpLengthKm: 40.0,
    keyFeature: 'Mega-estuary featuring Chongming Island and Three Gorges regulated sediment outflows.',
    description: 'East China Sea outflow supporting China’s primary commercial economic corridor.'
  },
  {
    id: 'indus_delta',
    name: 'Indus River Delta',
    regionCategory: 'ASIA_PACIFIC',
    country: 'Pakistan',
    riverSystem: 'Indus River',
    lat: 24.1000,
    lng: 67.8000,
    zoom: 8,
    erosionRateM: 240,
    charCount: 16,
    saturationPct: 36.2,
    status: 'CRITICAL',
    scarpLengthKm: 55.0,
    keyFeature: 'Arid mega-delta suffering catastrophic freshwater & sediment deficit with seawater intrusion.',
    description: 'Arabian Sea coastal zone with mangrove degradation and delta shoreline retreat.'
  },
  {
    id: 'lena_arctic_delta',
    name: 'Lena River Arctic Delta',
    regionCategory: 'ASIA_PACIFIC',
    country: 'Russia (Siberia)',
    riverSystem: 'Lena River',
    lat: 72.8000,
    lng: 126.5000,
    zoom: 7,
    erosionRateM: 140,
    charCount: 50,
    saturationPct: 58.0,
    status: 'WARNING',
    scarpLengthKm: 90.0,
    keyFeature: 'Largest Arctic delta, experiencing rapid permafrost thaw degradation into Laptev Sea.',
    description: 'Pristine Arctic tundra wetlands with thousands of thermokarst lakes and braided islands.'
  },

  // --- AFRICA & EUROPE SYSTEMS ---
  {
    id: 'nile_delta',
    name: 'Nile River Delta & Rosetta',
    regionCategory: 'AFRICA_EUROPE',
    country: 'Egypt',
    riverSystem: 'Nile River',
    lat: 31.4000,
    lng: 30.8000,
    zoom: 8,
    erosionRateM: 130,
    charCount: 11,
    saturationPct: 38.5,
    status: 'CRITICAL',
    scarpLengthKm: 44.0,
    keyFeature: 'Aswan High Dam sediment trapping causing severe Mediterranean shoreline wave erosion.',
    description: 'Ancient arcuate delta corridor vulnerable to saline water encroachment and subsidence.'
  },
  {
    id: 'congo_river_basin',
    name: 'Congo River Estuary & Malebo Pool',
    regionCategory: 'AFRICA_EUROPE',
    country: 'DR Congo / Republic of Congo',
    riverSystem: 'Congo River',
    lat: -4.3000,
    lng: 15.3000,
    zoom: 8,
    erosionRateM: 90,
    charCount: 30,
    saturationPct: 53.0,
    status: 'MONITORING',
    scarpLengthKm: 60.0,
    keyFeature: 'World’s deepest river (>220m depth) cutting a vast submarine canyon into the Atlantic Ocean.',
    description: 'Equatorial mega-river system with huge lake-like braided channels (Pool Malebo).'
  },
  {
    id: 'danube_delta',
    name: 'Danube River Delta Biosphere',
    regionCategory: 'AFRICA_EUROPE',
    country: 'Romania / Ukraine',
    riverSystem: 'Danube River',
    lat: 45.2000,
    lng: 29.6000,
    zoom: 9,
    erosionRateM: 75,
    charCount: 20,
    saturationPct: 50.5,
    status: 'MONITORING',
    scarpLengthKm: 32.0,
    keyFeature: 'Europe’s best-preserved mega-wetland delta flowing into the Black Sea.',
    description: 'UNESCO Biosphere Reserve with active anastomosing channels and reed marsh islands.'
  }
];
