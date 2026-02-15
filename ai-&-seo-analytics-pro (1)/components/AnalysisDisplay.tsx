
import React from 'react';
import { AnalysisSummary } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Info, Lightbulb } from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: AnalysisSummary;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const isTrendPositive = analysis.healthTrend >= 0;
  const aiTrend = analysis.aiVisTrend;
  const isAiTrendPositive = aiTrend > 0;
  const isAiTrendNegative = aiTrend < 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">{analysis.clinicName} Weekly Summary</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
          analysis.isTechnicalFlag ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {analysis.isTechnicalFlag ? (
            <>
              <AlertCircle size={14} /> Technical Review Required
            </>
          ) : (
            <>
              <CheckCircle2 size={14} /> Healthy Performance
            </>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Overall Health</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">{analysis.overallHealth.toFixed(1)}</span>
              <div className={`flex items-center gap-1 mb-1 font-medium ${isTrendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isTrendPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span>{analysis.healthTrend.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500">AI Visibility Pulse</p>
              {(isAiTrendPositive || isAiTrendNegative) && (
                <div className={`flex items-center gap-0.5 text-xs font-bold ${isAiTrendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isAiTrendPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{Math.abs(aiTrend).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2">
              <Info className="mt-1 flex-shrink-0 text-indigo-500" size={18} />
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                {analysis.aiVisibilityPulse}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1 bg-indigo-500 rounded-full"></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Key Trend</p>
              <p className="text-slate-800 font-medium">{analysis.keyTrend}</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <Lightbulb className="text-indigo-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">Recommendation</p>
              <p className="text-indigo-900 font-semibold">{analysis.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
