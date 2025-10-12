// components/JobApplicants.tsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Filter, MoreVertical, X } from "lucide-react";
import Updates from "./Updates";
import StudentDocuments from "./StudentDocuments";
import JobDetailsPage from "./JobDetails";
import { FinalizeIcon, GoodIcon, RejectIcon, StarIcon } from "../../assets/managers";
import { useFetch } from "../../api";
import DataGrid, { type Column } from "../../components/ui/DataGrid";
import { paths } from "../../config/path";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../components/ui/dialog";

interface Applicant {
  id: string;
  name: string;
  rating: number;
  budget: string;
  deadline: string;
  applied: string;
  status:
  | "Good Fit"
  | "Reject"
  | "Negotiate"
  | "Rejected"
  | "Finalized"
  | "Finalist";
  avatar?: string;
  [k: string]: any;
}

const statusColors: Record<string, string> = {
  "Good Fit": "px-[16px] py-[8px] font-inter text-[14px] bg-[rgb(245,251,249)] text-[rgb(65,190,144)] border border-[rgb(65,190,144)]",
  Reject: "px-[16px] py-[8px] font-inter text-[14px] bg-[#fff7f6] text-[#ff6550] border border-[#ff6550]",
  Negotiate: "px-[16px] py-[8px] font-inter text-[14px] bg-[rgb(255,251,245)] text-[rgb(255,175,56)] border border-[rgb(255,175,56)]",
  Rejected: "px-[16px] py-[8px] font-inter text-[14px] bg-[#fff7f6] text-[#ff6550] border border-[#ff6550]",
  Finalized: "px-[16px] py-[8px] font-inter text-[14px] bg-[rgb(242,250,252)] text-[rgb(1,154,203)] border border-[rgb(1,154,203)]",
  Finalist: "px-[16px] py-[8px] font-inter text-[14px] bg-[rgb(242,250,252)] text-[rgb(1,154,203)] border border-[rgb(1,154,203)]",
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    {...props}
    className={`border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const getColor = (name: string) => {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-yellow-400",
    "bg-indigo-400",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const JobApplicants: React.FC = () => {
  const { id: jobId, type } = useParams < {
    id: string;
    type: "assignment" | "session" | "liveHelp";
  } > ();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState < string > ("Applicants");
  const [search, setSearch] = useState("");
  const [openActionDropdownId, setOpenActionDropdownId] = useState < string | null > (null);
  const [menuPos, setMenuPos] = useState < { top?: number; left?: number; bottom?: number } | null > (null);

  const buttonsRef = useRef < Record < string, HTMLButtonElement | null >> ({});
  const actionContainerRefs = useRef < Record < string, HTMLDivElement | null >> ({});

  // Filter / Sort modal state
  const [showFilterModal, setShowFilterModal] = useState < boolean > (false);
  const [filterStatus, setFilterStatus] = useState < string | null > (null);
  const [filterRating, setFilterRating] = useState < number | null > (null);
  const [sortBudget, setSortBudget] = useState < "asc" | "desc" | null > (null);
  const [sortDeadline, setSortDeadline] = useState < "asc" | "desc" | null > (null);
  const [sortBy, setSortBy] = useState < string | null > (null);

  // Fetch applicants
  const { data, isLoading, error } = useFetch(
    ["applicants", jobId, type],
    `/manager-dashboard/applicants/${jobId}?type=${type}`,
    true,
    { requiresAuth: true }
  );

  const applicants: Applicant[] = data?.applicants ?? [];
  const [applicantList, setApplicantList] = useState < Applicant[] > ([]);

  useEffect(() => {
    setApplicantList(Array.isArray(applicants) ? applicants : []);
  }, [applicants]);

  // derived lists for modal UI
  const allStatuses = useMemo(
    () =>
      Array.from(new Set(applicantList.map((a) => a.status))).sort(),
    [applicantList]
  );

  const numericStars = [1, 2, 3, 4, 5];

  // close action menu on outside pointer down
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      if (
        !target.closest("[data-action-menu-portal]") &&
        !target.closest("[data-action-button]") &&
        !target.closest("[data-action-container]")
      ) {
        setOpenActionDropdownId(null);
        setMenuPos(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // action handlers
  const handleStatusChange = (applicantId: string, newStatus: Applicant["status"]) => {
    setApplicantList(prev => prev.map(app => (app.id === applicantId ? { ...app, status: newStatus } : app)));
    setOpenActionDropdownId(null);
    setMenuPos(null);
  };

  const handleRemove = (applicantId: string) => {
    setApplicantList(prev => prev.filter(p => p.id !== applicantId));
    setOpenActionDropdownId(null);
    setMenuPos(null);
  };

  // filtered applicants by search AND filters
  const filteredApplicants = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = applicantList.slice();

    if (q) {
      list = list.filter(a => a.name.toLowerCase().includes(q));
    }
    if (filterStatus) {
      list = list.filter(a => a.status === filterStatus);
    }
    if (filterRating !== null) {
      list = list.filter(a => (typeof a.rating === "number" ? a.rating >= filterRating : false));
    }

    // simple sort handling (budget/deadline) if requested
    if (sortBy === "budget" && sortBudget) {
      list.sort((x, y) => {
        // attempt numeric compare if budgets are numbers with currency; fallback to string
        const bx = parseFloat(String(x.budget).replace(/[^\d.]/g, "")) || 0;
        const by = parseFloat(String(y.budget).replace(/[^\d.]/g, "")) || 0;
        return sortBudget === "asc" ? bx - by : by - bx;
      });
    } else if (sortBy === "deadline" && sortDeadline) {
      list.sort((x, y) => {
        const dx = Date.parse(x.deadline) || 0;
        const dy = Date.parse(y.deadline) || 0;
        return sortDeadline === "asc" ? dx - dy : dy - dx;
      });
    }

    return list;
  }, [search, applicantList, filterStatus, filterRating, sortBy, sortBudget, sortDeadline]);

  // Build rows for DataGrid
  type RowType = {
    id: string;
    fullName: string;
    rating: number | string;
    budget: string;
    deadline: string;
    applied: string;
    status: string;
    __applicant: Applicant;
  };

  const gridRows: RowType[] = useMemo(
    () =>
      filteredApplicants.map((a) => ({
        id: a.id,
        fullName: a.name,
        rating: a.rating ?? "-",
        budget: a.budget ?? "-",
        deadline: a.deadline ?? "-",
        applied: a.applied ?? "-",
        status: a.status ?? "-",
        __applicant: a,
      })),
    [filteredApplicants]
  );

  // Columns for DataGrid
  const columns: Column<RowType>[] = useMemo(
    () => [
      {
        key: "fullName",
        label: "Full Name",
        minWidth: 240,
        render: (r: RowType) => {
          const a = r.__applicant;
          return (
            <div className="flex items-center gap-3">
              {a.avatar ? (
                <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg ${getColor(a.name)}`}>
                  {a.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-[16px] font-medium text-[#141414]">{a.name}</div>
            </div>
          );
        },
      },
      {
        key: "rating",
        label: "Rating",
        width: 100,
        align: "center",
        render: (r) => (
          <div className="flex items-center gap-1">
            {/* if StarIcon is a path/url, use img; if it's a React component, render it instead */}
            {/* Keeping as img to match your prior usage */}
            <img src={StarIcon as string} alt="star" className="w-4 h-4" />
            {r.rating}
          </div>
        )
      },
      { key: "budget", label: "Teacher Budget", width: 140, render: (r) => <div className="whitespace-nowrap">{r.budget}</div> },
      { key: "deadline", label: "Teacher Deadline", width: 140, render: (r) => <div className="whitespace-nowrap">{r.deadline}</div> },
      { key: "applied", label: "Applied Date", width: 140, render: (r) => <div className="whitespace-nowrap">{r.applied}</div> },
      {
        key: "status",
        label: "Selection status",
        width: 160,
        render: (r) => {
          const s = r.status;
          return <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusColors[s] || "bg-gray-50 text-gray-700 border border-gray-200"}`}>{s}</div>;
        },
      },
      {
        key: "action",
        label: "Action",
        width: 96,
        align: "center",
        render: (r: RowType) => {
          const id = r.id;
          return (
            <div className="flex items-center justify-center" data-action-container ref={(el: HTMLDivElement | null) => (actionContainerRefs.current[id] = el)}>
              <button
                data-action-button
                ref={(el: HTMLButtonElement | null) => (buttonsRef.current[id] = el)}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = openActionDropdownId === id ? null : id;
                  if (next) {
                    // compute menu position
                    const btn = buttonsRef.current[id];
                    if (window.innerWidth < 640) {
                      setMenuPos({ bottom: 8, left: 8 });
                    } else if (btn) {
                      const rect = btn.getBoundingClientRect();
                      const menuWidth = 180 + 16;
                      let left = rect.right - menuWidth + 16;
                      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
                      const top = rect.bottom + 8;
                      setMenuPos({ top: Math.round(top), left: Math.round(left) });
                    } else {
                      setMenuPos(null);
                    }
                  } else {
                    setMenuPos(null);
                  }
                  setOpenActionDropdownId(next);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-expanded={openActionDropdownId === id}
                aria-controls={openActionDropdownId === id ? `action-menu-${id}` : undefined}
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          );
        },
      },
    ],
    [openActionDropdownId]
  );

  // Portal menu content
  const menuPortal = openActionDropdownId && menuPos ? createPortal(
    <div
      data-action-menu-portal
      style={{
        position: "fixed",
        zIndex: 9999,
        top: menuPos.top ?? undefined,
        bottom: menuPos.bottom ?? undefined,
        left: menuPos.bottom ? 8 : menuPos.left,
        right: menuPos.bottom ? 8 : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuPos.bottom ? (
        <div className="p-4 bg-white border border-black/10 shadow-lg rounded-t-lg w-[calc(100%-16px)] mx-auto">
          <div className="max-w-[640px] mx-auto">
            {(() => {
              const row = gridRows.find(r => r.id === openActionDropdownId);
              if (!row) return null;
              const app = row.__applicant;
              return (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Good Fit"); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors "
                  >
                    <img src={GoodIcon as string} alt="good" /> Good Fit
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Rejected"); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors mt-2"
                  >
                    <img src={RejectIcon as string} alt="reject" /> Reject
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Finalized"); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors mt-2"
                  >
                    <img src={FinalizeIcon as string} alt="finalize" /> Finalize
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(app.id); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors text-red-600"
                  >
                    Remove
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      ) : (
        <div id={`action-menu-${openActionDropdownId}`} className="p-[8px] w-[180px] bg-white border border-black/10 shadow-lg ">
          {(() => {
            const row = gridRows.find(r => r.id === openActionDropdownId);
            if (!row) return null;
            const app = row.__applicant;
            return (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Good Fit"); }}
                  className="flex gap-2 w-full border-b border-gray-100 text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <img src={GoodIcon as string} alt="good" /> Good Fit
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Rejected"); }}
                  className="flex gap-2 w-full border-b border-gray-100 text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <img src={RejectIcon as string} alt="reject" /> Reject
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Finalized"); }}
                  className="flex gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <img src={FinalizeIcon as string} alt="finalize" /> Finalize
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>,
    document.body
  ) : null;

  if (isLoading) return <div className="p-6">Loading applicants...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load applicants</div>;

  return (
    <div className="p-6 min-h-screen">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["Applicants", "Job Details", "Updates"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-[16px] ${activeTab === tab ? "border-[#019ACB] text-[#141414]" : "border-transparent text-[#8E8E93] hover:text-gray-700 hover:border-gray-300"}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Applicants" && (
        <div className="bg-[#fff] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 ">
            <h1 className="text-[20px] font-epilogue font-bold text-gray-900">
              Total Applicants : <span className="font-normal text-gray-600">{applicantList.length}</span>
            </h1>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  className="pl-10 pr-4 py-2 text-sm w-64 bg-white"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="border border-gray-200 px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50"
                aria-haspopup="dialog"
                aria-expanded={showFilterModal}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white overflow-x-auto">
            <div className="min-w-0">
              <DataGrid
                columns={columns}
                rows={gridRows}
                pageSize={8}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "Job Details" && <div className="text-gray-600"><JobDetailsPage /></div>}
      {activeTab === "Updates" && <Updates />}

      {menuPortal}

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-lg w-full p-6">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <DialogTitle className="text-lg font-semibold">Filter & Sort</DialogTitle>
              <DialogClose asChild>
                <button className="p-1 rounded hover:bg-gray-100" aria-label="Close filter modal">
                  <X className="w-5 h-5" />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="divide-y divide-gray-200">
            {/* Status */}
            <div className="py-4">
              <h4 className="text-sm font-medium mb-3">Status</h4>
              <div className="flex gap-2 flex-wrap">
                {allStatuses.length === 0 ? (
                  <div className="text-sm text-gray-500">No statuses</div>
                ) : (
                  allStatuses.map((s) => {
                    const active = filterStatus === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(active ? null : s)}
                        className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700'}`}
                      >
                        {s}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="py-4">
              <h4 className="text-sm font-medium mb-3">Rating (min)</h4>
              <div className="flex items-center gap-3">
                {numericStars.map((n) => {
                  const active = filterRating === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setFilterRating(active ? null : n)}
                      className="flex items-center gap-1"
                      aria-pressed={active}
                    >
                      <div className={`inline-flex items-center justify-center w-7 h-7 rounded ${active ? 'bg-yellow-100' : ''}`}>
                        <StarIcon className={`w-4 h-4 ${active ? 'text-yellow-500' : 'text-gray-300'}`} />
                      </div>
                      <span className="text-sm">{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort by */}
            <div className="py-4">
              <h4 className="text-sm font-medium mb-3">Sort by</h4>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        checked={sortBudget === "asc" && sortBy === "budget"}
                        onChange={() => {
                          setSortBy("budget");
                          setSortBudget("asc");
                        }}
                        className="hidden"
                      />
                      <span className={`px-2 py-1 rounded border ${sortBudget === 'asc' && sortBy === 'budget' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>Ascending</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        checked={sortBudget === "desc" && sortBy === "budget"}
                        onChange={() => {
                          setSortBy("budget");
                          setSortBudget("desc");
                        }}
                        className="hidden"
                      />
                      <span className={`px-2 py-1 rounded border ${sortBudget === 'desc' && sortBy === 'budget' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>Descending</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadline"
                        checked={sortDeadline === "asc" && sortBy === "deadline"}
                        onChange={() => {
                          setSortBy("deadline");
                          setSortDeadline("asc");
                        }}
                        className="hidden"
                      />
                      <span className={`px-2 py-1 rounded border ${sortDeadline === 'asc' && sortBy === 'deadline' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>Ascending</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadline"
                        checked={sortDeadline === "desc" && sortBy === "deadline"}
                        onChange={() => {
                          setSortBy("deadline");
                          setSortDeadline("desc");
                        }}
                        className="hidden"
                      />
                      <span className={`px-2 py-1 rounded border ${sortDeadline === 'desc' && sortBy === 'deadline' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>Descending</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setFilterStatus(null);
                setFilterRating(null);
                setSortBudget(null);
                setSortDeadline(null);
                setSortBy(null);
                setSearch("");
                setShowFilterModal(false);
              }}
              className="px-4 py-2 border rounded bg-white text-sm hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="px-4 py-2 bg-[#2196F3] text-white rounded text-sm hover:opacity-90"
            >
              Apply Filter
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobApplicants;
