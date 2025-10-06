import React from 'react';

export type RequestItem = {
  _id: string;
  type: string; // 'assignment' | 'liveHelp' | 'session' | etc.
  title: string;
  description?: string;
  subject?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  deadline?: string; // optional deadline field
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
};

interface RequestCardsProps {
  items?: RequestItem[];
  onViewAll?: () => void;
}

/** Keep the visual markup exactly the same — only badge text is dynamic */
interface RequestCardProps {
  title: string;
  price: string;
  date: string;
  deadline: string;
  status: string;
  subject: string;
  badgeLabel: string;
}
function getBadgeClasses(label?: string) {
  if (!label) {
    return "px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-full";
  }
  const key = label.toLowerCase().replace(/\s+/g, "");
  if (key.includes("assign")) {
    // assignment -> red
    return "px-2.5 py-1.5 bg-red-50 border border-red-500 text-red-600 text-xs font-medium rounded-full";
  }
  if (key.includes("session")) {
    // session -> green
    return "px-2.5 py-1.5 bg-green-50 border border-green-500 text-green-600 text-xs font-medium rounded-full";
  }
  if (key.includes("livehelp") || key.includes("live-help") || key.includes("livehelp")) {
    // liveHelp -> yellow
    return "px-2.5 py-1.5 bg-yellow-50 border border-yellow-400 text-yellow-700 text-xs font-medium rounded-full";
  }
  // default
  return "px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-full";
}

function RequestCard({
  title,
  price,
  date,
  deadline,
  status,
  subject,
  badgeLabel,
}: RequestCardProps) {
  return (
    <div className="bg-white border border-black/10 p-6 flex flex-col gap-4 shadow-md hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-mentoos-text-primary line-clamp-1 mb-1.5">
            {title}
          </h3>
          <div className="flex items-center gap-1.5">
            <span className={getBadgeClasses(badgeLabel)}>
              {badgeLabel}
            </span>
            <span className="text-mentoos-text-primary/70 text-sm">•</span>
            <span className="text-sm font-semibold text-mentoos-primary">{price}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/10" />

      {/* Details */}
      <div className="flex flex-col gap-4">
        {/* First Row */}
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{date}</div>
            <div className="text-sm text-mentoos-text-secondary">Date</div>
          </div>
          <div className="w-px h-9 bg-black/10" />
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{status}</div>
            <div className="text-sm text-mentoos-text-secondary">Status</div>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{deadline}</div>
            <div className="text-sm text-mentoos-text-secondary">Deadline</div>
          </div>
          <div className="w-px h-9 bg-black/10" />
          <div className="flex-1">
            <div className="text-sm font-medium text-mentoos-text-primary mb-2">{subject}</div>
            <div className="text-sm text-mentoos-text-secondary">Subject</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Parent component — accepts items prop from API */
export default function RequestCards({ items = [], onViewAll }: RequestCardsProps) {
  // fallback demo data (kept from your original file)
  const fallbackRequests = [
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
      badgeLabel: 'Assignment',
      key: 'f1',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: 'TBD',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
      badgeLabel: 'Live Help',
      key: 'f2',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
      badgeLabel: 'Assignment',
      key: 'f3',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
      badgeLabel: 'Assignment',
      key: 'f4',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: '$50',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
      badgeLabel: 'Session',
      key: 'f5',
    },
    {
      title: 'Social Media Course Social Media Course',
      price: 'TBD',
      date: '25/5/2024',
      deadline: '25/5/2024',
      status: 'Finding expert',
      subject: 'Computer science',
      badgeLabel: 'Live Help',
      key: 'f6',
    },
  ];

  // helper to convert raw `type` string into a friendly badge label
  const typeToBadge = (type?: string) => {
    if (!type) return 'Request';
    const normalized = String(type).toLowerCase();
    if (normalized === 'assignment') return 'Assignment';
    if (normalized === 'livehelp' || normalized === 'livehelp' || normalized === 'live_help') return 'Live Help';
    if (normalized === 'session' || normalized === 'sessions') return 'Session';
    // fallback: capitalize first letter
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  // relative time formatter (returns strings like "3 days ago", "2 hours ago", "in 4 days")
  const formatRelative = (dateLike?: string | Date | null) => {
    if (!dateLike) return 'N/A';
    const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
    if (Number.isNaN(date.getTime())) return 'N/A';

    const now = new Date();
    const diffMs = date.getTime() - now.getTime(); // future positive, past negative
    const diffSec = Math.round(diffMs / 1000);

    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    const units: [number, Intl.RelativeTimeFormatUnit][] = [
      [60, 'second'],
      [60, 'minute'],
      [24, 'hour'],
      [7, 'day'],
      [4.34524, 'week'], // avg weeks per month
      [12, 'month'],
      [Number.POSITIVE_INFINITY, 'year'],
    ];

    let abs = Math.abs(diffSec);
    let value: number;
    let unit: Intl.RelativeTimeFormatUnit = 'second';

    // seconds -> minutes -> hours -> days -> weeks -> months -> years
    for (let i = 0, acc = abs; i < units.length; i++) {
      const [threshold, unitName] = units[i];
      if (i === 0) {
        // seconds handled here
        if (abs < 10) return 'just now';
        if (abs < 60) {
          value = diffSec;
          unit = 'second';
          return rtf.format(Math.round(value), unit);
        }
        acc = Math.round(abs / threshold);
      } else {
        const prevProduct = units.slice(0, i).reduce((p, c) => p * c[0], 1);
        const nextThreshold = units[i][0];
        const converted = Math.round(diffSec / prevProduct);

        // decide if this unit makes sense
        const approx = Math.abs(converted);
        if (approx < nextThreshold || i === units.length - 1) {
          value = converted;
          // map unitName ('minute'|'hour'|'day'|...) typed as Intl.RelativeTimeFormatUnit
          unit = unitName as Intl.RelativeTimeFormatUnit;
          return rtf.format(value, unit);
        }
      }
    }

    // fallback
    return date.toLocaleString();
  };

  // map incoming API items to card props (with safe fallbacks)
  const mappedRequests =
    items && items.length
      ? items.map((it) => {
        const createdAt = it.createdAt ? new Date(it.createdAt) : undefined;
        const date = formatRelative(createdAt ?? undefined);
        const deadline = it.deadline ? formatRelative(new Date(it.deadline)) : 'N/A';
        const price = typeof it.amount === 'number' && it.amount > 0 ? `$${it.amount}` : 'TBD';
        const title = it.title ?? it.type ?? 'Untitled request';
        const status = it.status ?? 'Unknown';
        const subject = it.subject ?? (it.type === 'liveHelp' ? 'Live Help' : 'General');
        const badgeLabel = typeToBadge(it.type);

        return {
          key: it._id ?? Math.random().toString(36).slice(2, 9),
          title,
          price,
          date,
          deadline,
          status,
          subject,
          badgeLabel,
        };
      })
      : fallbackRequests;

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-inter text-[#141414] font-semibold">New Requests</h2>
        <button
          onClick={() => onViewAll?.()}
          className="text-xl text-mentoos-text-primary hover:text-mentoos-primary transition-colors"
        >
          View all
        </button>
      </div>

      {/* Grid of Request Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mappedRequests.map((request) => (
          <RequestCard
            key={request.key}
            title={request.title}
            price={request.price}
            date={request.date}
            deadline={request.deadline}
            status={request.status}
            subject={request.subject}
            badgeLabel={request.badgeLabel}
          />
        ))}
      </div>
    </div>
  );
}
