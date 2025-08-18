import { ChevronDown, Pencil, Tv, Video } from 'lucide-react';
import { useFetch } from '../api';
import TransactionTable from '../components/ui/cards/transactionTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown';
import type { TransactionType } from '../types/course';
import TabHeader from './components/Tabs';
import { paths } from '../config/path';
import { useNavigate } from 'react-router-dom';
import CourseCard from './components/CourseCard';
import NotificationList from '../components/ui/cards/notificationList';
import UpcommingExamCard from './components/UpcommingExamCard';
import { useState } from 'react';
import { MessageIcon } from '../assets';
import dayjs from 'dayjs';

const transaction: TransactionType[] = [
  { id: 't1', date: '21 Dec, 2021', amount: '534', status: 'Pending' },
  { id: 't2', date: '21 Sep, 2021', amount: '99', status: 'Pending' },
  { id: 't3', date: '21 Sep, 2021', amount: '202', status: 'Completed' },
];

const upcommingExams = [
  {
    title: 'Social Media Course Lorem Ipsum Dolor',
    time: '11 PM - 12 PM',
    status: 'Starting in 2 Hrs',
    actionLabel: 'Reschedule',
  },
  {
    title: 'Social Media Course Lorem Ipsum Dolor',
    time: '11 PM - 12 PM',
    status: 'Starting in 20 Mins',
    actionLabel: 'Join Now',
  },
];

// const sampleNotifications = [
//   {
//     user: 'Kevin',
//     message: 'sent you message',
//     action: 'What is ux',
//     course: '2024 ui/ux design with figma',
//     time: 'Just now',
//     icon: MessageIcon,
//     type: 'message',
//   },
//   {
//     user: 'John',
//     message: 'give a 5 star rating on your assignment',
//     course: '2024 ui/ux design with figma',
//     time: '5 mins ago',
//     icon: RattingIcon,
//     type: 'rating',
//   },
//   {
//     user: 'Kevin',
//     message: 'sent you message',
//     action: 'What is ux',
//     course: '2024 ui/ux design with figma',
//     time: '6 mins ago',
//     icon: NotificationIcon,
//     type: 'message',
//   },
// ];

const options = [
  { label: 'Assignment', icon: <Pencil className="w-4 h-4 mr-2" /> },
  { label: 'Live Sessions', icon: <Video className="w-4 h-4 mr-2" /> },
  { label: 'Live Question', icon: <Tv className="w-4 h-4 mr-2" /> },
];

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('All');
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || 'User';

  const enableAll = selectedTab === 'All';
  const enableAssignments = selectedTab === 'Assignment' || enableAll;
  const enableLive = selectedTab === 'Live Questions' || enableAll;
  const enableSessions = selectedTab === 'Sessions' || enableAll;

  const {
    data: assignments = [],
    // isLoading: loadingAssignments,
    // error: assignmentsError
  } = useFetch<any>(
    ['assignments'], // ✅ QueryKey should be an array
    '/dashboard/assignments',
    enableAssignments,
    {
      requiresAuth: true,
    }
  );

  const {
    data: liveQuestions = [],
    // isLoading: loadingLive,
    // error: liveError
  } = useFetch<any>(
    ['live-questions'], // ✅ array query key
    '/dashboard/live-helps',
    enableLive,
    {
      requiresAuth: true,
    }
  );

  const {
    data: sessions = [],
    // isLoading: loadingSessions,
    // error: sessionsError
  } = useFetch<any>(
    ['sessions'], // ✅ array query key
    '/dashboard/sessions',
    enableSessions,
    {
      requiresAuth: true,
    }
  );

  const {
    data: notifications = [],
    // isLoading: loadingSessions,
    // error: sessionsError
  } = useFetch<any>(
    ['notifications'], // ✅ array query key
    '/notifications/alerts',
    true,
    {
      requiresAuth: true,
    }
  );
  console.log('🚀 ~ Dashboard ~ notifications:', notifications);

  let filteredCourses = [];

  // Helper to get details path for each type
  const getDetailsPath = (item: any) => {
    if (item.sessionType || item.startTime) {
      // Session
      return paths.student.session.sessionDetails.getHref(item._id);
    }
    if (item.metadata && item.metadata.assignmentType) {
      // Assignment
      return paths.student.assignment.assignmentDetails.getHref(item._id);
    }
    if (item.metadata && (item.pricePerHour || item.liveHelpHours)) {
      // Live Question
      return paths.student.livequestiondetails.getHref(item._id);
    }
    return undefined;
  };

  if (selectedTab === 'Assignment') {
    filteredCourses = assignments;
  } else if (selectedTab === 'Live Questions') {
    filteredCourses = liveQuestions;
  } else if (selectedTab === 'Sessions') {
    filteredCourses = sessions;
  } else if (selectedTab === 'All') {
    filteredCourses = [...assignments, ...liveQuestions, ...sessions];
  }
  const selected = 'Live Sessions';

  const alerts = notifications; // from your JSON above

  const mappedNotifications = alerts?.map((alert: any) => ({
    user: alert.from === 'system' ? 'System' : alert.from, // sender
    message: alert.description, // main text
    action: null, // you don't have 'action' in your API
    course: '', // no course data in API
    time: dayjs(alert.createdAt).format('DD MMM YYYY, hh:mm A'), // nice format
    icon: MessageIcon, // put your icon path
    type: alert.type || 'alert',
  }));

  return (
    <div>
      <div className="flex wrap justify-between gap-2 my-4">
        <div>
          <span className="text-[12px] font-poppinsregular font-light text-gray-500">
            Welcome back,
          </span>
          <div className="text-[16px]  mb-4 font-poppinssemibold">{name}</div>
        </div>
        <div className="w-[280px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full text-left bg-[#007A99] border-[3px] border-white text-white p-3 rounded-xl shadow-md flex justify-between items-center focus:outline-none">
                <div>
                  <p className="font-poppinssemibold">Request Now</p>
                  <p className="text-[11px] text-white/80 font-poppinsregular">
                    Select your request type
                  </p>
                </div>
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-full w-[280px]  rounded-xl border shadow-md bg-white p-0 overflow-hidden">
              {options.map(({ label, icon }) => (
                <DropdownMenuItem
                  key={label}
                  className={`flex items-center px-4 py-3 text-[15px] font-poppinsmedium cursor-pointer ${
                    selected === label
                      ? 'bg-[#E6F6FF] text-[#007A99]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onSelect={() => {
                    if (label === 'Assignment') {
                      navigate(paths.student.assignment.newAssignment.getHref());
                    } else if (label === 'Live Sessions') {
                      navigate(paths.student.session.sessionSubmit.getHref());
                    } else if (label === 'Live Question') {
                      navigate(paths.student.livequestion.livequestionrequest.getHref());
                    }
                  }}
                >
                  {icon}
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 ">
        {/* Left Column */}
        <div className="lg:col-span-5 ">
          <TabHeader onTabChange={setSelectedTab} />
          <div
            className="bg-white rounded-b-lg p-4
    max-h-none overflow-y-visible   // Mobile: container grows with content, no scroll
    sm:max-h-[788px] sm:overflow-y-scroll
    scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-300"
          >
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mt-4">
              {filteredCourses?.map((item: any) => {
                // Use getDetailsPath for navigation
                const detailsPath = getDetailsPath(item);
                return (
                  <CourseCard
                    key={item.id || item._id}
                    course={item}
                    metadata={item.metadata}
                    title={item.metadata?.title || item.title || item.topic}
                    subject={item.metadata?.subject || item.subject}
                    status={item.status}
                    postedBy={item.postedBy || item.requestedBy || item.studentId}
                    assignedTo={item.assignedTo || item.teacherId}
                    reviewedBy={item.reviewedBy || item.managerId}
                    createdAt={item.createdAt}
                    updatedAt={item.updatedAt}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    timezone={item.timezone}
                    universityName={item.universityName}
                    sessionAgenda={item.sessionAgenda}
                    expertiseLevel={item.expertiseLevel}
                    budget={item.budget}
                    pricePerHour={item.pricePerHour}
                    liveHelpHours={item.liveHelpHours}
                    showJoinNow={!!(item.sessionType || item.startTime)}
                    onDetailsClick={() => {
                      if (detailsPath) {
                        navigate(detailsPath);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <NotificationList
            title="Alerts"
            notifications={mappedNotifications}
            onFilterChange={(value) => {
              console.log('Filter changed:', value);
            }}
          />

          <div className="bg-white rounded-xl p-4 mt-4 shadow-md w-full  mx-auto">
            <h2 className="text-[16px] font-poppinssemibold text-gray-900 mb-4">
              Upcoming Sessions & Exams
            </h2>
            <hr className="mb-4" />

            {upcommingExams.map((session, index) => (
              <UpcommingExamCard
                key={index}
                title={session.title}
                time={session.time}
                status={session.status}
                actionLabel={session.actionLabel}
              />
            ))}
          </div>
          <div className="mt-6">
            <TransactionTable transactions={transaction} />
          </div>
        </div>
      </div>
    </div>
  );
}
