import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GIBS_LAYERS, GIBSLayerConfig, RIVER_PRESETS, RiverPreset } from '../config/gibsLayers';
import { NasaGibsService } from '../services/nasaGibsService';
import { useLiveRiverData } from '../hooks/useLiveRiverData';
import { RiverRegion } from '../types/charwatch';
import {
  Satellite,
  Radio,
  Layers,
  Calendar,
  Sliders,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  SplitSquareVertical,
  Columns,
  Info,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Waves,
  Cpu,
  Compass,
  Sparkles,
  Zap,
  Globe,
} from 'lucide-react';

interface NasaEarthObservatoryProps {
  onSelectRegionForAnalyst?: (region: RiverRegion) => void;
  compact?: boolean;
}

export const NasaEarthObservatory: React.FC<NasaEarthObservatoryProps> = ({
  onSelectRegionForAnalyst,
  compact = false,
}) => {
  const { stations } = useLiveRiverData();

  // Layer & Date State
  const [selectedLayerId, setSelectedLayerId] = useState<string>('modis-terra-truecolor');
  const [activeDate, setActiveDate] = useState<string>('2024-08-15');
  const [layerOpacity, setLayerOpacity] = useState<number>(0.92);
  const [isLayerVisible, setIsLayerVisible] = useState<boolean>(true);

  // Comparison State
  const [viewMode, setViewMode] = useState<'SINGLE' | 'SWIPE' | 'SIDE_BY_SIDE' | 'OPACITY_BLEND'>('SINGLE');
  const [beforeDate, setBeforeDate] = useState<string>('2022-08-15');
  const [afterDate, setAfterDate] = useState<string>('2024-08-15');
  const [swipePosition, setSwipePosition] = useState<number>(50);
  const [blendAlpha, setBlendAlpha] = useState<number>(0.5);

  // Global Presets & Filter Category
  const [activePresetId, setActivePresetId] = useState<string>('bangladesh_all');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BANGLADESH' | 'AMERICAS' | 'ASIA_PACIFIC' | 'AFRICA_EUROPE'>('ALL');

  // Overlay Toggles
  const [showBwdbGauges, setShowBwdbGauges] = useState<boolean>(true);
  const [showGlobalHotspots, setShowGlobalHotspots] = useState<boolean>(true);

  // Status & Modals
  const [isLoadingTiles, setIsLoadingTiles] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Map references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const gibsTileLayerRef = useRef<L.TileLayer | null>(null);
  const beforeGibsLayerRef = useRef<L.TileLayer | null>(null);
  const afterGibsLayerRef = useRef<L.TileLayer | null>(null);
  const gaugeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const hotspotLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Side-by-side second map ref
  const map2ContainerRef = useRef<HTMLDivElement>(null);
  const map2InstanceRef = useRef<L.Map | null>(null);
  const map2GibsLayerRef = useRef<L.TileLayer | null>(null);

  const currentLayer = useMemo(() => {
    return GIBS_LAYERS.find((l) => l.id === selectedLayerId) || GIBS_LAYERS[0];
  }, [selectedLayerId]);

  const currentPreset = useMemo(() => {
    return RIVER_PRESETS.find((p) => p.id === activePresetId) || RIVER_PRESETS[0];
  }, [activePresetId]);

  const filteredPresets = useMemo(() => {
    if (selectedCategory === 'ALL') return RIVER_PRESETS;
    return RIVER_PRESETS.filter((p) => p.regionCategory === selectedCategory);
  }, [selectedCategory]);

  // Fix Leaflet marker icons in Vite
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Initialize Primary Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.8500, 90.1500],
        zoom: 7,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // High-resolution Google Satellite Hybrid Basemap (Global Coverage)
      L.tileLayer('https://mt{s}.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Earth / NASA GIBS / RiverGuard Global',
      }).addTo(map);

      // Custom Zoom Control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Layer groups
      gaugeLayerGroupRef.current = L.layerGroup().addTo(map);
      hotspotLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
      map2InstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // View Mode Change: Invalidate Map Sizes
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
      map2InstanceRef.current?.invalidateSize();
    }, 120);
    return () => clearTimeout(timer);
  }, [viewMode]);

  // Update Single GIBS Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || viewMode !== 'SINGLE') return;

    if (gibsTileLayerRef.current) {
      map.removeLayer(gibsTileLayerRef.current);
      gibsTileLayerRef.current = null;
    }

    if (!isLayerVisible) return;

    setIsLoadingTiles(true);

    const tileUrl = NasaGibsService.getWmtsTileUrl(currentLayer, activeDate);

    const gibsLayer = L.tileLayer(tileUrl, {
      subdomains: ['a', 'b', 'c'],
      opacity: layerOpacity,
      maxZoom: currentLayer.maxZoom,
      minZoom: currentLayer.minZoom,
      crossOrigin: true,
      zIndex: 10,
    });

    gibsLayer.on('loading', () => setIsLoadingTiles(true));
    gibsLayer.on('load', () => setIsLoadingTiles(false));
    gibsLayer.on('tileerror', () => setIsLoadingTiles(false));

    gibsLayer.addTo(map);
    gibsTileLayerRef.current = gibsLayer;
  }, [currentLayer, activeDate, layerOpacity, isLayerVisible, viewMode]);

  // Update Swipe Comparison Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (viewMode === 'SWIPE') {
      if (gibsTileLayerRef.current) {
        map.removeLayer(gibsTileLayerRef.current);
        gibsTileLayerRef.current = null;
      }

      if (beforeGibsLayerRef.current) map.removeLayer(beforeGibsLayerRef.current);
      if (afterGibsLayerRef.current) map.removeLayer(afterGibsLayerRef.current);

      setIsLoadingTiles(true);

      const beforeUrl = NasaGibsService.getWmtsTileUrl(currentLayer, beforeDate);
      const afterUrl = NasaGibsService.getWmtsTileUrl(currentLayer, afterDate);

      const beforeLayer = L.tileLayer(beforeUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: currentLayer.maxZoom,
        minZoom: currentLayer.minZoom,
        crossOrigin: true,
        zIndex: 5,
        opacity: 1.0,
      }).addTo(map);

      const afterLayer = L.tileLayer(afterUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: currentLayer.maxZoom,
        minZoom: currentLayer.minZoom,
        crossOrigin: true,
        zIndex: 10,
        opacity: 1.0,
        className: 'leaflet-after-layer',
      }).addTo(map);

      afterLayer.on('load', () => setIsLoadingTiles(false));

      beforeGibsLayerRef.current = beforeLayer;
      afterGibsLayerRef.current = afterLayer;
    } else {
      if (beforeGibsLayerRef.current) {
        map.removeLayer(beforeGibsLayerRef.current);
        beforeGibsLayerRef.current = null;
      }
      if (afterGibsLayerRef.current) {
        map.removeLayer(afterGibsLayerRef.current);
        afterGibsLayerRef.current = null;
      }
    }
  }, [viewMode, currentLayer, beforeDate, afterDate]);

  // Apply CSS clip-path to after-layer for swipe effect
  useEffect(() => {
    if (viewMode !== 'SWIPE') return;
    const elements = document.querySelectorAll('.leaflet-after-layer');
    elements.forEach((el) => {
      (el as HTMLElement).style.clipPath = `polygon(${swipePosition}% 0, 100% 0, 100% 100%, ${swipePosition}% 100%)`;
    });
  }, [swipePosition, viewMode]);

  // Opacity Blend Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (viewMode === 'OPACITY_BLEND') {
      if (gibsTileLayerRef.current) {
        map.removeLayer(gibsTileLayerRef.current);
        gibsTileLayerRef.current = null;
      }
      if (beforeGibsLayerRef.current) map.removeLayer(beforeGibsLayerRef.current);
      if (afterGibsLayerRef.current) map.removeLayer(afterGibsLayerRef.current);

      const beforeUrl = NasaGibsService.getWmtsTileUrl(currentLayer, beforeDate);
      const afterUrl = NasaGibsService.getWmtsTileUrl(currentLayer, afterDate);

      const beforeLayer = L.tileLayer(beforeUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: currentLayer.maxZoom,
        minZoom: currentLayer.minZoom,
        crossOrigin: true,
        zIndex: 5,
        opacity: 1 - blendAlpha,
      }).addTo(map);

      const afterLayer = L.tileLayer(afterUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: currentLayer.maxZoom,
        minZoom: currentLayer.minZoom,
        crossOrigin: true,
        zIndex: 10,
        opacity: blendAlpha,
      }).addTo(map);

      beforeGibsLayerRef.current = beforeLayer;
      afterGibsLayerRef.current = afterLayer;
    }
  }, [viewMode, currentLayer, beforeDate, afterDate, blendAlpha]);

  // Side-by-Side Dual Map with Synchronized Viewports
  useEffect(() => {
    if (viewMode !== 'SIDE_BY_SIDE') {
      if (map2InstanceRef.current) {
        map2InstanceRef.current.remove();
        map2InstanceRef.current = null;
      }
      return;
    }

    if (!map2ContainerRef.current) return;

    const map1 = mapInstanceRef.current;
    if (!map1) return;

    const center1 = map1.getCenter();
    const safeCenter: [number, number] = (center1 && typeof center1.lat === 'number' && !isNaN(center1.lat) && typeof center1.lng === 'number' && !isNaN(center1.lng))
      ? [center1.lat, center1.lng]
      : [23.8500, 90.1500];
    const safeZoom = (typeof map1.getZoom() === 'number' && !isNaN(map1.getZoom())) ? map1.getZoom() : 7;

    const map2 = L.map(map2ContainerRef.current, {
      center: safeCenter,
      zoom: safeZoom,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://mt{s}.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
    }).addTo(map2);

    const afterUrl = NasaGibsService.getWmtsTileUrl(currentLayer, afterDate);
    const map2Layer = L.tileLayer(afterUrl, {
      subdomains: ['a', 'b', 'c'],
      maxZoom: currentLayer.maxZoom,
      minZoom: currentLayer.minZoom,
      crossOrigin: true,
      opacity: 1.0,
    }).addTo(map2);

    map2GibsLayerRef.current = map2Layer;
    map2InstanceRef.current = map2;

    const syncMap1To2 = () => {
      const c = map1.getCenter();
      const z = map1.getZoom();
      if (c && typeof c.lat === 'number' && !isNaN(c.lat) && typeof c.lng === 'number' && !isNaN(c.lng) && typeof z === 'number' && !isNaN(z)) {
        map2.setView([c.lat, c.lng], z, { animate: false });
      }
    };
    const syncMap2To1 = () => {
      const c = map2.getCenter();
      const z = map2.getZoom();
      if (c && typeof c.lat === 'number' && !isNaN(c.lat) && typeof c.lng === 'number' && !isNaN(c.lng) && typeof z === 'number' && !isNaN(z)) {
        map1.setView([c.lat, c.lng], z, { animate: false });
      }
    };

    map1.on('move', syncMap1To2);
    map2.on('move', syncMap2To1);

    setTimeout(() => {
      map1.invalidateSize();
      map2.invalidateSize();
    }, 120);

    return () => {
      map1.off('move', syncMap1To2);
      map2.off('move', syncMap2To1);
    };
  }, [viewMode, currentLayer, afterDate]);

  // Render High-Tech Blinking / Pulsing Hotspots Across the Entire World
  useEffect(() => {
    const group = hotspotLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();
    if (!showGlobalHotspots) return;

    RIVER_PRESETS.forEach((preset) => {
      if (!preset || typeof preset.lat !== 'number' || isNaN(preset.lat) || typeof preset.lng !== 'number' || isNaN(preset.lng)) return;

      const isCurrent = activePresetId === preset.id;
      const isCritical = preset.status === 'CRITICAL';
      const isWarning = preset.status === 'WARNING';

      // Professional pulsating radar beacon styling
      const pingColor = isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-cyan-400';
      const coreColor = isCritical ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-cyan-500';
      const glowColor = isCritical ? 'rgba(244,63,94,0.9)' : isWarning ? 'rgba(245,158,11,0.9)' : 'rgba(6,182,212,0.9)';

      const html = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
          <!-- Blinking / Pulsing Outer Radar Ring -->
          <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full ${pingColor} opacity-75"></span>
          
          <!-- Secondary Echo Ring for Critical or Active Selection -->
          ${isCritical || isCurrent ? `<span class="absolute inline-flex h-6 w-6 animate-pulse rounded-full ${pingColor} opacity-40"></span>` : ''}

          <!-- Glowing Solid Core with High-Tech Border -->
          <span class="relative inline-flex items-center justify-center ${isCurrent ? 'h-5 w-5' : 'h-3.5 w-3.5'} rounded-full ${coreColor} border-2 border-white shadow-[0_0_12px_${glowColor}] transition-transform duration-300 group-hover:scale-125">
            ${isCurrent ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : ''}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-pulsing-hotspot',
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([preset.lat, preset.lng], { icon: customIcon });

      const tooltipClass = isCritical 
        ? 'hotspot-hover-tooltip critical-tooltip' 
        : isWarning 
        ? 'hotspot-hover-tooltip warning-tooltip' 
        : 'hotspot-hover-tooltip';

      const detailsHtml = `
        <div style="font-family: monospace; font-size: 11px; color: #f1f5f9; padding: 10px 12px; border-radius: 12px; min-width: 250px; max-width: 320px; line-height: 1.4;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 5px;">
            <div>
              <div style="color: ${isCritical ? '#fb7185' : isWarning ? '#fbbf24' : '#38bdf8'}; font-size: 12px; font-weight: bold;">${preset.name}</div>
              <div style="color: #94a3b8; font-size: 10px;">${preset.country} · ${preset.riverSystem}</div>
            </div>
            <span style="background: ${isCritical ? 'rgba(244,63,94,0.25)' : isWarning ? 'rgba(245,158,11,0.25)' : 'rgba(6,182,212,0.25)'}; color: ${isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#38bdf8'}; padding: 2px 6px; border-radius: 4px; font-size: 8px; font-weight: bold; border: 1px solid currentColor; white-space: nowrap;">
              ${preset.status}
            </span>
          </div>

          <div style="background: rgba(15, 23, 42, 0.9); padding: 6px 8px; border-radius: 8px; border: 1px solid #1e293b; margin: 6px 0; font-size: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">Annual Retreat / Shift:</span>
              <strong style="color: #f43f5e;">-${preset.erosionRateM} m/yr</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">Active Char / Islands:</span>
              <strong style="color: #10b981;">${preset.charCount} Islands</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Soil Saturation:</span>
              <strong style="color: #38bdf8;">${preset.saturationPct}%</strong>
            </div>
          </div>

          <p style="font-size: 10px; color: #cbd5e1; margin: 0 0 6px 0;">
            ${preset.keyFeature}
          </p>

          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 5px; font-size: 9px; color: #64748b; display: flex; align-items: center; justify-content: space-between;">
            <span>*Sector Identification</span>
            <span style="color: #38bdf8;">Click to lock camera</span>
          </div>
        </div>
      `;

      // Bind instant hover tooltip
      marker.bindTooltip(detailsHtml, {
        direction: 'top',
        offset: [0, -18],
        className: tooltipClass,
        opacity: 1,
        sticky: false
      });

      // Bind persistent popup on click
      marker.bindPopup(detailsHtml);

      // On hover, update active preset and show tooltip
      marker.on('mouseover', () => {
        setActivePresetId(preset.id);
        marker.openTooltip();
      });

      // On click, smooth fly camera to this hotspot
      marker.on('click', () => {
        handleSelectPreset(preset);
      });

      group.addLayer(marker);
    });
  }, [showGlobalHotspots, activePresetId]);

  // Render BWDB Gauges on Map
  useEffect(() => {
    const group = gaugeLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();
    if (!showBwdbGauges || !Array.isArray(stations) || stations.length === 0) return;

    stations.forEach((station) => {
      if (!station || typeof station.lat !== 'number' || isNaN(station.lat) || typeof station.lng !== 'number' || isNaN(station.lng)) return;

      const isDanger = station.status === 'DANGER' || station.status === 'SEVERE';
      const isWarning = station.status === 'WARNING';
      const diffM = (typeof station.currentWaterLevelM === 'number' && typeof station.dangerLevelM === 'number') 
        ? station.currentWaterLevelM - station.dangerLevelM 
        : 0;

      const color = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#06b6d4';

      const marker = L.circleMarker([station.lat, station.lng], {
        radius: isDanger ? 8 : 6,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.85,
      });

      const gaugeHtml = `
        <div style="font-family: monospace; font-size: 11px; color: #f1f5f9; background: #030712; padding: 8px 10px; border-radius: 10px; border: 1px solid ${color}; min-width: 210px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #38bdf8; font-size: 12px;">${station.name}</strong>
            <span style="color: ${isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}; font-size: 9px; font-weight: bold; background: rgba(255,255,255,0.06); padding: 1px 4px; border-radius: 3px;">
              ${station.status}
            </span>
          </div>
          <span style="color: #94a3b8; font-size: 10px;">River: ${station.riverSystem} · ${station.district}</span><br/>
          <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #1e293b;">
            <span style="color: #94a3b8;">Water Stage:</span> <strong style="color: #ffffff;">${typeof station.currentWaterLevelM === 'number' ? station.currentWaterLevelM.toFixed(2) : '--'} m PWD</strong><br/>
            <span style="color: #94a3b8;">Danger Level:</span> ${typeof station.dangerLevelM === 'number' ? station.dangerLevelM.toFixed(2) : '--'} m<br/>
            <span style="color: ${isDanger ? '#ef4444' : '#10b981'}; font-weight: bold;">
              ${diffM >= 0 ? `+${(diffM * 100).toFixed(0)} cm ABOVE DANGER` : `${(diffM * 100).toFixed(0)} cm below DL`}
            </span>
          </div>
        </div>
      `;

      marker.bindTooltip(gaugeHtml, {
        direction: 'top',
        offset: [0, -8],
        className: 'hotspot-hover-tooltip',
        opacity: 1,
      });

      marker.bindPopup(gaugeHtml);

      marker.on('mouseover', () => {
        marker.openTooltip();
      });

      group.addLayer(marker);
    });
  }, [stations, showBwdbGauges]);

  // Handle Preset View Navigation
  const handleSelectPreset = (preset: RiverPreset) => {
    setActivePresetId(preset.id);
    if (preset && typeof preset.lat === 'number' && !isNaN(preset.lat) && typeof preset.lng === 'number' && !isNaN(preset.lng) && mapInstanceRef.current) {
      const zoomLevel = typeof preset.zoom === 'number' && !isNaN(preset.zoom) ? preset.zoom : 7;
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], zoomLevel, {
        duration: 1.4,
      });
    }
  };

  const handleSwipeDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSwipePosition(percent);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans">
      
      {/* 1. OBSERVATORY HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-6 glass-panel rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '15s' }} />
            <span>GLOBAL EARTH OBSERVATION & RIVER OBSERVATORY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-brand-hero text-white tracking-tight">
            NASA EARTH OBSERVATORY
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed font-sans">
            Real NASA GIBS satellite imagery, radar InSAR vectors, and interactive blinking hotspots monitoring mega-rivers and critical delta basins worldwide.
          </p>
        </div>

        {/* Action Controls Header */}
        <div className="flex flex-wrap items-center gap-2 z-10">
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all active:scale-95"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>LAYER METADATA</span>
          </button>

          <a
            href="https://wiki.earthdata.nasa.gov/display/GIBS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-xs font-mono transition-all"
          >
            <span>NASA GIBS DOCS</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* 2. MAP CONTROL DECK & LAYER TOOLBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Layer Selector & View Modes (Col 8) */}
        <div className="lg:col-span-8 p-3.5 glass-panel rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
          
          {/* Active Layer Dropdown */}
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              SATELLITE IMAGERY LAYER:
            </span>
            <select
              value={selectedLayerId}
              onChange={(e) => setSelectedLayerId(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              {GIBS_LAYERS.map((layer) => (
                <option key={layer.id} value={layer.id}>
                  {layer.title} ({layer.typeBadge})
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              VIEW MODE:
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('SINGLE')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'SINGLE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Standard Single Layer Exploration"
              >
                SINGLE
              </button>
              <button
                onClick={() => setViewMode('SWIPE')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'SWIPE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Interactive Swipe Comparison"
              >
                <SplitSquareVertical className="w-3 h-3" />
                <span>SWIPE</span>
              </button>
              <button
                onClick={() => setViewMode('SIDE_BY_SIDE')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'SIDE_BY_SIDE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Dual Synchronized Map Comparison"
              >
                <Columns className="w-3 h-3" />
                <span>SIDE-BY-SIDE</span>
              </button>
              <button
                onClick={() => setViewMode('OPACITY_BLEND')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'OPACITY_BLEND' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Opacity Blend Comparison"
              >
                <Sliders className="w-3 h-3" />
                <span>BLEND</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Continent & Basin Selector (Col 4) */}
        <div className="lg:col-span-4 p-3.5 glass-panel rounded-2xl border border-slate-800 flex flex-col justify-between text-xs font-mono">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            GLOBAL REGION FILTERS:
          </span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {[
              { id: 'ALL', label: 'WORLD ALL' },
              { id: 'BANGLADESH', label: 'BANGLADESH' },
              { id: 'AMERICAS', label: 'AMERICAS' },
              { id: 'ASIA_PACIFIC', label: 'ASIA-PACIFIC' },
              { id: 'AFRICA_EUROPE', label: 'AFRICA / EU' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2 py-0.5 rounded text-[9px] transition-all font-mono ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GLOBAL HOTSPOTS PRESET CAROUSEL STRIP */}
      <div className="p-3 glass-panel rounded-2xl border border-slate-800 space-y-1.5 text-xs font-mono">
        <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>GLOBAL RIVER DELTA & EROSION HOTSPOTS ({filteredPresets.length}):</span>
          </div>
          <span className="text-slate-500">CLICK TO FLY CAMERA</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredPresets.map((preset) => {
            const isSelected = activePresetId === preset.id;
            const isCrit = preset.status === 'CRITICAL';
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isCrit ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'}`} />
                <span>{preset.name}</span>
                <span className="text-[9px] text-slate-500">({preset.country})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TIME CONTROLS & COMPARISON BAR */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs font-mono">
        
        {/* Single Date Selector */}
        {viewMode === 'SINGLE' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">OBSERVATION DATE:</span>
              <input
                type="date"
                value={activeDate}
                min={currentLayer.minDate || '2000-01-01'}
                max="2024-12-31"
                onChange={(e) => setActiveDate(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Quick Year/Season Presets */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-slate-500">PRESETS:</span>
              <button
                onClick={() => setActiveDate('2024-08-15')}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-400"
              >
                2024 Monsoon
              </button>
              <button
                onClick={() => setActiveDate('2024-01-15')}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-400"
              >
                2024 Dry
              </button>
              <button
                onClick={() => setActiveDate('2023-08-15')}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-400"
              >
                2023 Monsoon
              </button>
              <button
                onClick={() => setActiveDate('2022-08-15')}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-400"
              >
                2022 Peak
              </button>
              <button
                onClick={() => setActiveDate('2020-08-15')}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-400"
              >
                2020 Baseline
              </button>
            </div>
          </div>
        )}

        {/* Dual Date Selector for Comparison Modes */}
        {viewMode !== 'SINGLE' && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                BEFORE (LEFT)
              </span>
              <input
                type="date"
                value={beforeDate}
                onChange={(e) => setBeforeDate(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <span className="text-slate-600 font-bold">VS</span>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                AFTER (RIGHT)
              </span>
              <input
                type="date"
                value={afterDate}
                onChange={(e) => setAfterDate(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Opacity Slider / Blend Slider */}
        <div className="flex items-center gap-3">
          {viewMode === 'SINGLE' && (
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px]">OPACITY:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="text-cyan-300 text-[11px] font-bold">
                {Math.round(layerOpacity * 100)}%
              </span>
            </div>
          )}

          {viewMode === 'OPACITY_BLEND' && (
            <div className="flex items-center gap-2">
              <span className="text-rose-300 text-[10px]">BEFORE</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={blendAlpha}
                onChange={(e) => setBlendAlpha(parseFloat(e.target.value))}
                className="w-32 accent-cyan-400 cursor-pointer"
              />
              <span className="text-emerald-300 text-[10px]">AFTER</span>
            </div>
          )}

          {/* Toggle Layer Visibility */}
          <button
            onClick={() => setIsLayerVisible(!isLayerVisible)}
            className={`p-1.5 rounded-lg border transition-all ${
              isLayerVisible
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Imagery Layer Visibility"
          >
            {isLayerVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 5. MAIN MAP CANVAS AREA */}
      <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl bg-[#02050c]">
        
        {/* Loading Indicator */}
        {isLoadingTiles && (
          <div className="absolute top-4 left-4 z-[500] px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-2 shadow-lg backdrop-blur-md">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>FETCHING SATELLITE TILES...</span>
          </div>
        )}

        {/* View Mode: SINGLE, SWIPE, OPACITY BLEND */}
        <div
          className={`w-full h-full relative ${viewMode === 'SIDE_BY_SIDE' ? 'hidden' : 'block'}`}
          onMouseMove={(e) => viewMode === 'SWIPE' && e.buttons === 1 && handleSwipeDrag(e)}
          onTouchMove={(e) => viewMode === 'SWIPE' && handleSwipeDrag(e)}
        >
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Swipe Divider Drag Handle */}
          {viewMode === 'SWIPE' && (
            <div
              style={{ left: `${swipePosition}%` }}
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-[400] cursor-ew-resize flex items-center justify-center pointer-events-auto"
              onMouseDown={(e) => handleSwipeDrag(e)}
              onTouchStart={(e) => handleSwipeDrag(e)}
            >
              <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-xl">
                <SplitSquareVertical className="w-4 h-4" />
              </div>
              
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[9px] font-mono border border-emerald-500/40 pointer-events-none whitespace-nowrap">
                AFTER: {afterDate}
              </div>
              <div className="absolute top-3 left-3 -translate-x-full px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 text-[9px] font-mono border border-rose-500/40 pointer-events-none whitespace-nowrap">
                BEFORE: {beforeDate}
              </div>
            </div>
          )}
        </div>

        {/* View Mode: SIDE-BY-SIDE (Dual Panes with non-zero grid heights) */}
        {viewMode === 'SIDE_BY_SIDE' && (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-1 bg-slate-900">
            <div className="relative w-full h-[260px] md:h-full">
              <div className="absolute top-3 left-3 z-[400] px-2.5 py-1 rounded-xl bg-slate-950/90 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                BEFORE: {beforeDate}
              </div>
              <div ref={mapContainerRef} className="w-full h-full" />
            </div>

            <div className="relative w-full h-[260px] md:h-full">
              <div className="absolute top-3 left-3 z-[400] px-2.5 py-1 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                AFTER: {afterDate}
              </div>
              <div ref={map2ContainerRef} className="w-full h-full" />
            </div>
          </div>
        )}

        {/* Floating Sector Telemetry HUD Card (Top-Right) */}
        <div className="absolute top-4 right-4 z-[400] max-w-xs p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-xs font-mono backdrop-blur-md shadow-2xl space-y-1.5 pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-[11px] truncate">{currentPreset.name}</span>
            <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
              currentPreset.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {currentPreset.status}
            </span>
          </div>
          <div className="text-[10px] text-slate-400">
            {currentPreset.country} · {currentPreset.riverSystem}
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <div>
              <span className="text-slate-500 block">Retreat / Shift:</span>
              <strong className="text-rose-400">-{currentPreset.erosionRateM} m/yr</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Active Islands:</span>
              <strong className="text-emerald-400">{currentPreset.charCount} Chars</strong>
            </div>
          </div>
        </div>

        {/* Floating Contextual Overlays Control Pill (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-[400] p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono backdrop-blur-md space-y-1.5 shadow-2xl">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-1">
            CONTEXTUAL OVERLAYS:
          </div>

          <label className="flex items-center gap-2 px-2 py-0.5 rounded-lg hover:bg-slate-900 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showGlobalHotspots}
              onChange={(e) => setShowGlobalHotspots(e.target.checked)}
              className="rounded accent-cyan-400"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Pulsing Hotspots ({RIVER_PRESETS.length} Global)</span>
            </span>
          </label>

          <label className="flex items-center gap-2 px-2 py-0.5 rounded-lg hover:bg-slate-900 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showBwdbGauges}
              onChange={(e) => setShowBwdbGauges(e.target.checked)}
              className="rounded accent-teal-400"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>BWDB Gauges ({stations.length})</span>
            </span>
          </label>
        </div>

        {/* Floating NASA GIBS Source Watermark (Bottom-Right) */}
        <div className="absolute bottom-4 right-4 z-[400] px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-[10px] font-mono text-slate-400 backdrop-blur-md shadow-2xl flex items-center gap-2">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>Imagery: <strong>NASA GIBS / Google Satellite</strong></span>
          <a
            href="https://gibs.earthdata.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-white"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 6. CURRENT LAYER SCIENTIFIC PROVENANCE CARD */}
      <div className="p-4 sm:p-5 glass-panel-cyan rounded-2xl border border-cyan-500/30 text-xs font-mono space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-sm">ACTIVE LAYER SCIENTIFIC PROVENANCE</span>
            <span className="px-2 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              {currentLayer.typeBadge}
            </span>
          </div>

          <span className="text-[10px] text-slate-400">
            OBSERVATION: <strong className="text-white">{viewMode === 'SINGLE' ? activeDate : `${beforeDate} → ${afterDate}`}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px]">SENSOR / SATELLITE:</span>
            <strong className="text-white">{currentLayer.sensor} · {currentLayer.satellite}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">SPATIAL RESOLUTION:</span>
            <strong className="text-cyan-300">{currentLayer.spatialResolution}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">IMAGERY TYPE:</span>
            <strong className="text-teal-300">
              OPTICAL / SURFACE REFLECTANCE
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">DATA PROVIDER:</span>
            <strong className="text-slate-200">{currentLayer.agency}</strong>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1">
          <strong>Scientific Role:</strong> {currentLayer.scientificRole}
        </p>
      </div>

      {/* 7. MODAL: DETAILED LAYER METADATA INSPECTOR */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full glass-panel-cyan rounded-3xl border border-cyan-500/50 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Satellite className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-display">
                  {currentLayer.title}
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono text-slate-300">
              <p className="font-sans leading-relaxed">{currentLayer.description}</p>
              
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">GIBS Identifier:</span>
                  <span className="text-cyan-300 select-all">{currentLayer.layerIdentifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Format & MatrixSet:</span>
                  <span className="text-white">{currentLayer.format.toUpperCase()} · {currentLayer.tileMatrixSet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Projection:</span>
                  <span className="text-white">EPSG:3857 (Web Mercator)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Temporal Range:</span>
                  <span className="text-white">{currentLayer.minDate || '2000-01-01'} to Present</span>
                </div>
              </div>

              <div>
                <strong className="text-white block mb-1">Visual Interpretation Guide:</strong>
                <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
                  {currentLayer.interpretationGuide}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs uppercase"
              >
                CLOSE INSPECTOR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
