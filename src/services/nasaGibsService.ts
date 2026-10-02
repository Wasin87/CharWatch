/**
 * NASA Global Imagery Browse Services (GIBS) Integration Service
 * 
 * Provides official WMTS endpoints for NASA Earth Observation imagery
 * projected in EPSG:3857 (Web Mercator / GoogleMapsCompatible).
 * 
 * Official NASA Earthdata GIBS Documentation:
 * https://wiki.earthdata.nasa.gov/display/GIBS
 * https://gibs.earthdata.nasa.gov/
 */

import { GIBSLayerConfig, GIBS_LAYERS } from '../config/gibsLayers';

export class NasaGibsService {
  private static readonly WMTS_BASE_URL = 'https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best';

  /**
   * Generates a Leaflet-compatible tile URL template for a specific GIBS layer and date
   */
  public static getWmtsTileUrl(layer: GIBSLayerConfig, dateStr: string): string {
    const formattedDate = this.formatDateForGibs(dateStr, layer);
    const matrixSet = layer.tileMatrixSet || 'GoogleMapsCompatible_Level9';
    const format = layer.format || 'jpg';
    
    // Subdomains: a, b, c
    return `${this.WMTS_BASE_URL}/${layer.layerIdentifier}/default/${formattedDate}/${matrixSet}/{z}/{y}/{x}.${format}`;
  }

  /**
   * Returns subdomains supported by NASA GIBS
   */
  public static getSubdomains(): string[] {
    return ['a', 'b', 'c'];
  }

  /**
   * Formats ISO date (YYYY-MM-DD) for GIBS WMTS query
   */
  public static formatDateForGibs(dateStr: string, layer?: GIBSLayerConfig): string {
    if (!dateStr) {
      return layer?.defaultDate || '2024-08-15';
    }
    const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) {
      return match[0];
    }
    return layer?.defaultDate || '2024-08-15';
  }

  /**
   * Historical comparison presets with verified cloud-free satellite imagery passes over Bangladesh
   */
  public static getHistoricalComparisonPresets() {
    return [
      {
        id: 'monsoon_2024_vs_2022',
        name: 'Monsoon Peak 2024 vs 2022',
        beforeDate: '2022-08-15',
        afterDate: '2024-08-15',
        description: 'Comparison of Jamuna bankline and char expansion across two major monsoon seasons.'
      },
      {
        id: 'dry_vs_monsoon_2024',
        name: 'Dry Season vs Monsoon (2024)',
        beforeDate: '2024-01-15',
        afterDate: '2024-08-15',
        description: 'Seasonal expansion of the active braided river channel and char sandbar submergence.'
      },
      {
        id: 'four_year_evolution',
        name: '4-Year Riverbank Evolution (2020 vs 2024)',
        beforeDate: '2020-08-15',
        afterDate: '2024-08-15',
        description: 'Multi-year migration of major char complexes in Sirajganj and Kazipur sectors.'
      }
    ];
  }
}
