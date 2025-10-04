// components/JobListing.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
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
  ManagerEditIcon,
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
import { useFetch } from "../../api/UseFetch";
import { useGenericMutation } from "../../api/useGenericMutation";
import toast from "react-hot-toast";

type AssignmentForm = {
  _id?: string;
  title?: string;
  description?: string;
  subject?: string;
  course?: string;
  courseCode?: string;
  status?: string;
  studentPrice?: number | string;
};

const statusColors: Record<string, string> = {
  Live: "bg-green-100 text-green-600 border-green-200",
  New: "bg-blue-100 text-blue-600 border-blue-200",
  Ongoing: "bg-blue-50 text-blue-500 border-blue-200",
  Closed: "bg-red-50 text-red-500 border-red-200",
  Inactive: "bg-gray-50 text-gray-500 border-gray-200",
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

  // API: list + refetch
  const { data, isLoading, error, refetch } = useFetch(
    ["newRequests"],
    `/manager-dashboard/new-requests`,
    true,
    { requiresAuth: true }
  );

  // generic mutation hook
  const { mutateAsync } = useGenericMutation();

  const items = data?.items || [];
  const total = data?.total || 0;

  // UI state
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState < number | null > (null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // filter / sort / search state
  const [filterStatus, setFilterStatus] = useState < string | null > (null);
  const [filterRating, setFilterRating] = useState < number | null > (null);
  const [sortBudget, setSortBudget] = useState < "asc" | "desc" | null > (null);
  const [sortDeadline, setSortDeadline] = useState < "asc" | "desc" | null > (null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState < "deadline" | "posted" | "budget" | null > (null);

  // column widths (resizable)
  const initialWidths = [200, 120, 140, 140, 140, 140, 140, 120, 100]; // px defaults
  const [colWidths, setColWidths] = useState < number[] > (initialWidths);
  const resizingRef = useRef < { idx: number; startX: number; startW: number } | null > (null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!resizingRef.current) return;
      const { idx, startX, startW } = resizingRef.current;
      const delta = e.clientX - startX;
      setColWidths((prev) => {
        const next = [...prev];
        next[idx] = Math.max(80, startW + delta); // min 80px
        return next;
      });
    }
    function onPointerUp() {
      resizingRef.current = null;
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  // Close action dropdown on outside click / escape / scroll
  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.(".more-btn")) return;
      if (el?.closest?.("[data-action-dropdown]")) return;
      if (showActionDropdown !== null) setShowActionDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showActionDropdown !== null) setShowActionDropdown(null);
    };
    const onScroll = () => {
      if (showActionDropdown !== null) setShowActionDropdown(null);
    };

    document.addEventListener("mousedown", onDocDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [showActionDropdown]);

  // row click -> navigate to applicants
  const handleRowClick = (job: any) => {
    const jobId = job._id;
    const jobType = job.type || job._type || "assignment";
    navigate(`/manager/job-listing/${jobType}/${jobId}/applicants`);
  };

  // helpers
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

    // search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((job: any) => {
        const subject = (job.subject || job.title || "").toString().toLowerCase();
        const desc = (job.description || job.details || "").toString().toLowerCase();
        return subject.includes(q) || desc.includes(q);
      });
    }

    // status
    if (filterStatus) {
      list = list.filter((j: any) => (j.status || "").toString() === filterStatus);
    }

    // rating
    if (filterRating != null) {
      list = list.filter((j: any) => {
        const rating = j.rating ?? j.avgRating ?? null;
        return rating != null && Number(rating) >= filterRating;
      });
    }

    // Sorting
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
        return sortDeadline === "asc" ? ta - tb : tb - ta;
      });
    }

    return list;
  }, [items, searchQuery, filterStatus, filterRating, sortBy, sortBudget, sortDeadline]);

  // ---------- EDIT DIALOG state ----------
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState < AssignmentForm > ({});

  const openEditDialog = (job: any) => {
    setEditForm({
      _id: job._id,
      title: job.subject || job.title || "",
      description: job.description || "",
      subject: job.subject || "",
      course: job.course || "",
      courseCode: job.courseCode || "",
      status: job.status || "",
      studentPrice: job.amount ?? job.studentPrice ?? "",
    });
    setEditDialogOpen(true);
    setShowActionDropdown(null);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditForm({});
  };

  // submit edit -> PUT /assignments/:id using useGenericMutation pattern
  const handleEditSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editForm._id) return;

    try {
      await mutateAsync({
        endpoint: `/assignments/${editForm._id}`,
        method: "PUT",
        requiresAuth: true,
        data: {
          title: editForm.title,
          description: editForm.description,
          subject: editForm.subject,
          course: editForm.course,
          courseCode: editForm.courseCode,
          status: editForm.status,
          studentPrice: Number(editForm.studentPrice || 0),
        },
        successMessage: "Assignment updated",
        errorMessage: "Failed to update assignment",
        invalidateKeys: ["newRequests"],
        onSuccessCallback: (resp?: any) => {
          toast.success("Assignment updated");
          refetch?.();
          closeEditDialog();
        },
        onErrorCallback: (err?: any) => {
          toast.error("Failed to update assignment");
          console.error("Failed to update assignment", err);
        },
      });
    } catch (err) {
      console.error("Failed to update assignment", err);
      toast.error("Failed to update assignment");
    }
  };

  // change status helper (Inactive / Reopen) — tries status endpoint then falls back to PUT
  const changeStatus = async (jobId: string, newStatus: string) => {
    try {
      // First try PATCH to a dedicated status endpoint
      await mutateAsync({
        endpoint: `/assignments/${jobId}/status`,
        method: "PATCH",
        requiresAuth: true,
        data: { status: newStatus },
        successMessage: `Status changed to ${newStatus}`,
        errorMessage: `Failed to change status to ${newStatus}`,
        invalidateKeys: ["newRequests"],
        onSuccessCallback: () => {
          toast.success(`Status changed to ${newStatus}`);
          refetch?.();
          setShowActionDropdown(null);
        },
      });
    } catch (err) {
      // fallback: update whole assignment
      try {
        await mutateAsync({
          endpoint: `/assignments/${jobId}`,
          method: "PUT",
          requiresAuth: true,
          data: { status: newStatus },
          successMessage: `Status changed to ${newStatus}`,
          errorMessage: `Failed to change status to ${newStatus}`,
          invalidateKeys: ["newRequests"],
          onSuccessCallback: () => {
            toast.success(`Status changed to ${newStatus}`);
            refetch?.();
            setShowActionDropdown(null);
          },
        });
      } catch (err2) {
        toast.error(`Failed to change status to ${newStatus}`);
        console.error("Failed to change status (both attempts)", err, err2);
      }
    }
  };

  // delete job
  const handleDeleteJob = async (jobId: string) => {
    try {
      await mutateAsync({
        endpoint: `/assignments/${jobId}`,
        method: "DELETE",
        requiresAuth: true,
        successMessage: "Assignment deleted",
        errorMessage: "Failed to delete assignment",
        invalidateKeys: ["newRequests"],
        onSuccessCallback: () => {
          toast.success("Assignment deleted");
          refetch?.();
        },
        onErrorCallback: (err?: any) => {
          toast.error("Failed to delete assignment");
          console.error("Delete failed", err);
        },
      });
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete assignment");
    }
  };

  if (isLoading) return <div className="p-6">Loading requests...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading requests</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-[20px] font-bold text-gray-900">
          Job List <span className="text-gray-500">({total})</span>
        </h1>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Search subject or description..."
              aria-label="Search jobs"
            />
          </div>

          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className="border border-gray-200 px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="Open filters"
            >
              <Filter className="w-5 h-5" />
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

      {/* Table container - horizontal scroll on mobile */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="p-[16px] text-gray-600 h-[60px] text-center">
              {[
                "Subject",
                "Budget",
                "Date Posted",
                "Due Date",
                "Location",
                "Status",
                "Job Type",
                "Applicants",
                "Actions",
              ].map((label, idx) => (
                <th
                  key={idx}
                  className="px-2 py-3 font-medium text-[16px] relative group"
                  style={{ width: colWidths[idx], minWidth: 80 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{label}</span>

                    {/* Resize handle */}
                    <div
                      role="separator"
                      aria-orientation="vertical"
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize group-hover:bg-gray-200"
                      onPointerDown={(e) =>
                      (resizingRef.current = {
                        idx,
                        startX: e.clientX,
                        startW: colWidths[idx],
                      })
                      }
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {displayedItems.map((job: any, idx: number) => (
              <tr
                key={job._id ?? idx}
                className="hover:bg-gray-50 cursor-pointer text-center"
                onClick={(e) => {
                  const actionsCell = e.currentTarget.querySelector(".actions-td");
                  if (actionsCell && actionsCell.contains(e.target as Node)) return;
                  handleRowClick(job);
                }}
              >
                <td style={{ width: colWidths[0] }} className="p-[16px] text-left text-[16px] text-[#141414]">
                  {job.subject || job.title || "-"}
                </td>
                <td style={{ width: colWidths[1] }} className="px-2 py-4 text-[#141414]">
                  {job.amount != null ? `$${job.amount}` : job.studentPrice != null ? `$${job.studentPrice}` : "-"}
                </td>
                <td style={{ width: colWidths[2] }} className="px-2 py-4 text-[#141414]">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}
                </td>
                <td style={{ width: colWidths[3] }} className="px-2 py-4 text-[#141414]">
                  {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : job.startTime ? new Date(job.startTime).toLocaleDateString() : "-"}
                </td>
                <td style={{ width: colWidths[4] }} className="px-2 py-4 text-[#141414]">
                  {job.location || job.country || job.createdBy?.country || "-"}
                </td>
                <td style={{ width: colWidths[5] }} className="px-2 py-4 text-[#141414]">
                  <div className={`px-2 py-1 rounded-full ${statusColors[job.status] || "bg-gray-50"}`}>
                    {job.status || "-"}
                  </div>
                </td>
                <td style={{ width: colWidths[6] }} className="px-2 py-4 text-[#141414]">
                  <div className={`px-2 py-1 rounded-full ${jobTypeColors[job.type] || "bg-gray-50"}`}>
                    {job.type || job._type || "-"}
                  </div>
                </td>
                <td style={{ width: colWidths[7] }} className="px-2 py-4 text-[#141414]">
                  {typeof job.applicants === "number" ? job.applicants : job.applicants?.length ?? 0}
                </td>

                <td style={{ width: colWidths[8] }} className="actions-td px-2 py-4 text-[#141414]">
                  <div className="relative flex items-center justify-center">
                    <button
                      aria-label="Open actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionDropdown(showActionDropdown === idx ? null : idx);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors more-btn"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {showActionDropdown === idx && (
                      <div
                        data-action-dropdown
                        className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                        role="menu"
                        aria-label={`Actions for job ${job._id ?? idx}`}
                      >
                        <div className="py-1">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              setShowActionDropdown(null);
                              if (!job._id) return;
                              await changeStatus(job._id, "Inactive");
                            }}
                            className="w-full px-4 py-2 flex gap-2 text-sm hover:bg-gray-50"
                          >
                            <img src={InactiveIcon} alt="inactive" className="w-5 h-5" />
                            Inactive
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(job);
                            }}
                            className="w-full px-4 py-2 flex gap-2 text-sm hover:bg-gray-50"
                          >
                            <img src={ManagerEditIcon} alt="edit" className="w-5 h-5" />
                            Edit Job
                          </button>

                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              setShowActionDropdown(null);
                              if (!job._id) return;
                              await changeStatus(job._id, "Live");
                            }}
                            className="w-full px-4 py-2 flex gap-2 text-sm hover:bg-gray-50"
                          >
                            <img src={ReOpenIcon} alt="reopen" className="w-5 h-5" />
                            Reopen Job
                          </button>

                          <hr className="my-1" />

                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              setShowActionDropdown(null);
                              if (!job._id) return;
                              if (!confirm("Delete this job? This action cannot be undone.")) return;
                              await handleDeleteJob(job._id);
                            }}
                            className="w-full px-4 py-2 flex gap-2 text-sm text-red-600 hover:bg-gray-50"
                          >
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
                setFilterStatus(null);
                setFilterRating(null);
                setSortBudget(null);
                setSortDeadline(null);
                setSortBy(null);
                setSearchQuery("");
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

      {/* EDIT DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) closeEditDialog(); }}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <DialogTitle className="text-lg font-semibold">Edit Job</DialogTitle>
              <DialogClose asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <XIcon className="w-5 h-5" />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Title</label>
                <input
                  value={editForm.title ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Subject</label>
                <input
                  value={editForm.subject ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Course</label>
                <input
                  value={editForm.course ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, course: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Course Code</label>
                <input
                  value={editForm.courseCode ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, courseCode: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600">Description</label>
              <textarea
                value={editForm.description ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border px-3 py-2 rounded h-28"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600">Price</label>
                <input
                  type="number"
                  value={editForm.studentPrice ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, studentPrice: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Status</label>
                <select
                  value={editForm.status ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select status</option>
                  <option value="New">New</option>
                  <option value="Live">Live</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-end justify-end">
                <div className="flex gap-2">
                  <button type="button" onClick={closeEditDialog} className="px-4 py-2 border rounded bg-white">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobListing;
