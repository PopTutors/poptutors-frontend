import React, { useState } from 'react';
import { Search, Filter, FileText, CheckCircle, User, Pencil } from 'lucide-react';
import { OpenIcon } from '../../assets/managers';

type Teacher = {
  id: number;
  name: string;
  location: string;
  type: string;
  price: string;
  total: string;
};

type Update = {
  id: number;
  teacher: string;
  location: string;
  type: string;
  actionTaker: string;
  action: string;
  actionColorClass: string;
  date: string;
  time: string;
};

export default function Updates(): JSX.Element {
  const [sendTo, setSendTo] = useState<'teacher' | 'student'>('teacher');
  const [priceToTeacher, setPriceToTeacher] = useState('');
  const [priceToStudent, setPriceToStudent] = useState('');
  const [search, setSearch] = useState('');

  const teachers: Teacher[] = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: 'Mona Lisa',
    location: 'Paris, France',
    type: 'Full-Time',
    price: '$10 (5%)',
    total: '$15',
  }));

  const recentUpdates: Update[] = [
    {
      id: 1,
      teacher: 'Mona Lisa',
      location: 'Paris, France',
      type: 'Full-Time',
      actionTaker: 'Manager',
      action: 'M! Submitted',
      actionColorClass: 'bg-yellow-100 text-yellow-800',
      date: '2024-09-25',
      time: '11:00 AM',
    },
    {
      id: 2,
      teacher: 'Mona Lisa',
      location: 'Paris, France',
      type: 'Full-Time',
      actionTaker: 'Student',
      action: 'Accepted',
      actionColorClass: 'bg-green-100 text-green-800',
      date: '2024-09-25',
      time: '11:00 AM',
    },
    {
      id: 3,
      teacher: 'Mona Lisa',
      location: 'Paris, France',
      type: 'Full-Time',
      actionTaker: 'Manager',
      action: 'Applied',
      actionColorClass: 'bg-blue-100 text-blue-800',
      date: '2024-09-25',
      time: '11:00 AM',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Negotiation Details (top) + Recent Updates (bottom) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Negotiation Details */}
            <section className="bg-white shadow-sm border border-gray-100 p-6 max-h-fit">
              <h2 className="text-lg font-semibold mb-4">Negotiations Details</h2>
              {/* Profile row */}
              <div className="flex items-center justify-between my-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {/* replace src with actual image */}
                    <img
                      src="/professional-headshot.png"
                      alt="Charles agley"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium text-gray-600">CA</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Charles agley</h3>
                    <p className="text-sm text-gray-500">Education Specialist</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4" />
                  View profile
                </button>
              </div>
              <div className="border-b border-gray-200 mx-2 my-4"></div>
              {/* Price blocks */}
              <div className="grid grid-cols-3 gap-6 mt-6">
                {/* Teacher Price */}
                <div className="border-r border-gray-200 last:border-r-0">
                  <div className="flex items-start justify-between px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">$25</span>
                      <p className="text-sm text-gray-500 mt-1">Teacher Price</p>
                    </div>
                    <button className="p-1 rounded-md border border-gray-100 hover:bg-gray-50 self-start">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Student Price */}
                <div className="border-r border-gray-200 last:border-r-0">
                  <div className="flex items-start justify-between px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">$25</span>
                      <p className="text-sm text-gray-500 mt-1">Student Price</p>
                    </div>
                    <button className="p-1 rounded-md border border-gray-100 hover:bg-gray-50 self-start">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Profit */}
                <div className="border-r border-gray-200 last:border-r-0">
                  <div className="flex items-start justify-between px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-cyan-600">$10 (5%)</span>
                      <p className="text-sm text-gray-500 mt-1">Profit</p>
                    </div>
                    <button className="p-1 rounded-md border border-gray-100 hover:bg-gray-50 self-start">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-[16px] font-medium text-gray-700 mb-2">
                    Enter price and send to Teacher
                  </label>
                  <input
                    value={priceToTeacher}
                    onChange={(e) => setPriceToTeacher(e.target.value)}
                    placeholder="Enter price"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-medium text-gray-700 mb-2">
                    Enter price and send to Student
                  </label>
                  <input
                    value={priceToStudent}
                    onChange={(e) => setPriceToStudent(e.target.value)}
                    placeholder="Enter price"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                </div>
              </div>
              {/* Send options */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-6">
                  <span className="text-[20px] font-medium">Send to:</span>
                  <label className={`flex items-center gap-2 cursor-pointer`}>
                    <input
                      type="radio"
                      name="sendTo"
                      value="teacher"
                      checked={sendTo === 'teacher'}
                      onChange={() => setSendTo('teacher')}
                      className="w-4 h-4 text-cyan-600 accent-cyan-600"
                    />
                    <span className="text-sm">Teacher</span>
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer`}>
                    <input
                      type="radio"
                      name="sendTo"
                      value="student"
                      checked={sendTo === 'student'}
                      onChange={() => setSendTo('student')}
                      className="w-4 h-4 text-cyan-600 accent-cyan-600"
                    />
                    <span className="text-sm">Student</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-[#019ACB] hover:bg-[#019ACB]-600 text-white text-sm">
                    Send Offer
                  </button>
                </div>
              </div>
            </section>
            {/* Recent Updates */}
            <section className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Updates</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="pl-10 pr-3 py-2 rounded-md border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      aria-label="Search updates"
                    />
                  </div>
                  <button className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="border-b">
                      <th className="px-6 py-3 font-medium text-[16px] text-left">Teacher</th>
                      <th className="px-6 py-3 font-medium text-[16px]">Action Taker</th>
                      <th className="px-6 py-3 font-medium text-[16px]">Action</th>
                      <th className="px-6 py-3 font-medium text-[16px]">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentUpdates
                      .filter((u) => u.teacher.toLowerCase().includes(search.toLowerCase()))
                      .map((u) => (
                        <tr
                          key={u.id}
                          className="border-b hover:bg-gray-50 group cursor-pointer h-[80px] text-[16px] text-center text-[#141414]"
                        >
                          <td className="py-4 px-4 align-top">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-left">
                                <img
                                  src="/teacher-profile.png"
                                  alt={u.teacher}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                                <span className="text-xs text-gray-600 ">ML</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-left">{u.teacher}</p>
                                <p className="text-xs text-gray-500 text-left">
                                  {u.location} • {u.type}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm align-top">{u.actionTaker}</td>
                          <td className="py-4 px-4 align-top">
                            <span
                              className={`${u.actionColorClass} inline-block px-3 py-1 text-xs rounded-full font-medium`}
                            >
                              {u.action}
                            </span>
                          </td>
                          <td className="py-4 px-4 align-top text-sm">
                            <div>
                              <p>{u.date}</p>
                              <p className="text-gray-500">{u.time}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          {/* Right column: Teachers (top) + Stats (bottom) */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Teachers */}
            <aside className="bg-white shadow-sm border border-gray-100 p-6 max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Teachers</h3>
                <button className="text-cyan-600 text-sm">View all</button>
              </div>
              <div className="space-y-3">
                {teachers.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src="/teacher-profile.png"
                          alt={t.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="text-xs text-gray-600">ML</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-gray-500">
                          {t.location} • {t.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-600 text-sm font-medium">{t.price}</div>
                      <div className="text-sm font-bold ml-1">{t.total}</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            {/* Stats */}
            <aside className="space-y-4">
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded">
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">45</p>{' '}
                      <p className="text-sm text-[#8E8E93]">|</p>
                      <p className="text-sm text-[#8E8E93]">Complete Submissions</p>
                    </div>
                  </div>
                  <div className="cursor-pointer">
                    <img src={OpenIcon} />
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-sm text-[#8E8E93]">|</p>
                      <p className="text-sm text-[#8E8E93]">Student Documents</p>
                    </div>
                  </div>

                  <div className="cursor-pointer">
                    <img src={OpenIcon} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
