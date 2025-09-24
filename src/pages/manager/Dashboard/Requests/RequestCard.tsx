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
function RequestCard({ title, price, date, deadline, status, subject, badgeLabel }: RequestCardProps) {
  return (
    <div className="bg-white border border-black/10 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-mentoos-text-primary line-clamp-1 mb-1.5">
            {title}
          </h3>
          <div className="flex items-center gap-1.5">
            {/* Dynamic badge text only — preserving original styling classes */}
            <span className="px-2.5 py-1.5 bg-mentoos-status-danger/5 border border-mentoos-status-danger text-mentoos-status-danger text-xs font-medium rounded-full">
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
    if (normalized === 'livehelp' || normalized === 'liveHelp' || normalized === 'live_help') return 'Live Help';
    if (normalized === 'session' || normalized === 'sessions') return 'Session';
    // fallback: capitalize first letter
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  // map incoming API items to card props (with safe fallbacks)
  const mappedRequests =
    items && items.length
      ? items.map((it) => {
          const createdAt = it.createdAt ? new Date(it.createdAt) : undefined;
          const date = createdAt ? createdAt.toLocaleDateString() : 'N/A';
          const deadline = it['deadline'] ? new Date(it['deadline']).toLocaleDateString() : 'N/A';
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
        <h2 className="text-xl font-semibold text-mentoos-text-primary">New Requests</h2>
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
