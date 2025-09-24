'use client';
import React from 'react';
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

const FALLBACK_DATA = [
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

// Custom Tooltip — identical markup / classes to your design, values wired to `totals` prop
function CustomTooltip({ active, payload, coordinate, totals }: any) {
  if (active && payload && payload.length) {
    const totalRevenue = totals?.totalRevenue ?? 0;
    const totalProfit = totals?.totalProfit ?? 0;
    const growthRate = totals?.growthRate ?? 0;

    return (
      <div
        style={{
          position: 'absolute',
          left: coordinate?.x,
          top: (coordinate?.y ?? 0) - 40,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
        className="w-[210px] h-[22px] inline-flex items-center gap-2 px-3 py-1.5 border border-black/10 bg-white rounded-full text-xs shadow-md"
      >
        <span className="text-mentoos-text-primary text-[10px] font-medium">Total ${totalRevenue}</span>
        <span className="text-mentoos-text-primary/50 text-[10px]">Profit ${totalProfit}</span>
        <div className="w-px h-2.5 bg-black/10" />
        <div className="flex items-center gap-1">
          <span className="text-mentoos-green font-medium text-[10px]">{growthRate}%</span>
          <TrendingUp className="w-3 h-3 text-mentoos-green" />
        </div>
      </div>
    );
  }
  return null;
}

export default function SalesChart({ sales }: { sales?: any }) {
  // use sales.chartData if present, else fallback to static design data
  const chartData =
    sales && Array.isArray(sales.chartData) && sales.chartData.length ? sales.chartData : FALLBACK_DATA;

  // normalize totals (support both sales and sales.data shape)
  const totalRevenue = Number(sales?.totalRevenue ?? sales?.data?.totalRevenue ?? 0);
  const totalProfit = Number(sales?.totalProfit ?? sales?.data?.totalProfit ?? 0);
  const growthRate = Number(sales?.growthRate ?? sales?.data?.growthRate ?? 0);

  return (
    <div className="bg-white border border-black/10 p-6 flex-1">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-mentoos-text-primary mb-2">Sales & Profit</h2>
          <p className="text-sm text-mentoos-text-primary/60">Projections vs Actuals</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 50, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(var(--mentoos-text-primary))' }} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--mentoos-text-primary))' }} domain={[0, 250]} />
          <Tooltip
            content={<CustomTooltip totals={{ totalRevenue, totalProfit, growthRate }} />}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />

          {/* Base solid bar */}
          <Bar dataKey="base" stackId="a" barSize={94}>
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-base-${index}`} fill={entry.baseClass} />
            ))}
          </Bar>

          <Bar dataKey="extra" stackId="a" radius={[6, 6, 0, 0]} barSize={94}>
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-extra-${index}`} fill={entry.extraClass} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
