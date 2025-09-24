// JobListing.tsx
import React, { useState, useRef } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Clock,
  Calendar,
  DollarSign,
  UserX,
  Star as StarIcon,
  X as XIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon, EditIcon, InactiveIcon, ReOpenIcon } from '../../assets/managers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../../components/ui/dialog';

const jobs = [
  /* your jobs array (unchanged) */
  {
    subject: 'Mona Lisa',
    budget: '$50',
    datePosted: '20 May 2020',
    dueDate: '20 May 2020',
    location: 'USA',
    status: 'Live',
    jobType: 'Live Help',
    applicants: 19,
  },
  {
    subject: 'Mona Lisa',
    budget: '$50',
    datePosted: '20 May 2020',
    dueDate: '20 May 2020',
    location: 'USA',
    status: 'Live',
    jobType: 'Live Help',
    applicants: 19,
  },
  {
    subject: 'Mona Lisa',
    budget: '$50',
    datePosted: '20 May 2020',
    dueDate: '20 May 2020',
    location: 'USA',
    status: 'Live',
    jobType: 'Live Help',
    applicants: 19,
  },
  {
    subject: 'Mona Lisa',
    budget: '$50',
    datePosted: '20 May 2020',
    dueDate: '20 May 2020',
    location: 'USA',
    status: 'Live',
    jobType: 'Live Help',
    applicants: 19,
  },
  {
    subject: 'Mona Lisa',
    budget: '$50',
    datePosted: '20 May 2020',
    dueDate: '20 May 2020',
    location: 'USA',
    status: 'Live',
    jobType: 'Live Help',
    applicants: 19,
  },
  {
    subject: 'Mona Lisa',
    budget: '$50',
    datePosted: '20 May 2020',
    dueDate: '20 May 2020',
    location: 'USA',
    status: 'Live',
    jobType: 'Live Help',
    applicants: 19,
  },
  // ... rest of the items
];

const statusColors: Record<string, string> = {
  Live: 'bg-green-100 text-green-600 border-green-200',
  New: 'bg-blue-100 text-blue-600 border-blue-200',
  Ongoing: 'bg-blue-50 text-blue-500 border-blue-200',
  Closed: 'bg-red-50 text-red-500 border-red-200',
};

const jobTypeColors: Record<string, string> = {
  'Live Help': 'bg-red-50 text-red-500 border-red-200',
  Sessions: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  Assignment: 'bg-blue-50 text-blue-500 border-blue-200',
};

const allStatuses = ['Good fit', 'New', 'Rejected', 'Finalized']; // screenshot labels
const numericStars = [1, 2, 3, 4, 5];

const JobListing: React.FC = () => {
  const navigate = useNavigate();
  const handleRowClick = (id: number) => {
    navigate(`/manager/job-listing/${id}/applicants`);
  };

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<number | null>(null);

  // ----- Filter modal state -----
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(3); // default 3 per screenshot
  const [sortBudget, setSortBudget] = useState<'asc' | 'desc' | null>(null);
  const [sortDeadline, setSortDeadline] = useState<'asc' | 'desc' | null>(null);

  // Table data state (if you want)
  // const [jobsState, setJobsState] = useState(jobs);

  const total = jobs.length;

  const filterByQuery = (t: any) => true; // keep original search logic outside this snippet

  // Handlers for filter modal
  const clearFilters = () => {
    setFilterStatus(null);
    setFilterRating(null);
    setSortBudget(null);
    setSortDeadline(null);
  };

  const applyFilters = () => {
    // TODO: actually filter your table data here using the filter* state
    // For now we just close the modal to demonstrate behavior
    setShowFilterModal(false);
  };

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 text-[#141414]">
            Job List{' '}
            <span className="text-gray-500  text-[#141414]">
              (158){' '}
              <span className="text-gray-400 text-[16px] ml-4 text-[#141414CC]">
                July 19 - July 25
              </span>
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="border border-gray-200  pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Search..."
            />
          </div>

          {/* Sort Dropdown & Filter Button */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 bg-white cursor-pointer">
              <button
                onClick={() => setShowFilterModal(true)}
                aria-label="Open filter"
                className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sort by
              </button>
            </div>

            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Deadline
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Posted date
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget
                  </button>
                  <hr className="my-1" />
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <UserX className="w-4 h-4" />
                    Inactive
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 h-[60px] text-center text-[#141414]">
                <th className="px-6 py-3 font-medium text-[16px]">Subject name</th>
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
              {jobs.map((job, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 group cursor-pointer h-[80px] text-[16px] text-center text-[#141414]"
                  onClick={(e) => {
                    const actionsCell = e.currentTarget.querySelector('.actions-td');
                    if (actionsCell && actionsCell.contains(e.target as Node)) {
                      return;
                    }
                    handleRowClick(idx + 1);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 ">
                    {job.subject}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{job.budget}</td>
                  <td className="px-6 py-4 text-gray-700">{job.datePosted}</td>
                  <td className="px-6 py-4 text-gray-700">{job.dueDate}</td>
                  <td className="px-6 py-4 text-gray-700">{job.location}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-[16px] py-[8px] border rounded-[80px] min-w-[84px] text-[14px] text-center  h-[33px] ${statusColors[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-[16px] py-[8px] border rounded-[80px] min-w-[84px] text-[14px] text-center  h-[33px] ${jobTypeColors[job.jobType]}`}
                    >
                      {job.jobType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{job.applicants}</td>
                  <td className="px-6 py-4 text-right actions-td">
                    <div className="relative flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionDropdown(showActionDropdown === idx ? null : idx);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {showActionDropdown === idx && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                src={InactiveIcon}
                                alt={`inactiveicon`}
                                className="object-contain w-[20px]  h-[20px] mr-3 transition duration-200"
                              />
                              Inactive
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                src={EditIcon}
                                alt={`editicon`}
                                className="object-contain w-[20px]  h-[20px] mr-3 transition duration-200"
                              />
                              Edit Job
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                src={ReOpenIcon}
                                alt={`reopenicon`}
                                className="object-contain w-[20px]  h-[20px] mr-3 transition duration-200"
                              />
                              Reopen Job
                            </button>
                            <hr className="my-1" />
                            <button
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                src={DeleteIcon}
                                alt={`deleteicon`}
                                className="object-contain w-[20px]  h-[20px] mr-3 transition duration-200"
                              />
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
            Showing{' '}
            <select className="border border-gray-200 rounded px-2 py-1 text-sm mx-1 bg-white">
              <option>8</option>
              <option>12</option>
              <option>24</option>
              <option>48</option>
            </select>{' '}
            out of 512
          </span>
          <div className="flex items-center gap-1">
            <button className="w-[30px] h-[30px] bg-gray-900 text-white font-medium text-sm">
              1
            </button>
            <button className="w-[30px] h-[30px] hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors">
              2
            </button>
            <button className="w-[30px] h-[30px] hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors">
              3
            </button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-[30px] h-[30px] hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors">
              16
            </button>
            <button className="ml-2 p-2 hover:bg-gray-100 text-gray-400 transition-colors">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <DialogTitle className="text-lg font-semibold">Filter &amp; Sort</DialogTitle>
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
                      className={`px-3 py-1 rounded-full border ${active ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700'}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div className="py-4">
              <h4 className="text-sm font-medium mb-3">Rating</h4>
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
                      <div
                        className={`inline-flex items-center justify-center w-7 h-7 rounded ${active ? 'bg-yellow-100' : ''}`}
                      >
                        <StarIcon
                          className={`w-4 h-4 ${active ? 'text-yellow-500' : 'text-gray-300'}`}
                        />
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
                    <p className="text-sm text-gray-600">budget:</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        checked={sortBudget === 'asc'}
                        onChange={() => setSortBudget('asc')}
                        className="hidden"
                      />
                      <span
                        className={`px-2 py-1 rounded border ${sortBudget === 'asc' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                      >
                        Ascending
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        checked={sortBudget === 'desc'}
                        onChange={() => setSortBudget('desc')}
                        className="hidden"
                      />
                      <span
                        className={`px-2 py-1 rounded border ${sortBudget === 'desc' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                      >
                        Descending
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">teacher deadline:</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadline"
                        checked={sortDeadline === 'asc'}
                        onChange={() => setSortDeadline('asc')}
                        className="hidden"
                      />
                      <span
                        className={`px-2 py-1 rounded border ${sortDeadline === 'asc' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                      >
                        Ascending
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadline"
                        checked={sortDeadline === 'desc'}
                        onChange={() => setSortDeadline('desc')}
                        className="hidden"
                      />
                      <span
                        className={`px-2 py-1 rounded border ${sortDeadline === 'desc' ? 'bg-white border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                      >
                        Descending
                      </span>
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
