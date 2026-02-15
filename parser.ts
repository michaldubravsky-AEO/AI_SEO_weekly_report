
import { ClinicData, RawMetricRow } from '../types';

/**
 * Parses CSV text and returns an array of ClinicData.
 * It detects new clinic blocks by looking for rows containing "week".
 */
export const parseClinicCSV = (csvText: string, sourceName?: string): ClinicData[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const clinics: ClinicData[] = [];
  let currentClinic: Partial<ClinicData> | null = null;
  let clinicCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cells = line.split(',').map(c => c.trim());

    // A row is a header if it contains "week" in any cell beyond the first 3
    const isHeader = cells.slice(3).some(c => c.toLowerCase().includes('week'));
    
    if (isHeader) {
      // Finalize previous clinic before starting new one
      if (currentClinic && currentClinic.metrics && currentClinic.metrics.length > 0) {
        finalizeClinic(currentClinic as ClinicData, clinics);
      }

      // Clinic name is in the first cell of the header row
      const name = cells[0] || (sourceName ? (clinics.length === 0 ? sourceName : `${sourceName} - Block ${clinics.length + 1}`) : `Clinic ${clinicCounter++}`);
      const weekLabels = cells.slice(3).filter(w => w !== '');

      currentClinic = {
        name,
        weeks: weekLabels,
        metrics: [],
        latestWeekIdx: -1,
        prevWeekIdx: -1
      };
    } else if (currentClinic && cells.length >= 4) {
      // Data row parsing: Nested Metrics logic
      // Col 0: Metric Name, Col 1: Platform, Col 2: Tool
      const values = cells.slice(3).map(v => {
        const parsed = parseFloat(v);
        return isNaN(parsed) ? null : parsed;
      });

      // Skip rows that are completely empty
      if (cells[0] === '' && cells[1] === '' && cells[2] === '') continue;

      currentClinic.metrics?.push({
        primaryMetric: cells[0],
        platform: cells[1],
        tool: cells[2],
        values
      });
    }
  }

  // Finalize the last clinic in the file
  if (currentClinic && currentClinic.metrics && currentClinic.metrics.length > 0) {
    finalizeClinic(currentClinic as ClinicData, clinics);
  }

  return clinics;
};

const finalizeClinic = (data: ClinicData, list: ClinicData[]) => {
  let latestIdx = -1;
  let prevIdx = -1;

  // Scan backwards to find the most recent columns with data
  for (let col = data.weeks.length - 1; col >= 0; col--) {
    const hasData = data.metrics.some(m => m.values[col] !== null && m.values[col] !== undefined);
    if (hasData) {
      if (latestIdx === -1) {
        latestIdx = col;
      } else if (prevIdx === -1) {
        prevIdx = col;
        break;
      }
    }
  }

  data.latestWeekIdx = latestIdx;
  data.prevWeekIdx = prevIdx;
  list.push(data);
};

export const getMetricValue = (
  metrics: RawMetricRow[], 
  primary: string, 
  platform: string = '', 
  tool: string = 'semrush',
  idx: number
): number | null => {
  const metric = metrics.find(m => 
    m.primaryMetric.toLowerCase() === primary.toLowerCase() && 
    (m.platform.toLowerCase() === platform.toLowerCase() || (platform === '' && m.platform === '')) &&
    m.tool.toLowerCase() === tool.toLowerCase()
  );
  if (!metric || idx < 0 || idx >= metric.values.length) return null;
  return metric.values[idx];
};

export const calculateTrend = (current: number | null, previous: number | null): number => {
  if (current === null || previous === null || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};
