import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Clock,
  Calendar,
  DollarSign,
  Star as StarIcon,
  X as XIcon,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DeleteIcon,
  EditIcon,
  InactiveIcon,
  ReOpenIcon,
} from "../../assets/managers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../components/ui/dialog";
import { useFetch } from "../../api";

// Badge color maps
const statusColors: Record<string, string> = {
  Live: "bg-green-100 text-green-600 border-green-200",
  New: "bg-blue-100 text-blue-600 border-blue-200",
  Ongoing: "bg-blue-50 text-blue-500 border-blue-200",
  Closed: "bg-red-50 text-red-500 border-red-200",
};

const jobTypeColors: Record<string, string> = {
  liveHelp: "bg-red-50 text-red-500 border-red-200",
  session: "bg-yellow-50 text-yellow-600 border-yellow-200",
  assignment: "bg-blue-50 text-blue-500 border-blue-200",
};

const allStatuses = ["Good fit", "New", "Rejected", "Finalized"];
const numericStars = [1, 2, 3, 4, 5];

const JobListing: React.FC = () => {
  const navigate = useNavigate();

  // API integration
  const { data, isLoading, error } = useFetch(
    ["newRequests"],
    `/manager-dashboard/new-requests`,
    true,
    { requiresAuth: true }
  );

  const items = data?.items || [];
  const total = data?.total || 0;

  // UI state
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState < number | null > (
    null
  );
  const [showFilterModal, setShowFilterModal] = useState(false);

  // filter / sort / search state
  const [filterStatus, setFilterStatus] = useState < string | null > (null);
  const [filterRating, setFilterRating] = useState < number | null > (null);
  const [sortBudget, setSortBudget] = useState < "asc" | "desc" | null > (null);
  const [sortDeadline, setSortDeadline] = useState < "asc" | "desc" | null > (
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState <
    "deadline" | "posted" | "budget" | null
    > (null);

  // row click -> navigate to applicants
  const handleRowClick = (job: any) => {
    const jobId = job._id;
    const jobType = job.type || job._type || "assignment"; // fallback
    navigate(`/manager/job-listing/${jobType}/${jobId}/applicants`);
  };

  // local helpers - parse numbers/dates safely
  const parseAmount = (amt: any) => {
    if (amt == null) return null;
    const n = Number(amt);
    if (!isFinite(n)) return null;
    return n;
  };

  const parseDate = (d: any) => {
    if (!d) return null;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return null;
    return dt;
  };

  // filtered + sorted items computed with useMemo
  const displayedItems = useMemo(() => {
    let list = Array.isArray(items) ? [...items] : [];

    // search filter: subject/title/description
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((job: any) => {
        const subject = (job.subject || job.title || "").toString().toLowerCase();
        const desc = (job.description || job.details || "").toString().toLowerCase();
        return subject.includes(q) || desc.includes(q);
      });
    }

    // filter by status if provided
    if (filterStatus) {
      list = list.filter((j: any) => (j.status || "").toString() === filterStatus);
    }

    // filter by rating if API provides rating field (reviews aggregated)
    if (filterRating != null) {
      list = list.filter((j: any) => {
        const rating = j.rating ?? j.avgRating ?? null;
        return rating != null && Number(rating) >= filterRating;
      });
    }

    // Sorting: apply primary sortBy if chosen
    if (sortBy === "budget") {
      list.sort((a: any, b: any) => {
        const pa = parseAmount(a.amount ?? a.studentPrice ?? a.price ?? null) ?? 0;
        const pb = parseAmount(b.amount ?? b.studentPrice ?? b.price ?? null) ?? 0;
        return sortBudget === "asc" ? pa - pb : pb - pa;
      });
    } else if (sortBy === "deadline") {
      list.sort((a: any, b: any) => {
        const da = parseDate(a.dueDate ?? a.deadline ?? null)?.getTime() ?? 0;
        const db = parseDate(b.dueDate ?? b.deadline ?? null)?.getTime() ?? 0;
        return sortDeadline === "asc" ? da - db : db - da;
      });
    } else if (sortBy === "posted") {
      list.sort((a: any, b: any) => {
        const ta = parseDate(a.createdAt ?? a.postedAt ?? null)?.getTime() ?? 0;
        const tb = parseDate(b.createdAt ?? b.postedAt ?? null)?.getTime() ?? 0;
        // newest first unless user set differently via sortDeadline (use desc as default)
        return (sortDeadline === "asc" ? ta - tb : tb - ta);
      });
    }

    return list;
  }, [
    items,
    searchQuery,
    filterStatus,
    filterRating,
    sortBy,
    sortBudget,
    sortDeadline,
  ]);

  // Filter modal handlers
  const clearFilters = () => {
    setFilterStatus(null);
    setFilterRating(null);
    setSortBudget(null);
    setSortDeadline(null);
    setSortBy(null);
    setSearchQuery("");
  };

  const applyFilters = () => {
    // We compute on-the-fly via useMemo. Close modal.
    setShowFilterModal(false);
  };

  if (isLoading) return <div className="p-6">Loading requests...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading requests</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">
            Job List{" "}
            <span className="text-gray-500">
              ({total}){" "}
              <span className="text-gray-400 text-[16px] ml-4">July 19 - July 25</span>
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Search subject or description..."
            />
          </div>

          {/* Sort & Filter */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className="border border-gray-200 px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              {/* <span className="hidden md:inline">Filter</span> */}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown((s) => !s)}
                className="border border-gray-200 px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sort by
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSortBy("deadline");
                        setShowSortDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Deadline
                    </button>

                    <button
                      onClick={() => {
                        setSortBy("posted");
                        setShowSortDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Posted date
                    </button>

                    <button
                      onClick={() => {
                        setSortBy("budget");
                        setShowSortDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Budget
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        // toggle "inactive" filter simulation - not altering list here
                        setShowSortDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserX className="w-4 h-4" />
                      Inactive
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 h-[60px] text-center">
                <th className="px-6 py-3 font-medium text-[16px]">Subject</th>
                <th className="px-6 py-3 font-medium text-[16px]">Budget</th>
                <th className="px-6 py-3 font-medium text-[16px]">Date Posted</th>
                <th className="px-6 py-3 font-medium text-[16px]">Due Date</th>
                <th className="px-6 py-3 font-medium text-[16px]">Location</th>
                <th className="px-6 py-3 font-medium text-[16px]">Status</th>
                <th className="px-6 py-3 font-medium text-[16px]">Job Type</th>
                <th className="px-6 py-3 font-medium text-[16px]">Applicants</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedItems.map((job: any, idx: number) => (
                <tr
                  key={job._id ?? idx}
                  className="border-b hover:bg-gray-50 group cursor-pointer h-[80px] text-[16px] text-center"
                  onClick={(e) => {
                    const actionsCell =
                      e.currentTarget.querySelector(".actions-td");
                    if (actionsCell && actionsCell.contains(e.target as Node)) {
                      return;
                    }
                    handleRowClick(job);
                  }}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 text-left">
                    {job.subject || job.title || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {job.amount != null
                      ? `$${job.amount}`
                      : job.studentPrice != null
                        ? `$${job.studentPrice}`
                        : "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {job.dueDate
                      ? new Date(job.dueDate).toLocaleDateString()
                      : job.startTime
                        ? new Date(job.startTime).toLocaleDateString()
                        : "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {job.location || job.country || job.createdBy?.country || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-[16px] py-[8px] border rounded-[80px] text-[14px] ${statusColors[job.status] ||
                        "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                    >
                      {job.status || "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-[16px] py-[8px] border rounded-[80px] text-[14px] ${jobTypeColors[job.type] ||
                        jobTypeColors[job._type] ||
                        "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                    >
                      {job.type || job._type || job.subject === "Live Help" ? "Live Help" : job.type || "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {typeof job.applicants === "number" ? job.applicants : job.applicants?.length ?? 0}
                  </td>

                  <td className="px-6 py-4 text-right actions-td">
                    <div className="relative flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionDropdown(showActionDropdown === idx ? null : idx);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Open actions"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>

                      {showActionDropdown === idx && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50">
                              <img src={InactiveIcon} alt="inactive" className="w-5 h-5" />
                              Inactive
                            </button>
                            <button className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50">
                              <img src={EditIcon} alt="edit" className="w-5 h-5" />
                              Edit Job
                            </button>
                            <button className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50">
                              <img src={ReOpenIcon} alt="reopen" className="w-5 h-5" />
                              Reopen Job
                            </button>
                            <hr className="my-1" />
                            <button className="w-full px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-gray-50">
                              <img src={DeleteIcon} alt="delete" className="w-5 h-5" />
                              Delete Job
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[10px] px-6 py-4 bg-gray-50 border-t border-gray-200 h-[40px] mt-4">
          <span className="text-[12px] text-gray-500">
            Showing {displayedItems.length} of {total}
          </span>
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <DialogTitle className="text-lg font-semibold">Filter & Sort</DialogTitle>
              <DialogClose asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <XIcon className="w-5 h-5" />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="divide-y divide-gray-200">
            {/* Status */}
            <div className="py-4">
              <h4 className="text-sm font-medium mb-3">Status</h4>
              <div className="flex gap-2 flex-wrap">
                {allStatuses.map((s) => {
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
                })}
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
                clearFilters();
              }}
              className="px-4 py-2 border rounded bg-white text-sm hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
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

export default JobListing;
