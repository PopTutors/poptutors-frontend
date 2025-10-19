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

export default function SalesChart({ sales, stat }: { sales?: any; stat?: string }) {
  // use sales.chartData if present, else fallback to static design data
  const chartData =
    sales && Array.isArray(sales.chartData) && sales.chartData.length ? sales.chartData : FALLBACK_DATA;

  // normalize totals (support both sales and sales.data shape)
  const totalRevenue = Number(sales?.totalRevenue ?? sales?.data?.totalRevenue ?? 0);
  const totalProfit = Number(sales?.totalProfit ?? sales?.data?.totalProfit ?? 0);
  const growthRate = Number(sales?.growthRate ?? sales?.data?.growthRate ?? 0);

  // map many possible stat values to the label used in the data
  const statKey = typeof stat === 'string' ? stat.trim().toLowerCase() : '';
  const labelMap: Record<string, string> = {
    assignment: 'Assignment',
    assignemnet: 'Assignment', // common typo from user
    assignments: 'Assignment',
    session: 'Sessions',
    sessions: 'Sessions',
    livehelp: 'Live Help',
    live_help: 'Live Help',
    'live-help': 'Live Help',
    'live help': 'Live Help',
  };

  const mappedLabel = labelMap[statKey] ?? null;

  // filtered data — if mappedLabel is null, show all
  const filteredData = mappedLabel
    ? chartData.filter((d: any) => String(d.label).toLowerCase().trim() === mappedLabel.toLowerCase().trim())
    : chartData;

  // NEW: check if there is any non-zero value among the visible items
  const hasNonZero = filteredData.some((d: any) => Number(d.base) !== 0 && Number(d.extra) !== 0);

  const chartTitle = mappedLabel ? `${mappedLabel} — Sales & Profit` : 'Sales & Profit';

  return (
    <div className="bg-white p-6 flex-1">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-mentoos-text-primary mb-2">{chartTitle}</h2>
          <p className="text-sm text-mentoos-text-primary/60">Projections vs Actuals</p>
        </div>
      </div>

      {/* If there is no data (either filtered out, or all zeros) show placeholder */}
      {filteredData.length === 0 || !hasNonZero ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-sm text-gray-500">
            No data available{stat ? <> for <span className="font-medium text-gray-700">{stat}</span></> : ''}.
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 50, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(var(--mentoos-text-primary))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--mentoos-text-primary))' }} domain={[0, 250]} />
            <Tooltip
              content={<CustomTooltip totals={{ totalRevenue, totalProfit, growthRate }} />}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />

            {/* Base solid bar */}
            <Bar dataKey="base" stackId="a" barSize={94}>
              {filteredData.map((entry: any, index: number) => (
                <Cell key={`cell-base-${index}`} fill={entry.baseClass} />
              ))}
            </Bar>

            <Bar dataKey="extra" stackId="a" radius={[6, 6, 0, 0]} barSize={94}>
              {filteredData.map((entry: any, index: number) => (
                <Cell key={`cell-extra-${index}`} fill={entry.extraClass} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
