import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';
import DataGrid from '../../../../components/ui/DataGrid';
import { JobIcon, ReceiptIcon } from '../../../../assets/managers';

// Transaction type
export type TransactionType = {
  id: string;
  dateTime: string;
  payment: string;
  paymentType: string;
  amount: string;
  status: 'Completed' | 'Failed' | 'Pending' | 'Refunded';
  amountType: 'positive' | 'negative';
};

type Category = 'All' | 'Student Payment' | 'Teacher Payment' | 'Refund' | 'Referral';

function StatusBadge({ status }: { status: TransactionType['status'] }) {
  const getStatusStyles = (status: TransactionType['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-mentoos-status-success/5 border-mentoos-status-success text-mentoos-status-success';
      case 'Failed':
        return 'bg-mentoos-status-danger/5 border-mentoos-status-danger text-mentoos-status-danger';
      case 'Pending':
        return 'bg-mentoos-status-warning/5 border-mentoos-status-warning text-mentoos-status-warning';
      case 'Refunded':
        return 'bg-mentoos-primary/5 border-mentoos-primary text-mentoos-primary';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };
  return <span className={`inline-flex items-center px-4 py-2 border rounded-full text-sm font-medium ${getStatusStyles(status)}`}>{status}</span>;
}

export default function Transactions({ payments }: { payments?: any }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState < Category > ('All');

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // menu open state: id of row which has a menu open (or null)
  const [openMenuFor, setOpenMenuFor] = useState < string | null > (null);

  // portal menu position (on mobile we'll use bottom sheet style)
  const [menuPos, setMenuPos] = useState < { top?: number; left?: number; bottom?: number } | null > (null);
  // reference map of buttons so we can position the portal
  const buttonsRef = useRef < Record < string, HTMLButtonElement | null >> ({});

  // outside click (use pointerdown to avoid click race)
  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (!target) return;

      // if clicking outside action button/menu, close menu
      if (!target.closest('[data-action-menu-portal]') && !target.closest('[data-action-button]')) {
        setOpenMenuFor(null);
        setMenuPos(null);
      }

      // close category dropdown if outside
      if (!target.closest('[data-category-filter]')) {
        setCategoryDropdownOpen(false);
      }
    }

    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, []);

  // toggle menu; compute portal position when opening
  const handleActionToggle = (rowId: string) => {
    setOpenMenuFor((prev) => {
      const next = prev === rowId ? null : rowId;
      if (next) {
        const btn = buttonsRef.current[rowId];
        // on small screens use bottom sheet
        if (window.innerWidth < 640) {
          setMenuPos({ bottom: 8, left: 8 });
        } else if (btn) {
          const rect = btn.getBoundingClientRect();
          // desired width ~185 (same as your menu), place to keep it in viewport
          const menuWidth = 185 + 16; // some slack
          let left = rect.right - menuWidth + 16; // align right edge of menu with button
          // clamp
          left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
          const top = rect.bottom + 8; // 8px gap beneath button
          setMenuPos({ top: Math.round(top), left: Math.round(left) });
        } else {
          setMenuPos(null);
        }
      } else {
        setMenuPos(null);
      }
      return next;
    });
  };

  const handleViewReceipt = (row: TransactionType) => {
    alert(`View receipt for ${row.id}`);
    setOpenMenuFor(null);
    setMenuPos(null);
  };

  const handleViewJob = (row: TransactionType) => {
    alert(`View job for ${row.id}`);
    setOpenMenuFor(null);
    setMenuPos(null);
  };

  // Map Payments API -> TransactionType (same mapping you had)
  const apiRows: TransactionType[] = useMemo(() => {
    let items: any[] = [];
    if (!payments) items = [];
    else if (Array.isArray(payments)) items = payments;
    else if (Array.isArray(payments.items)) items = payments.items;
    else if (Array.isArray(payments.data?.items)) items = payments.data.items;
    else if (Array.isArray(payments.data)) items = payments.data;
    else {
      items = payments.items ?? payments.data?.items ?? payments.data ?? [];
      if (!Array.isArray(items)) items = [];
    }

    const fmtDate = (d?: string | Date) => {
      if (!d) return 'N/A';
      try {
        const dObj = typeof d === 'string' ? new Date(d) : d;
        // short format: on mobile we'll show relative if needed; keep this safe & simple here
        return dObj.toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      } catch {
        return String(d);
      }
    };

    const mapStatus = (s?: string) => {
      const st = (s ?? '').toString().toLowerCase();
      if (st === 'paid') return 'Completed';
      if (st === 'failed') return 'Failed';
      if (st === 'refunded') return 'Refunded';
      if (st === 'created') return 'Pending';
      return 'Pending';
    };

    return items.map((p: any, idx: number) => {
      const id = p.paymentRefId ?? p._id ?? `tx-${idx}-${Date.now()}`;
      const paymentDate = p.date ?? p.paymentDate ?? p.createdAt ?? p.dateTime ?? null;
      const dateTime = fmtDate(paymentDate);
      const paymentLabel =
        (p.user && typeof p.user === 'object' && (p.user.name || p.user.email))
          ? (p.user.name ?? p.user.email)
          : (p.payerName ?? p.payer ?? p.metadata?.payerName ?? 'Student');

      let paymentType = 'Payment';
      if (p.status === 'refunded' || (p.status && p.status.toLowerCase() === 'refunded')) paymentType = 'Refund';
      else if (p.itemType && (p.itemType.toLowerCase() === 'referral' || p.itemType.toLowerCase() === 'referrals')) paymentType = 'Referral';
      else if (p.metadata?.paymentType) paymentType = p.metadata.paymentType;

      const rawAmount = p.amount ?? 0;
      const isPositive = p.status === 'paid';
      const amountStr = `${isPositive ? '+' : '-'}${rawAmount}`;

      const status = mapStatus(p.status);
      const amountType: TransactionType['amountType'] = isPositive ? 'positive' : 'negative';

      return {
        id,
        dateTime,
        payment: paymentLabel,
        paymentType,
        amount: amountStr,
        status,
        amountType,
      } as TransactionType;
    });
  }, [payments]);

  const rowsToUse = apiRows.length ? apiRows : [
    { id: '#10001', dateTime: '02 Jan, 2025 – 10:45 AM', payment: 'Student', paymentType: 'Refund', amount: '- $50', status: 'Completed', amountType: 'negative' },
    { id: '#10002', dateTime: '05 Jan, 2025 – 04:22 PM', payment: 'Teacher', paymentType: 'Payment', amount: '- $550', status: 'Failed', amountType: 'negative' },
    { id: '#10003', dateTime: '07 Jan, 2025 – 09:10 AM', payment: 'Student', paymentType: 'Payment', amount: '+ $75', status: 'Failed', amountType: 'positive' },
    { id: '#10004', dateTime: '09 Jan, 2025 – 11:59 PM', payment: 'Student', paymentType: 'Payment', amount: '+ $757', status: 'Pending', amountType: 'positive' },
    { id: '#10005', dateTime: '12 Jan, 2025 – 01:30 PM', payment: 'Student', paymentType: 'Referral', amount: '- $60', status: 'Failed', amountType: 'negative' },
    { id: '#10006', dateTime: '15 Jan, 2025 – 06:05 PM', payment: 'Teacher', paymentType: 'Payment', amount: '- $90', status: 'Refunded', amountType: 'negative' },
    { id: '#10007', dateTime: '18 Jan, 2025 – 08:20 AM', payment: 'Student', paymentType: 'Payment', amount: '+ $117', status: 'Refunded', amountType: 'positive' },
  ];

  const matchesCategory = (t: TransactionType, cat: Category) => {
    if (cat === 'All') return true;
    if (cat === 'Student Payment') return t.paymentType === 'Payment' && t.payment.toLowerCase().includes('student');
    if (cat === 'Teacher Payment') return t.paymentType === 'Payment' && t.payment.toLowerCase().includes('teacher');
    if (cat === 'Refund') return t.paymentType === 'Refund';
    if (cat === 'Referral') return t.paymentType === 'Referral';
    return true;
  };

  const counts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const c: Record<Category, number> = { 'All': 0, 'Student Payment': 0, 'Teacher Payment': 0, 'Refund': 0, 'Referral': 0 };
    rowsToUse.forEach((t) => {
      if (q && !Object.values(t).join(' ').toLowerCase().includes(q)) return;
      c.All++;
      if (t.paymentType === 'Payment' && t.payment.toLowerCase().includes('student')) c['Student Payment']++;
      if (t.paymentType === 'Payment' && t.payment.toLowerCase().includes('teacher')) c['Teacher Payment']++;
      if (t.paymentType === 'Refund') c['Refund']++;
      if (t.paymentType === 'Referral') c['Referral']++;
    });
    return c;
  }, [search, rowsToUse]);

  // columns
  const columns: Column<TransactionType>[] = useMemo(() => [
    { key: 'id', label: 'Job ID', width: 120 },
    { key: 'dateTime', label: 'Date & Time', width: 220 },
    { key: 'payment', label: 'Payment', width: 160 },
    { key: 'paymentType', label: 'Payment Type', width: 180 },
    {
      key: 'amount',
      label: 'Amount',
      width: 140,
      render: (r: TransactionType) => (
        <span className={`${r.amountType === 'positive' ? 'text-mentoos-status-success' : 'text-mentoos-status-danger'} whitespace-nowrap`}>
          {r.amount}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 180,
      render: (r: TransactionType) => <StatusBadge status={r.status} />,
    },
    {
      key: 'action',
      label: 'Action',
      // give a bit more room for the icon + hit area
      width: 56,
      align: 'center',
      render: (r: TransactionType) => (
        <div className="relative inline-block">
          <button
            data-action-button
            // explicit typing for the ref callback to satisfy TS
            ref={(el: HTMLButtonElement | null) => {
              buttonsRef.current[r.id] = el;
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleActionToggle(r.id);
            }}
            className="p-1 hover:bg-gray-50 rounded transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-mentoos-text-primary" />
          </button>
          {/* Note: menu is rendered via portal below */}
        </div>
      ),
    },
  ], [handleActionToggle]); // include handler in deps


  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rowsToUse.filter((t) => {
      if (q && !Object.values(t).join(' ').toLowerCase().includes(q)) return false;
      if (!matchesCategory(t, category)) return false;
      return true;
    });
  }, [search, category, rowsToUse]);

  // Portal content for menu: on mobile render a fixed bottom sheet, on desktop render small popup
  const menuPortal = (openMenuFor && menuPos) ? createPortal(
    <div
      data-action-menu-portal
      onClick={(e) => e.stopPropagation()}
      // use fixed so it works with scrolling; styles below adapt for mobile vs desktop
      style={{ position: 'fixed', zIndex: 9999, top: menuPos.top ?? undefined, bottom: menuPos.bottom ?? undefined, left: menuPos.bottom ? 8 : menuPos.left, right: menuPos.bottom ? 8 : undefined }}
    >
      {/* Desktop small popup */}
      {menuPos.bottom ? (
        <div className="p-4 bg-white border border-black/10 shadow-lg rounded-t-lg w-[calc(100%-16px)] mx-auto">
          <div className="max-w-[640px] mx-auto">
            {(() => {
              const row = filtered.find((r) => r.id === openMenuFor) ?? rowsToUse.find((r) => r.id === openMenuFor);
              if (!row) return null;
              return (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleViewReceipt(row); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors rounded"
                  >
                    <img src={ReceiptIcon} alt="receipt" /> View receipt
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleViewJob(row); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors rounded mt-2"
                  >
                    <img src={JobIcon} alt="job" /> View job
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="p-[16px] w-[185px] bg-white border border-black/10 shadow-lg rounded-md">
          {/* Desktop popup */}
          {(() => {
            const row = filtered.find((r) => r.id === openMenuFor) ?? rowsToUse.find((r) => r.id === openMenuFor);
            if (!row) return null;
            return (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleViewReceipt(row); }}
                  className="flex gap-2 w-full border-b border-gray text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <img src={ReceiptIcon} alt="receipt" /> View receipt
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleViewJob(row); }}
                  className="flex gap-2 w-full border-b border-gray text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors mt-2"
                >
                  <img src={JobIcon} alt="job" /> View job
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div className="bg-white pb-6 px-4 sm:p-[24px]">
      {/* Header + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <h2 className="text-[20px] font-semibold text-mentoos-text-primary">Recent Transactions</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:ml-auto w-full sm:w-auto">
          {/* Search (full width on mobile) */}
          <div className="flex items-center gap-3 px-3 py-2 border border-black/10 bg-white w-full sm:w-[320px] h-[48px]">
            <Search className="w-5 h-5 text-mentoos-text-primary/60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent  border-none outline-none text-base text-mentoos-text-secondary placeholder:text-mentoos-text-secondary"
            />
          </div>

          {/* Category dropdown (full width on mobile) */}
          <div className="relative w-full sm:w-auto" data-category-filter>
            <button
              onClick={() => setCategoryDropdownOpen((s) => !s)}
              className="flex items-center justify-between w-full sm:w-auto h-[48px] gap-2 px-4 py-1.5 border border-black/10 bg-white text-mentoos-text-dark hover:bg-gray-50 transition-colors"
            >
              <span className="text-base">{category}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[190px] bg-white border border-black/10 shadow-lg z-50 p-[8px]">
                <button onClick={() => { setCategory('All'); setCategoryDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'All' ? 'font-medium' : ''}`}>
                  All ({counts.All})
                </button>

                <button onClick={() => { setCategory('Student Payment'); setCategoryDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Student Payment' ? 'font-medium' : ''}`}>
                  Student Payment ({counts['Student Payment']})
                </button>

                <button onClick={() => { setCategory('Teacher Payment'); setCategoryDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Teacher Payment' ? 'font-medium' : ''}`}>
                  Teacher Payment ({counts['Teacher Payment']})
                </button>

                <button onClick={() => { setCategory('Refund'); setCategoryDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Refund' ? 'font-medium' : ''}`}>
                  Refund ({counts.Refund})
                </button>

                <button onClick={() => { setCategory('Referral'); setCategoryDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Referral' ? 'font-medium' : ''}`}>
                  Referral ({counts.Referral})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table: allow horizontal scroll on small screens */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="overflow-x-auto">
          {/* give table a reasonable min-width so columns don't collapse; user can scroll horizontally on mobile */}
          <div className="min-w-[720px]">
            <DataGrid columns={columns} rows={filtered} pageSize={5} />
          </div>
        </div>
      </div>

      {/* Render portal menu into document.body */}
      {menuPortal}
    </div>
  );
}
