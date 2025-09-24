import React, { useMemo, useState, useEffect } from 'react';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';
import DataGrid from '../../../../components/ui/DataGrid';
import { JobIcon, ReceiptIcon } from '../../../../assets/managers';

// Transaction type
export type TransactionType = {
  id: string;
  dateTime: string; // e.g. '02 Jan, 2025 – 10:45 AM'
  payment: string; // 'Student' | 'Teacher'
  paymentType: string; // 'Payment' | 'Refund' | 'Referral'
  amount: string;
  status: 'Completed' | 'Failed' | 'Pending' | 'Refunded';
  amountType: 'positive' | 'negative';
};

// Sample data
const transactionsSample: TransactionType[] = [
  { id: '#10001', dateTime: '02 Jan, 2025 – 10:45 AM', payment: 'Student', paymentType: 'Refund', amount: '- $50', status: 'Completed', amountType: 'negative' },
  { id: '#10002', dateTime: '05 Jan, 2025 – 04:22 PM', payment: 'Teacher', paymentType: 'Payment', amount: '- $550', status: 'Failed', amountType: 'negative' },
  { id: '#10003', dateTime: '07 Jan, 2025 – 09:10 AM', payment: 'Student', paymentType: 'Payment', amount: '+ $75', status: 'Failed', amountType: 'positive' },
  { id: '#10004', dateTime: '09 Jan, 2025 – 11:59 PM', payment: 'Student', paymentType: 'Payment', amount: '+ $757', status: 'Pending', amountType: 'positive' },
  { id: '#10005', dateTime: '12 Jan, 2025 – 01:30 PM', payment: 'Student', paymentType: 'Referral', amount: '- $60', status: 'Failed', amountType: 'negative' },
  { id: '#10006', dateTime: '15 Jan, 2025 – 06:05 PM', payment: 'Teacher', paymentType: 'Payment', amount: '- $90', status: 'Refunded', amountType: 'negative' },
  { id: '#10007', dateTime: '18 Jan, 2025 – 08:20 AM', payment: 'Student', paymentType: 'Payment', amount: '+ $117', status: 'Refunded', amountType: 'positive' },
];

// Status badge helper
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

type Category = 'All' | 'Student Payment' | 'Teacher Payment' | 'Refund' | 'Referral';

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');

  // dropdown state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // row action menu
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  // close dropdowns/menus on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;

      if (!target.closest('[data-action-menu]') && !target.closest('[data-action-button]')) {
        setOpenMenuFor(null);
      }
      if (!target.closest('[data-category-filter]')) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleActionToggle = (rowId: string) => {
    setOpenMenuFor((prev) => (prev === rowId ? null : rowId));
  };

  const handleViewReceipt = (row: TransactionType) => {
    // replace with real modal/router
    alert(`View receipt for ${row.id}`);
    setOpenMenuFor(null);
  };

  const handleViewJob = (row: TransactionType) => {
    alert(`View job for ${row.id}`);
    setOpenMenuFor(null);
  };

  // Helper: category matcher
  const matchesCategory = (t: TransactionType, cat: Category) => {
    if (cat === 'All') return true;
    if (cat === 'Student Payment') return t.payment === 'Student' && t.paymentType === 'Payment';
    if (cat === 'Teacher Payment') return t.payment === 'Teacher' && t.paymentType === 'Payment';
    if (cat === 'Refund') return t.paymentType === 'Refund';
    if (cat === 'Referral') return t.paymentType === 'Referral';
    return true;
  };

  // counts for dropdown (respecting current search so counts show how many match given search)
  const counts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const c: Record<Category, number> = { 'All': 0, 'Student Payment': 0, 'Teacher Payment': 0, 'Refund': 0, 'Referral': 0 };
    transactionsSample.forEach((t) => {
      if (q && !Object.values(t).join(' ').toLowerCase().includes(q)) return;
      c.All++;
      if (t.payment === 'Student' && t.paymentType === 'Payment') c['Student Payment']++;
      if (t.payment === 'Teacher' && t.paymentType === 'Payment') c['Teacher Payment']++;
      if (t.paymentType === 'Refund') c['Refund']++;
      if (t.paymentType === 'Referral') c['Referral']++;
    });
    return c;
  }, [search]);

  // table columns
  const columns: Column<TransactionType>[] = useMemo(
    () => [
      { key: 'id', label: 'Job ID', width: 110 },
      { key: 'dateTime', label: 'Date & Time', width: 320 },
      { key: 'payment', label: 'Payment', width: 130 },
      { key: 'paymentType', label: 'Payment Type', width: 190 },
      {
        key: 'amount',
        label: 'Amount',
        width: 190,
        render: (r) => (
          <span className={`${r.amountType === 'positive' ? 'text-mentoos-status-success' : 'text-mentoos-status-danger'} whitespace-nowrap`}>
            {r.amount}
          </span>
        ),
      },
      { key: 'status', label: 'Status', width: 190, render: (r) => <StatusBadge status={r.status} /> },
      {
        key: 'action',
        label: 'Action',
        width: 80,
        align: 'center',
        render: (r: TransactionType) => (
          <div className="relative inline-block">
            <button
              data-action-button
              onClick={() => handleActionToggle(r.id)}
              className="p-1 hover:bg-gray-50 rounded transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-mentoos-text-primary" />
            </button>

            {openMenuFor === r.id && (
              <div data-action-menu className="p-[16px]  absolute right-0 mt-2 w-[185px] bg-white border border-black/10 shadow-lg z-50">
                <button onClick={() => handleViewReceipt(r)} className="flex gap-2 w-full border-b border-gray text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                  <img src={ReceiptIcon}/> View receipt
                </button>
                <button onClick={() => handleViewJob(r)} className="flex gap-2 w-full border-b border-gray text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                  <img src={JobIcon}/> 
                   View job
                </button>
              </div>
            )}
          </div>
        ),
      },
    ],
    [openMenuFor]
  );

  // combined filtering: search + category
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactionsSample.filter((t) => {
      if (q && !Object.values(t).join(' ').toLowerCase().includes(q)) return false;
      if (!matchesCategory(t, category)) return false;
      return true;
    });
  }, [search, category]);

  return (
    <div className="bg-white pb-6 p-[24px]">
      {/* Header controls */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-[20px] font-semibold text-mentoos-text-primary flex-1">Recent Transactions</h2>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-3 border border-black/10 bg-white w-[320px]">
            <Search className="w-5 h-5 text-mentoos-text-primary/60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent border-none outline-none text-base text-mentoos-text-secondary placeholder:text-mentoos-text-secondary "
            />
          </div>

          {/* Single Category filter dropdown */}
          <div className="relative" data-category-filter>
            <button
              onClick={() => setCategoryDropdownOpen((s) => !s)}
              className="flex items-center h-[48px] gap-2 px-4 py-1.5 border border-black/10 bg-white text-mentoos-text-dark hover:bg-gray-50 transition-colors"
            >
              <span className="text-base">{category}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute right-4 mt-2 w-[190px] bg-white border border-black/10 shadow-lg rounded-md z-50 p-[16px]">
                <button
                  onClick={() => {
                    setCategory('All');
                    setCategoryDropdownOpen(false);
                  }}
                  className={`border-b border-grey w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors  ${category === 'All' ? 'font-medium' : ''}`}
                >
                  All
                </button>

                <button
                  onClick={() => {
                    setCategory('Student Payment');
                    setCategoryDropdownOpen(false);
                  }}
                  className={`border-b border-grey w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Student Payment' ? 'font-medium' : ''}`}
                >
                  Student Payment 
                </button>

                <button
                  onClick={() => {
                    setCategory('Teacher Payment');
                    setCategoryDropdownOpen(false);
                  }}
                  className={`border-b border-grey w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Teacher Payment' ? 'font-medium' : ''}`}
                >
                  Teacher Payment 
                </button>

                <button
                  onClick={() => {
                    setCategory('Refund');
                    setCategoryDropdownOpen(false);
                  }}
                  className={`border-b border-grey w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Refund' ? 'font-medium' : ''}`}
                >
                  Refund 
                </button>

                <button
                  onClick={() => {
                    setCategory('Referral');
                    setCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${category === 'Referral' ? 'font-medium' : ''}`}
                >
                  Referral 
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <DataGrid columns={columns} rows={filtered} pageSize={5} />
    </div>
  );
}
