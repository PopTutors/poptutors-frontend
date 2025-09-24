'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  {
    label: 'Assignment',
    base: 113,
    extra: 200 - 113,
    baseClass: 'var(--mentoos-blue)',
    extraClass: 'var(--mentoos-blue-light)',
  },
  {
    label: 'Live Help',
    base: 113,
    extra: 132 - 113,
    baseClass: 'var(--mentoos-pink)',
    extraClass: 'var(--mentoos-pink-light)',
  },
  {
    label: 'Sessions',
    base: 113,
    extra: 143 - 113,
    baseClass: 'var(--mentoos-orange)',
    extraClass: 'var(--mentoos-orange-light)',
  },
];

// Custom Tooltip
function CustomTooltip({ active, payload, coordinate }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          position: 'absolute',
          left: coordinate.x,
          top: coordinate.y - 40, // move above the bar
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
        className="w-[210px] h-[22px] inline-flex items-center gap-2 px-3 py-1.5 border border-black/10 bg-white rounded-full text-xs shadow-md"
      >
        <span className="text-mentoos-text-primary text-[10px] font-medium">Total $3000</span>
        <span className="text-mentoos-text-primary/50 text-[10px]">Profit $300</span>
        <div className="w-px h-2.5 bg-black/10" />
        <div className="flex items-center gap-1">
          <span className="text-mentoos-green font-medium text-[10px]">30%</span>
          <TrendingUp className="w-3 h-3 text-mentoos-green" />
        </div>
      </div>
    );
  }
  return null;
}

export default function SalesChart() {
  return (
    <div className="bg-white border border-black/10 p-6 flex-1">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-mentoos-text-primary mb-2">Sales & Profit</h2>
          <p className="text-sm text-mentoos-text-primary/60">Projections vs Actuals</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 50, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: 'hsl(var(--mentoos-text-primary))' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: 'hsl(var(--mentoos-text-primary))' }}
            domain={[0, 250]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />

          {/* Base solid bar */}
          <Bar dataKey="base" stackId="a" barSize={94}>
            {data.map((entry, index) => (
              <Cell key={`cell-base-${index}`} fill={entry.baseClass} />
            ))}
          </Bar>

          <Bar dataKey="extra" stackId="a" radius={[6, 6, 0, 0]} barSize={94}>
            {data.map((entry, index) => (
              <Cell key={`cell-extra-${index}`} fill={entry.extraClass} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
