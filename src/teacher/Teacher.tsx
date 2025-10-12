import { useMemo, useState } from "react";
import { DollarSign, GraduationCap, FileTextIcon, Video, NotebookPen, Clock, CalendarRange } from "lucide-react";
import { useFetch } from "../api";

// Dummy Data
const dummyAssignments = [
  { _id: "a1", title: "The Impact of Social Media on Teen Communication", deadline: "2025-08-12" },
  { _id: "a2", title: "History Essay", deadline: "2025-08-15" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
  { _id: "a3", title: "Science Project", deadline: "2025-08-18" },
];

const dummyExams = [
  { id: 1, title: "Math Study Group", time: "Today at 10:00 AM", actionLabel: "Join Now" },
  { id: 2, title: "History Project Discussion", time: "Today at 2:00 PM", actionLabel: "Reschedule" },
  { id: 3, title: "Science Revision", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Revision", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Revision", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Revision", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Revision", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
];

const dummySessions = [
  { id: 1, title: "Math Study Group", time: "Today at 10:00 AM", actionLabel: "Join Now" },
  { id: 2, title: "History Project Discussion", time: "Today at 2:00 PM", actionLabel: "Reschedule" },
  { id: 3, title: "Science Doubt Clearing", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Doubt Clearing", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Doubt Clearing", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Doubt Clearing", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Doubt Clearing", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
  { id: 3, title: "Science Doubt Clearing", time: "Tomorrow at 11:00 AM", actionLabel: "Join Now" },
];

const dummyRatings = { value: 4.6, total: 311, breakdown: [157, 40, 20, 10, 5] };

const dummyMessages = [
  { id: 1, user: "Kevin", text: 'sent you message "What is UX in 2024 ui/ux design with figma"', time: "Just now" },
  { id: 2, user: "John", text: "gave a 5 star rating on your course", time: "Just now" },
  { id: 3, user: "Fiyon", text: 'sent you message "What is UX in 2024 ui/ux design with figma"', time: "Just now" },
];

export default function Teacher() {

  const { data: assignments = [] } = useFetch<any>(
    ['assignments'],
    '/dashboard/assignments',
    true,
    { requiresAuth: true }
  );
  const stats = useMemo(
    () => [
      { id: 1, label: "Completed Assignments", value: 257, icon: <FileTextIcon className="w-5 h-5" />, color: "bg-[#FFDFE2]" },
      { id: 2, label: "Completed Sessions", value: 25, icon: <Video className="w-4 h-4" />, color: "bg-[#FFE5DF]" },
      { id: 3, label: "Completed Exams", value: 20, icon: <NotebookPen className="w-4 h-4" />, color: "bg-[#EDE4FF]" },
      { id: 4, label: "Students", value: 1674, icon: <GraduationCap className="w-4 h-4" />, color: "bg-[#DDECFF]" },
      { id: 5, label: "USD Total Earning", value: "$7,461", icon: <DollarSign className="w-4 h-4" />, color: "bg-[#EAE0FF]" },
    ],
    []
  );

  const [filters, setFilters] = useState({
    assignments: "ALL",
    exams: "ALL",
    sessions: "ALL",
  });

  const handleFilterChange = (section: string, value: string) => {
    setFilters((prev) => ({ ...prev, [section]: value }));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((s) => (
            <div key={s.id} className={`p-5 ${s.color} flex flex-col`}>
              <div className="flex items-center justify-between w-full">
                <div className="text-2xl font-bold">{s.value}</div>
                <div>{s.icon}</div>
              </div>
              <div className="text-sm text-black mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Profile Summary */}
        <div className="bg-white border border-black/10 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/100"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-xl sm:text-xl text-lg uppercase">
                    JHON DOE ROBOT
                  </h2>
                  {/* Verified badge shown beside name on medium+ screens */}
                  <span className="hidden sm:inline-block px-2 py-0.5 text-xs border-2 border-dotted rounded-full border-green-500 text-green-600">
                    Verified
                  </span>
                </div>
                <p className="text-gray-500 text-sm">JhonDoe@gmail.com</p>
                {/* Verified badge shown below email on small screens */}
                <span className="sm:hidden px-2 py-0.5 text-xs border-2 border-dotted rounded-full border-green-500 text-green-600 mt-1">
                  Verified
                </span>
              </div>
            </div>

            {/* Complete Profile Button */}
            <div className="sm:mt-0 mt-3">
              <button className="bg-[#019ACB] text-white px-4 py-2 text-sm font-medium w-full sm:w-auto">
                Complete Profile
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">1/5 steps completed</span>
              <span className="font-bold text-2xl">20%</span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full">
              <div
                className="bg-[#019ACB] h-4 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2x2 Grid Section */}
        <div className="grid md:grid-cols-2 gap-6 min-h-0">
          {/* ✅ Ongoing Assignments Section */}
          <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col min-h-0">
            <div className="flex justify-between items-center w-full mb-5">
              <h2 className="font-semibold text-xl">Ongoing Assignments</h2>
              <div className="relative">
                <select
                  value={filters.assignments}
                  onChange={(e) => handleFilterChange("assignments", e.target.value)}
                  className="appearance-none w-full px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 uppercase tracking-wide bg-white"
                >
                  <option value="ALL">ALL</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                </select>
                <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Scrollable Assignments List */}
            <div className="flex-1 overflow-y-auto pr-3 space-y-4 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full min-h-0">
              {dummyAssignments.slice(0, 3).map((a) => (
                <div key={a._id} className="flex flex-col border-b border-gray-200 pb-3 px-3">
                  <div className="flex items-center space-x-3 mb-1">
                    <FileTextIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <p className="font-semibold text-base">{a.title}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-2 ml-[28px]">Assignment ID: {a._id} | Deadline:{" "}
                    {new Date(a.deadline).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                  <div className="ml-[28px]">
                    <button className="text-[#019ACB] text-sm font-semibold">View details →</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-5">
              <button className="text-[#019ACB] px-6 py-2 font-medium">View More</button>
            </div>
          </div>

          {/* ✅ Right Column: Exams + Sessions */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Upcoming Exam-help */}
            <div className="bg-white border border-gray-300 shadow-sm p-5 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-lg">Upcoming Exam-help</h2>
                <div className="relative">
                  <select
                    value={filters.assignments}
                    onChange={(e) => handleFilterChange("assignments", e.target.value)}
                    className="appearance-none w-full px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 uppercase tracking-wide bg-white"
                  >
                    <option value="ALL">ALL</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                  </select>
                  <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-3 space-y-3 min-h-0">
                {dummyExams.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-row items-start p-3 gap-3 bg-[#E5F6FF] shadow-sm w-full"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CalendarRange className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                      <span className="text-base text-black font-semibold">{e.title}</span>
                      <div className="flex items-center mt-1 gap-1 text-xs text-gray-700 font-normal">
                        <span>Today at 10:30 AM | 3 Hrs Left</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <button className="bg-[#019ACB] text-white px-3 py-1 rounded-none text-sm">
                        {e.actionLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white border border-gray-300 shadow-sm p-5 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-lg">Upcoming Sessions</h2>
                <div className="relative">
                  <select
                    value={filters.assignments}
                    onChange={(e) => handleFilterChange("assignments", e.target.value)}
                    className="appearance-none w-full px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 uppercase tracking-wide bg-white"
                  >
                    <option value="ALL">ALL</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                  </select>
                  <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-3 space-y-3 min-h-0">
                {dummySessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-row items-start p-3 gap-3 bg-[#E5F6FF] shadow-sm w-full"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CalendarRange className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="text-base text-black font-semibold">{s.title}</span>
                        <button className="bg-[#019ACB] text-white px-3 py-1 rounded-none text-sm">
                          {s.actionLabel}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700 font-normal mt-1">
                        <Clock className="w-4 h-4 text-black" />
                        <span>{s.time} | 3 Hrs Left</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Ratings + Messages */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-300 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-800">Ratings</h2>

              {/* Dropdown Filter */}
              <div className="relative w-40">
                <select
                  value={filters.assignments}
                  onChange={(e) => handleFilterChange("assignments", e.target.value)}
                  className="appearance-none w-full px-2 py-2 border border-gray-300 text-sm font-medium text-gray-700 uppercase tracking-wide bg-white"
                >
                  <option value="ALL">Assignment</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                </select>
                <svg
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Ratings Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Average Rating Box */}
              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 p-6">
                <div className="text-5xl font-bold text-gray-800">{dummyRatings.value}</div>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${i < Math.floor(dummyRatings.value) ? "text-orange-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-2">{dummyRatings.total} Review</div>
              </div>

              {/* Right - Rating Breakdown */}
              <div className="flex flex-col justify-center gap-3">
                {dummyRatings.breakdown.map((count, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-800 w-12">{5 - index} Star</span>
                    <div className="flex-1 h-3 bg-gray-200 rounded-sm overflow-hidden">
                      <div
                        className="h-3 bg-gray-400"
                        style={{ width: `${(count / dummyRatings.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-blue-500 cursor-pointer hover:underline">( {count} )</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ Recent Messages Section */}
          <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Recent Messages</h2>
              <button className="text-[#019ACB] font-medium">View All</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {dummyMessages.map((msg, index) => {
                const colors = ["#019ACB", "#F97316", "#22C55E", "#E11D48", "#8B5CF6", "#0EA5E9", "#A16207"];
                const bgColor = colors[index % colors.length];

                return (
                  <div key={msg.id} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: bgColor }}
                    >
                      {msg.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{msg.user}</span>
                      <span className="text-sm text-gray-500">{msg.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// import { useMemo, useState } from "react";
// import { DollarSign, GraduationCap, FileTextIcon, Video, NotebookPen, Clock, CalendarRange } from "lucide-react";
// import { useFetch } from "../api";
// import dayjs from "dayjs";
// import { MessageIcon } from "../assets";

// export default function Teacher() {
//   // -------------------- API Calls --------------------
//   const { data: assignments = [] } = useFetch<any>(
//     ['assignments'],
//     '/dashboard/assignments',
//     true,
//     { requiresAuth: true }
//   );

//   const { data: sessions = [] } = useFetch<any>(
//     ['sessions'],
//     '/dashboard/sessions',
//     true,
//     { requiresAuth: true }
//   );

//   const { data: upcomingExams = [] } = useFetch<any>(
//     ['upcoming-exams'],
//     '/dashboard/upcoming',
//     true,
//     { requiresAuth: true }
//   );

//   const { data: notifications = [] } = useFetch<any>(
//     ['notifications'],
//     '/notifications/alerts',
//     true,
//     { requiresAuth: true }
//   );

//   // Map notifications for display
//   const mappedNotifications = notifications?.map((alert: any, index: number) => {
//     const colors = ["#019ACB", "#F97316", "#22C55E", "#E11D48", "#8B5CF6", "#0EA5E9", "#A16207"];
//     const bgColor = colors[index % colors.length];

//     return {
//       id: alert.id || index,
//       user: alert.from === "system" ? "System" : alert.from,
//       text: alert.description,
//       time: dayjs(alert.createdAt).format("DD MMM YYYY, hh:mm A"),
//       bgColor,
//       icon: MessageIcon,
//       type: alert.type || "alert",
//     };
//   });

//   // -------------------- Stats --------------------
//   const stats = useMemo(
//     () => [
//       { id: 1, label: "Completed Assignments", value: assignments.length, icon: <FileTextIcon className="w-5 h-5" />, color: "bg-[#FFDFE2]" },
//       { id: 2, label: "Completed Sessions", value: sessions.length, icon: <Video className="w-4 h-4" />, color: "bg-[#FFE5DF]" },
//       { id: 3, label: "Completed Exams", value: upcomingExams.length, icon: <NotebookPen className="w-4 h-4" />, color: "bg-[#EDE4FF]" },
//       { id: 4, label: "USD Total Earning", value: "$7,461", icon: <DollarSign className="w-4 h-4" />, color: "bg-[#EAE0FF]" },
//     ],
//     [assignments, sessions, upcomingExams]
//   );

//   const [filters, setFilters] = useState({
//     assignments: "ALL",
//     exams: "ALL",
//     sessions: "ALL",
//   });

//   const handleFilterChange = (section: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [section]: value }));
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* -------------------- Stats Row -------------------- */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {stats.map((s) => (
//           <div key={s.id} className={`p-5 ${s.color} flex flex-col`}>
//             <div className="flex items-center justify-between w-full">
//               <div className="text-2xl font-bold">{s.value}</div>
//               <div>{s.icon}</div>
//             </div>
//             <div className="text-sm text-black mt-1">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* -------------------- Profile Summary -------------------- */}
//       <div className="bg-white border border-black/10 shadow-sm p-6 flex flex-col gap-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <img
//               src="https://i.pravatar.cc/100"
//               alt="Profile"
//               className="w-16 h-16 rounded-full object-cover"
//             />
//             <div className="flex flex-col">
//               <div className="flex items-center gap-2">
//                 <h2 className="font-bold text-xl sm:text-xl text-lg uppercase">
//                   JHON DOE ROBOT
//                 </h2>
//                 <span className="hidden sm:inline-block px-2 py-0.5 text-xs border-2 border-dotted rounded-full border-green-500 text-green-600">
//                   Verified
//                 </span>
//               </div>
//               <p className="text-gray-500 text-sm">JhonDoe@gmail.com</p>
//               <span className="sm:hidden px-2 py-0.5 text-xs border-2 border-dotted rounded-full border-green-500 text-green-600 mt-1">
//                 Verified
//               </span>
//             </div>
//           </div>

//           <div className="sm:mt-0 mt-3">
//             <button className="bg-[#019ACB] text-white px-4 py-2 text-sm font-medium w-full sm:w-auto">
//               Complete Profile
//             </button>
//           </div>
//         </div>

//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-gray-600 text-sm">1/5 steps completed</span>
//             <span className="font-bold text-2xl">20%</span>
//           </div>
//           <div className="w-full bg-gray-200 h-4 rounded-full">
//             <div
//               className="bg-[#019ACB] h-4 rounded-full"
//               style={{ width: "20%" }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* -------------------- 2x2 Grid: Assignments + Exams/Sessions -------------------- */}
//       <div className="grid md:grid-cols-2 gap-6 h-full p-3">
//         {/* Ongoing Assignments */}
//         <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col h-full">
//           <div className="flex justify-between items-center w-full mb-5">
//             <h2 className="font-semibold text-xl">Ongoing Assignments</h2>
//             <div className="relative">
//               <select
//                 value={filters.assignments}
//                 onChange={(e) => handleFilterChange("assignments", e.target.value)}
//                 className="appearance-none w-full px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 uppercase tracking-wide bg-white"
//               >
//                 <option value="ALL">ALL</option>
//                 <option value="COMPLETED">COMPLETED</option>
//                 <option value="PENDING">PENDING</option>
//                 <option value="IN_PROGRESS">IN PROGRESS</option>
//               </select>
//               <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto pr-3 space-y-4 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full"
//             style={{ scrollbarWidth: "thin", scrollbarColor: "#4c525c #e5e7eb", maxHeight: "calc(100% - 5rem)" }}>
//             {assignments.slice(0, 5).map((a: any) => (
//               <div key={a._id} className="flex flex-col border-b border-gray-200 pb-3 px-3">
//                 <div className="flex items-center space-x-3 mb-1">
//                   <FileTextIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
//                   <p className="font-semibold text-base">{a.metadata?.title || a.title}</p>
//                 </div>
//                 <p className="text-sm text-gray-500 mb-2 ml-[28px]">
//                   Assignment ID: {a._id} | Deadline:{" "}
//                   {a.deadline ? dayjs(a.deadline).format("DD MMM YYYY") : "N/A"}
//                 </p>
//                 <div className="ml-[28px]">
//                   <button className="text-[#019ACB] text-sm font-semibold">View details →</button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-center mt-5">
//             <button className="text-[#019ACB] px-6 py-2 font-medium">View More</button>
//           </div>
//         </div>

//         {/* Exams + Sessions */}
//         <div className="flex flex-col justify-between gap-4 h-full">
//           {/* Upcoming Exam-help */}
//           <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-lg">Upcoming Exam-help</h2>
//               <select
//                 value={filters.exams}
//                 onChange={(e) => handleFilterChange("exams", e.target.value)}
//                 className="appearance-none px-3 py-1 border border-gray-300 text-sm font-medium text-gray-700 uppercase tracking-wide bg-white"
//               >
//                 <option value="ALL">ALL</option>
//                 <option value="COMPLETED">COMPLETED</option>
//                 <option value="PENDING">PENDING</option>
//               </select>
//             </div>

//             <div className="flex-1 overflow-y-auto pr-3 space-y-4 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
//               {upcomingExams.slice(0, 5).map((e: any) => (
//                 <div key={e._id} className="flex items-start gap-3 border-b border-gray-200 pb-2">
//                   <CalendarRange className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-semibold text-base">{e.title}</p>
//                     <p className="text-gray-500 text-sm mt-1">Date: {dayjs(e.date).format("DD MMM YYYY")}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Notifications */}
//           <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-lg">Notifications</h2>
//             </div>

//             <div className="flex-1 overflow-y-auto pr-3 space-y-4 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
//               {mappedNotifications.slice(0, 5).map((n) => (
//                 <div key={n.id} className="flex items-start gap-3 border-b border-gray-200 pb-2">
//                   <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: n.bgColor }}>
//                     <n.icon className="w-4 h-4 text-white" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-base">{n.user}</p>
//                     <p className="text-gray-500 text-sm mt-1">{n.text}</p>
//                     <span className="text-xs text-gray-400">{n.time}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
