
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComparisonData } from '../types';

interface ComparisonChartProps {
  data: ComparisonData[];
  title: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
      <h3 className="text-lg font-bold text-slate-800 mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="semrushValue" name="Semrush" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ahrefsValue" name="Ahrefs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
