// // import RequestSessionForm from "../../components/forms/RequestSessionForm";
// import { useState } from 'react';
// import { Button } from '../../components/ui/button';
// import FilterTabs from '../../components/ui/filterTabs';
// import FilterBar from '../../student/components/Filterbar';
// import SessionCard from './components/SessionCard';
// import { useFetch } from '../../api';

// const SessionPage = () => {
//   const [subject, setSubject] = useState('Mathematics');
//   const [startDate, setStartDate] = useState('2024-01-11');
//   const [endDate, setEndDate] = useState('2025-10-14');
//   const handleTabChange = (tab: string) => {
//     console.log('Selected Tab:', tab);
//   };

//   // 🧩 Expanded dummy fallback data for display
//   const sessions = [
//     {
//       _id: 's1',
//       subject: 'Mathematics',
//       topic: 'Algebra Basics',
//       language: 'English',
//       expertiseLevel: 'Beginner',
//       startTime: '2025-10-15T10:00:00Z',
//       endTime: '2025-10-15T11:00:00Z',
//       timezone: 'IST',
//       status: 'budget',
//     },
//     {
//       _id: 's2',
//       subject: 'Science',
//       topic: 'Newton’s Laws of Motion',
//       language: 'English',
//       expertiseLevel: 'Intermediate',
//       startTime: '2025-10-17T09:00:00Z',
//       endTime: '2025-10-17T10:30:00Z',
//       timezone: 'IST',
//       status: 'in-progress',
//     },
//     {
//       _id: 's3',
//       subject: 'Mathematics',
//       topic: 'Trigonometry Advanced',
//       language: 'English',
//       expertiseLevel: 'Advanced',
//       startTime: '2025-09-20T09:00:00Z',
//       endTime: '2025-09-20T10:30:00Z',
//       timezone: 'IST',
//       status: 'completed',
//       rating: 4.8,
//       ratingCount: 82,
//       datePosted: '2025-09-01',
//       dateCreated: '2025-09-05',
//       perHourRate: 500,
//       totalRate: 750,
//       totalHours: 1.5,
//     },
//     {
//       _id: 's4',
//       subject: 'English',
//       topic: 'Grammar Basics',
//       language: 'English',
//       expertiseLevel: 'Beginner',
//       startTime: '2025-10-19T08:00:00Z',
//       endTime: '2025-10-19T09:00:00Z',
//       timezone: 'IST',
//       status: 'budget',
//     },
//     {
//       _id: 's5',
//       subject: 'Science',
//       topic: 'Periodic Table Overview',
//       language: 'English',
//       expertiseLevel: 'Beginner',
//       startTime: '2025-10-20T11:00:00Z',
//       endTime: '2025-10-20T12:00:00Z',
//       timezone: 'IST',
//       status: 'budget',
//     },
//     {
//       _id: 's6',
//       subject: 'Mathematics',
//       topic: 'Probability & Statistics',
//       language: 'English',
//       expertiseLevel: 'Intermediate',
//       startTime: '2025-10-18T14:00:00Z',
//       endTime: '2025-10-18T15:30:00Z',
//       timezone: 'IST',
//       status: 'in-progress',
//     },
//     {
//       _id: 's7',
//       subject: 'Science',
//       topic: 'Electricity and Magnetism',
//       language: 'English',
//       expertiseLevel: 'Advanced',
//       startTime: '2025-10-16T16:00:00Z',
//       endTime: '2025-10-16T17:30:00Z',
//       timezone: 'IST',
//       status: 'in-progress',
//     },
//     {
//       _id: 's8',
//       subject: 'English',
//       topic: 'Essay Writing Skills',
//       language: 'English',
//       expertiseLevel: 'Intermediate',
//       startTime: '2025-09-10T10:00:00Z',
//       endTime: '2025-09-10T11:30:00Z',
//       timezone: 'IST',
//       status: 'completed',
//       rating: 4.5,
//       ratingCount: 55,
//       datePosted: '2025-08-25',
//       dateCreated: '2025-09-01',
//       perHourRate: 400,
//       totalRate: 600,
//       totalHours: 1.5,
//     },
//     {
//       _id: 's9',
//       subject: 'Mathematics',
//       topic: 'Linear Algebra',
//       language: 'English',
//       expertiseLevel: 'Advanced',
//       startTime: '2025-09-25T13:00:00Z',
//       endTime: '2025-09-25T14:30:00Z',
//       timezone: 'IST',
//       status: 'completed',
//       rating: 4.9,
//       ratingCount: 120,
//       datePosted: '2025-09-10',
//       dateCreated: '2025-09-15',
//       perHourRate: 600,
//       totalRate: 900,
//       totalHours: 1.5,
//     },
//     {
//       _id: 's10',
//       subject: 'Science',
//       topic: 'Human Anatomy Basics',
//       language: 'English',
//       expertiseLevel: 'Beginner',
//       startTime: '2025-10-22T09:00:00Z',
//       endTime: '2025-10-22T10:00:00Z',
//       timezone: 'IST',
//       status: 'budget',
//     },
//   ];

//   // const {
//   //   data: sessions = [],
//   //   isLoading,
//   //   error,
//   // } = useFetch<any>(
//   //   ['sessions', subject, startDate, endDate], // react-query key
//   //   `/sessions/by-date?startDate=${startDate}&endDate=${endDate}`,
//   //   true,
//   //   { requiresAuth: true }
//   // );
//   return (
//     <div>
//       {/* Top summary bar */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
//         {/* Left: Title */}
//         <div className="text-[22px] text-black font-poppinssemibold">My Sessions</div>

//         {/* Right: Request Box */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
//           <div>
//             <h2 className="text-[14px] sm:text-[16px] font-poppinssemibold text-gray-900">
//               Request New Sessions
//             </h2>
//             <p className="text-[11px] font-poppinsregular text-gray-400">
//               Fill the form to request an Sessions
//             </p>
//           </div>

//           <Button
//             className="py-2 px-4 m-0 text-[16px] font-poppinsmedium"
//             variant="outline_rounded"
//           >
//             Request
//           </Button>
//         </div>
//       </div>

//       <div></div>
//       <FilterTabs
//         tabs={['ALL', 'Requested', 'In Progress', 'Completed', 'Rejected']}
//         defaultTab="Assignments"
//         onTabChange={handleTabChange}
//       />

//       {/* Main grid layout */}
//       <div className="bg-white mt-2 md:h-[706px] h-full scrollbar-thin rounded-md  md:overflow-y-scroll overflow-none py-2 mb-2">
//         <div className=" px-4 mx-auto">
//           <FilterBar
//             selectedOption={subject}
//             onSubjectChange={setSubject}
//             startDate={startDate}
//             endDate={endDate}
//             onDateChange={(type, value) =>
//               type === 'start' ? setStartDate(value) : setEndDate(value)
//             }
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {isLoading && <p>Loading...</p>}
//             {error && <p className="text-red-500">Error loading sessions</p>}
//             {sessions?.map((session: any) => {
//               const start = new Date(session.startTime);
//               const end = new Date(session.endTime);
//               return (
//                 <SessionCard
//                   key={session._id}
//                   title={`${session.subject} - ${session.topic}`}
//                   subtitle={`Language: ${session.language}, Level: ${session.expertiseLevel}`}
//                   status={session.status || 'budget'} // if you have a status in API
//                   datetime={`${start.toLocaleDateString()} ${start.toLocaleTimeString()} – ${end.toLocaleTimeString()}`}
//                   timezone={`(${session.timezone})`}
//                   timeNote="Starting soon" // you can calculate exact difference
//                   ctaType="join" // or reschedule, recordings, etc. depending on status
//                   sessionId={session._id}
//                   onClick={() => alert(`Joining ${session.topic}`)}
//                 />
//               );
//             })}
//           </div>

//           <div className="flex font-poppinssemibold text-[13px] justify-center text-primary">
//             <Button variant="ghost">See More</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SessionPage;


import { useState } from 'react';
import { Button } from '../../components/ui/button';
import FilterBar from '../../student/components/Filterbar';
import { ArrowRight, CalendarRange, Video, DollarSign, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const SessionPage = () => {
  const [subject, setSubject] = useState('Mathematics');
  const [startDate, setStartDate] = useState('2024-01-11');
  const [endDate, setEndDate] = useState('2025-10-14');
  const [activeTab, setActiveTab] = useState('Upcoming');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const sessions = [
    { _id: 's1', subject: 'Mathematics', topic: 'Algebra Basics', language: 'English', expertiseLevel: 'Beginner', startTime: '2025-10-15T10:00:00Z', endTime: '2025-10-15T11:00:00Z', timezone: 'IST', status: 'upcoming' },
    { _id: 's2', subject: 'Science', topic: 'Newton’s Laws of Motion', language: 'English', expertiseLevel: 'Intermediate', startTime: '2025-10-17T09:00:00Z', endTime: '2025-10-17T10:30:00Z', timezone: 'IST', status: 'requested' },
    { _id: 's3', subject: 'Mathematics', topic: 'Trigonometry Advanced', language: 'English', expertiseLevel: 'Advanced', startTime: '2025-09-20T09:00:00Z', endTime: '2025-09-20T10:30:00Z', timezone: 'IST', status: 'completed', rating: 4.8, ratingCount: 82, datePosted: '2025-09-01', dateCreated: '2025-09-05', perHourRate: 500, totalRate: 750, totalHours: 1.5 },
    { _id: 's4', subject: 'English', topic: 'Grammar Basics', language: 'English', expertiseLevel: 'Beginner', startTime: '2025-10-19T08:00:00Z', endTime: '2025-10-19T09:00:00Z', timezone: 'IST', status: 'upcoming' },
    { _id: 's5', subject: 'Science', topic: 'Periodic Table Overview', language: 'English', expertiseLevel: 'Beginner', startTime: '2025-10-20T11:00:00Z', endTime: '2025-10-20T12:00:00Z', timezone: 'IST', status: 'upcoming' },
    { _id: 's6', subject: 'Mathematics', topic: 'Probability & Statistics', language: 'English', expertiseLevel: 'Intermediate', startTime: '2025-10-18T14:00:00Z', endTime: '2025-10-18T15:30:00Z', timezone: 'IST', status: 'requested' },
    { _id: 's7', subject: 'Science', topic: 'Electricity and Magnetism', language: 'English', expertiseLevel: 'Advanced', startTime: '2025-10-16T16:00:00Z', endTime: '2025-10-16T17:30:00Z', timezone: 'IST', status: 'requested' },
    { _id: 's8', subject: 'English', topic: 'Essay Writing Skills', language: 'English', expertiseLevel: 'Intermediate', startTime: '2025-09-10T10:00:00Z', endTime: '2025-09-10T11:30:00Z', timezone: 'IST', status: 'completed', rating: 4.5, ratingCount: 55, datePosted: '2025-08-25', dateCreated: '2025-09-01', perHourRate: 400, totalRate: 600, totalHours: 1.5 },
    { _id: 's9', subject: 'Mathematics', topic: 'Linear Algebra', language: 'English', expertiseLevel: 'Advanced', startTime: '2025-09-25T13:00:00Z', endTime: '2025-09-25T14:30:00Z', timezone: 'IST', status: 'completed', rating: 4.9, ratingCount: 120, datePosted: '2025-09-10', dateCreated: '2025-09-15', perHourRate: 600, totalRate: 900, totalHours: 1.5 },
    { _id: 's10', subject: 'Science', topic: 'Human Anatomy Basics', language: 'English', expertiseLevel: 'Beginner', startTime: '2025-10-22T09:00:00Z', endTime: '2025-10-22T10:00:00Z', timezone: 'IST', status: 'upcoming' },
  ];

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'Upcoming') return s.status === 'upcoming';
    if (activeTab === 'Requested') return s.status === 'requested';
    if (activeTab === 'Completed') return s.status === 'completed';
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
        <div className="text-[22px] text-black font-poppinssemibold">My Sessions</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
          <div>
            <h2 className="text-[14px] sm:text-[16px] font-poppinssemibold text-gray-900">Request New Sessions</h2>
            <p className="text-[11px] font-poppinsregular text-gray-400">Fill the form to request a Session</p>
          </div>
          <Button className="py-2 px-4 m-0 text-[16px] font-poppinsmedium" variant="outline_rounded">Request</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {['Upcoming', 'Requested', 'Completed'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-poppinsmedium ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedOption={subject}
        onSubjectChange={setSubject}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(type, value) => (type === 'start' ? setStartDate(value) : setEndDate(value))}
      />

      {/* Session Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredSessions.map((session) => {
          const start = new Date(session.startTime);
          const end = new Date(session.endTime);
          const isCompleted = session.status === 'completed';
          console.log('isCompleted : ', isCompleted);

          return (
            <div key={session._id} className="w-full border rounded-lg shadow-sm p-4 bg-white">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-poppinssemibold text-[#212121] text-[18px]">{`${session.subject} - ${session.topic}`}</h3>
                  <p className="text-[14px] mt-1 font-poppinsregular">
                    <span className={`${isCompleted ? 'text-[#707070]' : 'text-[#DDA31E]'}`}>
                      {isCompleted ? 'Completed' : 'Scheduled'}
                    </span>
                    <span className="text-[#9197B3]"> • Language: {session.language}, Level: {session.expertiseLevel}</span>
                  </p>
                </div>
                <Link to={`/student/session/${session._id}`}>
                  <ArrowRight className="text-[#00A5EC] w-[24px] h-[24px] mt-1 cursor-pointer" />
                </Link>
              </div>

              {/* Body */}
              <div className="mt-4 bg-[#E9F8FE] rounded-lg px-4 py-3 flex flex-col gap-4">
                {isCompleted ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CalendarRange className="w-5 h-5 text-[#00A5EC]" />
                        <div>
                          <p className="text-[14px] font-poppinssemibold text-[#212121]">Date Posted</p>
                          <p className="text-[13px] text-[#707070]">{session.datePosted || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Video className="w-5 h-5 text-[#00A5EC]" />
                        <div>
                          <p className="text-[14px] font-poppinssemibold text-[#212121]">Date Created</p>
                          <p className="text-[13px] text-[#707070]">{session.dateCreated || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <DollarSign className="w-5 h-5 text-[#00A5EC]" />
                        <div>
                          <p className="text-[14px] font-poppinssemibold text-[#212121]">Per Hour</p>
                          <p className="text-[13px] text-[#707070]">{session.perHourRate ? `₹${session.perHourRate}` : 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-[#00A5EC]" />
                        <div>
                          <p className="text-[14px] font-poppinssemibold text-[#212121]">Total Rate</p>
                          <p className="text-[13px] text-[#707070]">{session.totalRate ? `₹${session.totalRate}` : 'N/A'} {session.totalHours ? `• ${session.totalHours} hrs` : ''}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#FD8E1F] text-[16px] font-semibold">
                      <Star className="w-[16px] h-[16px] fill-[#FD8E1F]" />
                      <span>{session.rating || 'N/A'}</span>
                      <span className="ml-1 text-[12px] text-[#9197B3]">({session.ratingCount?.toLocaleString() || 0} Ratings)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[18px] font-poppinssemibold text-[#212121]">{`${start.toLocaleDateString()} ${start.toLocaleTimeString()} – ${end.toLocaleTimeString()}`}</p>
                    <p className="text-[14px] font-poppinsregular text-[#111111]">({session.timezone})</p>
                    <p className="text-[14px] font-poppinsregular text-[#9197B3] mt-1">Starting soon</p>
                  </>
                )}

                {/* CTA Button */}
                <div className="flex justify-end">
                  <button className="border w-[160px] border-primary px-4 py-[9px] rounded-full text-[14px] font-poppinsmedium bg-primary text-white whitespace-nowrap">
                    {isCompleted ? 'View Recordings' : 'Join Now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionPage
