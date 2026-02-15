
import React, { useState, useEffect, useMemo } from 'react';
import { parseClinicCSV, getMetricValue } from './utils/parser';
import { analyzeClinic } from './utils/analyzer';
import { ClinicData } from './types';
import ComparisonChart from './components/ComparisonChart';
import TrendChart from './components/TrendChart';
import MiniSummaryChart from './components/MiniSummaryChart';
import { Activity, BrainCircuit, LayoutDashboard, ChevronDown, BarChart3, Target, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from 'recharts';

// Cleaned enterprise data precisely matching the 15 CSV blocks provided in the prompt
const CLINIC_PORTFOLIO_DATA = `Fertility Madrid,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,82,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,87,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
Mentions,Google AI Overview,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
Pages,Google AI Overview,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
Mentions,Chat GPT,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
Pages,Chat GPT,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,6,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,3,,,,,,,,,,,,,,,,,,,,,,,
FIV Valencia,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,87,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,80,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,24.26,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,14,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,22,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,21,,,,,,,,,,,,,,,,,,,,,,,
Institut Marquez,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,60,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,78,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,26.55,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,14,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,2,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,28,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,85,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,46,,,,,,,,,,,,,,,,,,,,,,,
CRGH,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,84,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,83,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,28.06,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,21,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,20,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,48,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,166,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,73,,,,,,,,,,,,,,,,,,,,,,,
BCRM,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,83,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,82,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,9.68,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,2,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,16,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,6,,,,,,,,,,,,,,,,,,,,,,,
Repromed,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,81,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,72,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,57.79,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,31,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,80,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,159,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,71,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,47,,,,,,,,,,,,,,,,,,,,,,,
Ovumia,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,72,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,83,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,71.03,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,28,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,63,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,92,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,82,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,49,,,,,,,,,,,,,,,,,,,,,,,
Nijclinics,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,87,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,92,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,18,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,7,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,0,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,0,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,0,,,,,,,,,,,,,,,,,,,,,,,
Gennet,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,81,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,74,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,24.23,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,30,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,109,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,191,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,128,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,39,,,,,,,,,,,,,,,,,,,,,,,
Reprofit,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,84,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,81,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,27.94,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,28,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,166,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,136,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,126,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,38,,,,,,,,,,,,,,,,,,,,,,,
IVF Clinic,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,74,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,81,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,45.89,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,15,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,25,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,102,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,67,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,32,,,,,,,,,,,,,,,,,,,,,,,
Iscare,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,96,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,74,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,16.74,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,35,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,170,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,71,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,261,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,52,,,,,,,,,,,,,,,,,,,,,,,
Sanus,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,93,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,90,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,0.85,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,27,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,232,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,564,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,146,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,79,,,,,,,,,,,,,,,,,,,,,,,
Gynera,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,94,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,89,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,28.08,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,29,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,335,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,518,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,632,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,98,,,,,,,,,,,,,,,,,,,,,,,
Gynatal,,,week 6,week 7,week 8,week 9,week 10,week 11,week 12,week 13,week 14,week 15,week 16,week 17,week 18,week 19,week 20,week 21,week 22,week 23,week 24,week 25,week 26,week 27,week 28,week 29
Site Health,,Semrush,91,,,,,,,,,,,,,,,,,,,,,,,
AI Search Health,,Semrush,84,,,,,,,,,,,,,,,,,,,,,,,
Position Tracking,,Semrush,37.38,,,,,,,,,,,,,,,,,,,,,,,
AI Visibility,,Semrush,37,,,,,,,,,,,,,,,,,,,,,,,
AI Mentions,total,Semrush,278,,,,,,,,,,,,,,,,,,,,,,,
AI Cited Pages,total,Semrush,225,,,,,,,,,,,,,,,,,,,,,,,
Mentions,total,Ahrefs,696,,,,,,,,,,,,,,,,,,,,,,,
Pages,total,Ahrefs,44,,,,,,,,,,,,,,,,,,,,,,,`;

function App() {
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [selectedClinicIdx, setSelectedClinicIdx] = useState<number>(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('total');

  // Initialize with the hardcoded data immediately
  useEffect(() => {
    const parsed = parseClinicCSV(CLINIC_PORTFOLIO_DATA);
    setClinics(parsed);
  }, []);

  const currentClinic = clinics[selectedClinicIdx] || null;
  const analysis = useMemo(() => currentClinic ? analyzeClinic(currentClinic) : null, [currentClinic]);

  const platforms = useMemo(() => {
    if (!currentClinic) return [];
    const unique = new Set<string>();
    currentClinic.metrics.forEach(m => {
      if (m.platform && m.platform.trim() !== '') {
        unique.add(m.platform);
      }
    });
    // Ensure "total" is always available for a high-level overview
    unique.add('total');
    return Array.from(unique);
  }, [currentClinic]);

  const trendData = useMemo(() => {
    if (!currentClinic || !selectedPlatform) return [];
    return currentClinic.weeks.map((week, idx) => ({
      week,
      mentionsSR: getMetricValue(currentClinic.metrics, 'Mentions', selectedPlatform, 'semrush', idx) || 
                 getMetricValue(currentClinic.metrics, 'AI Mentions', selectedPlatform, 'semrush', idx),
      mentionsAH: getMetricValue(currentClinic.metrics, 'Mentions', selectedPlatform, 'ahrefs', idx),
      pagesSR: getMetricValue(currentClinic.metrics, 'Pages', selectedPlatform, 'semrush', idx) ||
               getMetricValue(currentClinic.metrics, 'AI Cited Pages', selectedPlatform, 'semrush', idx),
      pagesAH: getMetricValue(currentClinic.metrics, 'Pages', selectedPlatform, 'ahrefs', idx),
    }));
  }, [currentClinic, selectedPlatform]);

  const siteHealthHistory = useMemo(() => {
    if (!currentClinic) return [];
    return currentClinic.weeks
      .map((_, idx) => ({ value: getMetricValue(currentClinic.metrics, 'Site Health', '', 'semrush', idx) }))
      .filter(v => v.value !== null);
  }, [currentClinic]);

  const aiHealthHistory = useMemo(() => {
    if (!currentClinic) return [];
    return currentClinic.weeks
      .map((_, idx) => ({ value: getMetricValue(currentClinic.metrics, 'AI Search Health', '', 'semrush', idx) }))
      .filter(v => v.value !== null);
  }, [currentClinic]);

  const totalComparisonData = useMemo(() => {
    if (!currentClinic) return [];
    const idx = currentClinic.latestWeekIdx;
    return [
      {
        category: 'Mentions',
        semrush: getMetricValue(currentClinic.metrics, 'AI Mentions', 'total', 'semrush', idx) || 
                 getMetricValue(currentClinic.metrics, 'Mentions', 'total', 'semrush', idx) || 0,
        ahrefs: getMetricValue(currentClinic.metrics, 'Mentions', 'total', 'ahrefs', idx) || 0,
      },
      {
        category: 'Pages',
        semrush: getMetricValue(currentClinic.metrics, 'AI Cited Pages', 'total', 'semrush', idx) || 
                 getMetricValue(currentClinic.metrics, 'Pages', 'total', 'semrush', idx) || 0,
        ahrefs: getMetricValue(currentClinic.metrics, 'Pages', 'total', 'ahrefs', idx) || 0,
      }
    ];
  }, [currentClinic]);

  const comparisonData = useMemo(() => {
    if (!currentClinic) return [];
    const idx = currentClinic.latestWeekIdx;
    return [
      {
        label: 'Mentions (SR vs AH)',
        semrushValue: (getMetricValue(currentClinic.metrics, 'Mentions', selectedPlatform, 'semrush', idx) || 
                      getMetricValue(currentClinic.metrics, 'AI Mentions', selectedPlatform, 'semrush', idx)) || 0,
        ahrefsValue: getMetricValue(currentClinic.metrics, 'Mentions', selectedPlatform, 'ahrefs', idx) || 0
      },
      {
        label: 'Pages (SR vs AH)',
        semrushValue: (getMetricValue(currentClinic.metrics, 'Pages', selectedPlatform, 'semrush', idx) ||
                      getMetricValue(currentClinic.metrics, 'AI Cited Pages', selectedPlatform, 'semrush', idx)) || 0,
        ahrefsValue: getMetricValue(currentClinic.metrics, 'Pages', selectedPlatform, 'ahrefs', idx) || 0
      }
    ];
  }, [currentClinic, selectedPlatform]);

  if (clinics.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BrainCircuit className="w-12 h-12 text-indigo-600 mx-auto animate-pulse" />
          <p className="mt-4 text-slate-600 font-medium">Initializing Clinical Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-100">
                <BrainCircuit size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI SEO Analytics Pro</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-indigo-600">Enterprise Asset Audit</p>
              </div>
            </div>

            <div className="relative group flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tight hidden lg:block">Brand:</span>
              <div className="relative">
                <select
                  value={selectedClinicIdx}
                  onChange={(e) => setSelectedClinicIdx(parseInt(e.target.value))}
                  className="appearance-none bg-slate-100 border border-slate-200 text-slate-800 py-1.5 pl-4 pr-10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer hover:bg-white"
                >
                  {clinics.map((c, i) => (
                    <option key={i} value={i}>{c.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Source</span>
                <span className="text-xs font-bold text-slate-900">Synchronized Portfolio</span>
             </div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analysis && (
            <>
              <StatCard 
                icon={<Activity className="text-indigo-600" />} 
                label="Site Health" 
                value={`${analysis.overallHealth.toFixed(1)}%`} 
                trend={analysis.healthTrend} 
                sparklineData={siteHealthHistory}
                sparklineColor="#6366f1"
              />
              <StatCard 
                icon={<ShieldCheck className="text-emerald-600" />} 
                label="AI Search Health" 
                value={`${(getMetricValue(currentClinic!.metrics, 'AI Search Health', '', 'semrush', currentClinic!.latestWeekIdx) || 0).toFixed(1)}%`} 
                sparklineData={aiHealthHistory}
                sparklineColor="#10b981"
              />
              <StatCard 
                icon={<Target className="text-amber-600" />} 
                label="AI Visibility" 
                value={`${(getMetricValue(currentClinic!.metrics, 'AI Visibility', '', 'semrush', currentClinic!.latestWeekIdx) || 0).toFixed(1)}%`} 
                trend={analysis.aiVisTrend}
                sparklineColor="#f59e0b"
              />
              <StatCard 
                icon={<BarChart3 className="text-purple-600" />} 
                label="Position Tracking" 
                value={(getMetricValue(currentClinic!.metrics, 'Position Tracking', '', 'semrush', currentClinic!.latestWeekIdx) || 0).toFixed(2)} 
                sparklineColor="#a855f7"
              />
            </>
          )}
        </div>

        {/* Pulse & Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8">
            <MiniSummaryChart 
                data={totalComparisonData} 
                title={`Aggregated Citation Pulse: ${currentClinic?.name}`} 
              />
          </div>
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Audit Insights</h3>
            <p className="text-sm text-slate-500 mb-4">Portfolio Analysis: <span className="text-indigo-600 font-bold">15 Permanent Clinical Assets</span> verified.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-xs font-bold text-slate-500 uppercase">Verification</span>
                <span className="text-xs font-bold text-slate-700">SR/AH Verified</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-xs font-bold text-slate-500 uppercase">Sync Status</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  100% Integrity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        {platforms.length > 0 && (
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 mb-8 overflow-x-auto no-scrollbar">
            {platforms.sort((a,b) => a === 'total' ? -1 : 1).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedPlatform === p 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="text-indigo-500" size={24} />
                Visibility Breakdown
              </h2>
            </div>
            
            <TrendChart data={trendData} platformName={selectedPlatform === 'total' ? 'Aggregate AI' : selectedPlatform} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Platform Delta</h2>
            
            <ComparisonChart 
              title={`Source Disparity: ${selectedPlatform.toUpperCase()}`} 
              data={comparisonData} 
            />
            
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-indigo-400" />
                Data Integrity Note
              </h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-slate-700 flex-shrink-0">1</div>
                  <p>All values are hardcoded directly from the provided <span className="text-white font-medium">CSV snippets</span>.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-slate-700 flex-shrink-0">2</div>
                  <p>Comparing <span className="text-white font-medium">Semrush vs Ahrefs</span> highlights gaps in entity recognition.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: number;
  sparklineData?: { value: number | null }[];
  sparklineColor?: string;
}

function StatCard({ icon, label, value, trend, sparklineData, sparklineColor = "#6366f1" }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md h-full min-h-[160px] flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        {trend !== undefined && trend !== 0 && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full mt-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-16 w-full mt-3 -mx-4">
            <ResponsiveContainer width="110%" height="100%">
              <LineChart data={sparklineData} margin={{ left: -30, right: 0, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <YAxis hide={true} domain={[0, 100]} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={sparklineColor} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
