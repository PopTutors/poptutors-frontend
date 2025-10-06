// components/JobApplicants.tsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Filter, MoreVertical } from "lucide-react";
import Updates from "./Updates";
import StudentDocuments from "./StudentDocuments";
import JobDetailsPage from "./JobDetails";
import { FinalizeIcon, GoodIcon, RejectIcon } from "../../assets/managers";
import { useFetch } from "../../api";
import DataGrid, { type Column } from "../../components/ui/DataGrid";
import { paths } from "../../config/path";

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
  // keep any other original fields if needed
  [k: string]: any;
}

const statusColors: Record<string, string> = {
  "Good Fit": "px-[16px] py-[8px] font-inter text-[14px] text-[#0F6B3A] bg-[#f6fbf9] border border-[#41BE90]",
  Reject: "px-[16px] py-[8px] font-inter text-[14px] text-[#B91C1C] bg-[#fff5f5] border border-[#FCA5A5] hover:bg-[#fee2e2]",
  Negotiate: "px-[16px] py-[8px] font-inter text-[14px] text-[#B45309] bg-[#fffbeb] border border-[#FDE68A] hover:bg-[#fff7db]",
  Rejected: "px-[16px] py-[8px] font-inter text-[14px] text-[#991B1B] bg-[#fff1f2] border border-[#FCA5A5] hover:bg-[#ffe4e6]",
  Finalized: "px-[16px] py-[8px] font-inter text-[14px] text-[#0B63B7] bg-[#f0f9ff] border border-[#A7D8FF] hover:bg-[#e6f6ff]",
  Finalist: "px-[16px] py-[8px] font-inter text-[14px] text-[#6B21A8] bg-[#fbf5ff] border border-[#D6BCFA] hover:bg-[#f7efff]",
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

  // close action menu on outside pointer down
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      if (!target.closest("[data-action-menu-portal]") && !target.closest("[data-action-button]") && !target.closest("[data-action-container]")) {
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

  // filtered applicants by search
  const filteredApplicants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applicantList;
    return applicantList.filter(a => a.name.toLowerCase().includes(q));
  }, [search, applicantList]);

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
      { key: "rating", label: "Rating", width: 100, align: "center", render: (r) => <div>{r.rating}</div> },
      { key: "budget", label: "Teacher Budget", width: 140, render: (r) => <div className="whitespace-nowrap">{r.budget}</div> },
      { key: "deadline", label: "Teacher Deadline", width: 140, render: (r) => <div className="whitespace-nowrap">{r.deadline}</div> },
      { key: "applied", label: "Applied Date", width: 140, render: (r) => <div className="whitespace-nowrap">{r.applied}</div> },
      {
        key: "status",
        label: "Selection status",
        width: 160,
        render: (r) => {
          const s = r.status;
          return <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusColors[s] || "bg-gray-50"}`}>{s}</div>;
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
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors rounded"
                  >
                    <img src={GoodIcon} alt="good" /> Mark Good Fit
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Rejected"); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors rounded mt-2"
                  >
                    <img src={RejectIcon} alt="reject" /> Reject
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Finalized"); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors rounded mt-2"
                  >
                    <img src={FinalizeIcon} alt="finalize" /> Finalize
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(app.id); }}
                    className="flex gap-2 w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors rounded text-red-600"
                  >
                    Remove
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      ) : (
        <div id={`action-menu-${openActionDropdownId}`} className="p-[8px] w-[180px] bg-white border border-black/10 shadow-lg rounded-md">
          {(() => {
            const row = gridRows.find(r => r.id === openActionDropdownId);
            if (!row) return null;
            const app = row.__applicant;
            return (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Good Fit"); }}
                  className="flex gap-2 w-full border-b border-gray text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <img src={GoodIcon} alt="good" /> Mark Good Fit
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Rejected"); }}
                  className="flex gap-2 w-full border-b border-gray text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <img src={RejectIcon} alt="reject" /> Reject
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(app.id, "Finalized"); }}
                  className="flex gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <img src={FinalizeIcon} alt="finalize" /> Finalize
                </button>

                <hr className="my-1" />

                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(app.id); }}
                  className="flex gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                >
                  Remove
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>,
    document.body
  ) : null;

  // Optionally: row click — navigate to applicant detail (if you want)
  // For now I won't navigate on row click to preserve current UX; if you'd like navigation, enable the onRowClick prop:
  // onRowClick={(r) => navigate(`${paths.manager}/applicant/${r.id}`)}
  // (Uncomment and change the path if you have a specific route.)

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
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
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
              <button className="border border-gray-200 px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 overflow-x-auto">
            <div className="min-w-0">
              <DataGrid
                columns={columns}
                rows={gridRows}
                pageSize={8}
              /* Uncomment and customize if you want clicks to navigate to an applicant page:
              onRowClick={(r) => navigate(`${paths.manager}/applicant/${r.id}`)} */
              />
            </div>
          </div>
        </>
      )}

      {activeTab === "Job Details" && <div className="text-gray-600"><JobDetailsPage /></div>}
      {activeTab === "Updates" && <Updates />}

      {menuPortal}
    </div>
  );
};

export default JobApplicants;
