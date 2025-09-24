import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter, Grid3X3, MoreVertical, Star } from 'lucide-react';
import Updates from './Updates'; // make sure path is correct
import { FinalizeIcon, GoodIcon, RejectIcon } from '../../assets/managers';
import StudentDocuments from './StudentDocuments';

interface Applicant {
  id: number;
  name: string;
  rating: number;
  budget: string;
  deadline: string;
  applied: string;
  status: 'Good Fit' | 'Reject' | 'Negotiate' | 'Rejected' | 'Finalized' | 'Finalist';
  avatar: string;
}

const applicantsData: Applicant[] = [
  {
    id: 1,
    name: 'Mona Lisa',
    rating: 0.0,
    budget: '50$',
    deadline: '20 May 2020',
    applied: '20 May 2020',
    status: 'Good Fit',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Mona Lisa',
    rating: 0.0,
    budget: '50$',
    deadline: '20 May 2020',
    applied: '20 May 2020',
    status: 'Reject',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Mona Lisa',
    rating: 0.0,
    budget: '50$',
    deadline: '20 May 2020',
    applied: '20 May 2020',
    status: 'Reject',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 4,
    name: 'Mona Lisa',
    rating: 0.0,
    budget: '50$',
    deadline: '20 May 2020',
    applied: '20 May 2020',
    status: 'Negotiate',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: 5,
    name: 'Mona Lisa',
    rating: 0.0,
    budget: '50$',
    deadline: '20 May 2020',
    applied: '20 May 2020',
    status: 'Rejected',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: 6,
    name: 'Mona Lisa',
    rating: 0.0,
    budget: '50$',
    deadline: '20 May 2020',
    applied: '20 May 2020',
    status: 'Finalized',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  {
    id: 7,
    name: 'Mona Lisa',
    rating: 0.0,
    budget: '50$',
    deadline: '20 May 2020',
    applied: '20 May 2020',
    status: 'Finalized',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
];

const statusColors: Record<string, string> = {
  'Good Fit': 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
  Reject: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
  Negotiate: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
  Rejected: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
  Finalized: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
  Finalist: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
};

/* ---------- Small shared components (in-file) ---------- */
const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className = '', ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    className={`inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 ${className}`}
  >
    {children}
  </button>
));
IconButton.displayName = 'IconButton';

const PlainButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    {...props}
    className={`px-3 py-1 border rounded-md text-sm ${className || 'border-gray-300'}`}
  >
    {children}
  </button>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = '',
  ...props
}) => (
  <input
    {...props}
    className={`border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

/* ---------- Main component ---------- */
const JobApplicants: React.FC = () => {
  const [applicantList, setApplicantList] = useState<Applicant[]>(applicantsData);
  const [activeTab, setActiveTab] = useState<string>('Applicants');
  const [search, setSearch] = useState('');
  const [openActionDropdownId, setOpenActionDropdownId] = useState<number | null>(null);

  // refs for each action wrapper (so outside click can be detected reliably)
  const actionContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (openActionDropdownId !== null) {
        const container = actionContainerRefs.current[openActionDropdownId];
        if (container && !container.contains(target)) {
          setOpenActionDropdownId(null);
        }
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [openActionDropdownId]);

  const tabs = ['Applicants', 'Job Details', 'Updates', 'Chat'];

  const handleStatusChange = (applicantId: number, newStatus: Applicant['status']) => {
    setApplicantList((prev) =>
      prev.map((app) => (app.id === applicantId ? { ...app, status: newStatus } : app))
    );
    setOpenActionDropdownId(null);
  };

  const handleRemove = (applicantId: number) => {
    setApplicantList((prev) => prev.filter((p) => p.id !== applicantId));
    setOpenActionDropdownId(null);
  };

  const filteredApplicants = applicantList.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  if (activeTab === 'Updates') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-[#019ACB] text-[#141414]'
                      : 'border-transparent text-[#8E8E93] hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <Updates />
      </div>
    );
  }

  if (activeTab === 'Chat') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-[#019ACB] text-[#141414]'
                      : 'border-transparent text-[#8E8E93] hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <StudentDocuments />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-[#019ACB] text-[#141414]'
                    : 'border-transparent text-[#8E8E93] hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 text-[#141414]">
            Total Applicants :{' '}
            <span className="font-normal text-gray-600">{applicantList.length}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-10 pr-4 py-2 text-sm w-64 bg-white"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>

          <button className="border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Grid3X3 className="h-4 w-4" /> View
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 h-[60px] text-center text-[#141414]">
                <th className="px-6 py-3 font-medium text-[16px]">Full Name</th>
                <th className="px-6 py-3 font-medium text-[16px]">Rating</th>
                <th className="px-6 py-3 font-medium text-[16px]">Teacher Budget</th>
                <th className="px-6 py-3 font-medium text-[16px]">Teacher Deadline</th>
                <th className="px-6 py-3 font-medium text-[16px]">Applied Date</th>
                <th className="px-6 py-3 font-medium text-[16px]">Selection status</th>
                <th className="px-6 py-3 font-medium text-[16px]">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplicants.map((app) => (
                <tr
                  key={app.id}
                  className="border-b hover:bg-gray-50 group cursor-default h-[80px] text-[16px] text-center text-[#141414]"
                >
                  {/* Name / Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        <img
                          src={app.avatar}
                          alt={app.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="text-xs font-medium text-gray-700">
                          {app.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <Star className="h-4 w-4 text-gray-300 mr-1" />
                      <span className="text-sm text-gray-900">{app.rating}</span>
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.budget}
                  </td>

                  {/* Deadline */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.deadline}
                  </td>

                  {/* Applied */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.applied}
                  </td>

                  {/* Status (badge only) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-[16px] py-[8px] border rounded-[80px] min-w-[84px] text-[14px] text-center  h-[33px] ${statusColors[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Actions (three dots icon opens anchored dropdown) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div
                      className="relative inline-block"
                      ref={(el) => (actionContainerRefs.current[app.id] = el)}
                      onClick={(e) => e.stopPropagation()} // prevent row click when interacting with action cell
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionDropdownId((s) => (s === app.id ? null : app.id));
                        }}
                        aria-haspopup="true"
                        aria-expanded={openActionDropdownId === app.id}
                        aria-label="Actions"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </IconButton>

                      {openActionDropdownId === app.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app.id, 'Good Fit');
                              }}
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <img
                                src={GoodIcon}
                                alt={`goodicon`}
                                className="object-contain w-[20px]  h-[20px] mr-3 transition duration-200"
                              />
                              Good Fit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app.id, 'Good Fit');
                              }}
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <img
                                src={FinalizeIcon}
                                alt={`finalizeicon`}
                                className="object-contain w-[20px]  h-[20px] mr-3 transition duration-200"
                              />
                              Finalise
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(app.id, 'Reject');
                              }}
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <img
                                src={RejectIcon}
                                alt={`rejecticon`}
                                className="object-contain w-[20px]  h-[20px] mr-3 transition duration-200"
                              />
                              Reject
                            </button>

                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              View Profile
                            </button>

                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-4 py-2 text-left text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              Send Message
                            </button>

                            <hr className="my-1" />

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(app.id);
                              }}
                              className="w-full px-4 py-2 text-left text-[14px] text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApplicants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No applicants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-end gap-[10px] px-6 py-4 bg-gray-50 border-t border-gray-200 h-[40px] mt-4">
          <span className="text-[12px] text-gray-500">
            Showing{' '}
            <select className="border border-gray-200 rounded px-2 py-1 text-sm mx-1 bg-white">
              <option>12</option>
              <option>25</option>
              <option>50</option>
            </select>{' '}
            out of {applicantList.length}
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
    </div>
  );
};

export default JobApplicants;
