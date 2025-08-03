import { useEffect, useRef } from 'react';
import AssignmentCard from './components/AssignmentCard';
import { Button } from '../components/ui/button';
import FilterTabs from '../components/ui/filterTabs';
import NotificationList from '../components/ui/cards/notificationList';
import TransactionTable from '../components/ui/cards/transactionTable';
import { MessageIcon, NotificationIcon, RattingIcon } from '../assets';
import FilterBar from './components/Filterbar';
import type { TransactionType } from '../types/course';

const sampleNotifications = [
  {
    user: 'Kevin',
    message: 'sent you message',
    action: 'What is ux',
    course: '2024 ui/ux design with figma',
    time: 'Just now',
    icon: MessageIcon,
    type: 'message',
  },
  {
    user: 'John',
    message: 'give a 5 star rating on your assignment',
    course: '2024 ui/ux design with figma',
    time: '5 mins ago',
    icon: RattingIcon,
    type: 'rating',
  },
  {
    user: 'Kevin',
    message: 'sent you message',
    action: 'What is ux',
    course: '2024 ui/ux design with figma',
    time: '6 mins ago',
    icon: NotificationIcon,
    type: 'message',
  },
];

const transaction: TransactionType[] = [
  { id: 't1', date: '21 Dec, 2021', amount: '534', status: 'Pending' },
  { id: 't2', date: '21 Sep, 2021', amount: '99', status: 'Pending' },
  { id: 't3', date: '21 Sep, 2021', amount: '202', status: 'Completed' },
  { id: 't4', date: '21 Sep, 2021', amount: '20', status: 'Pending' },
  { id: 't5', date: '21 Sep, 2021', amount: '53', status: 'Pending' },
  { id: 't6', date: '21 Sep, 2021', amount: '888', status: 'Pending' },
  { id: 't7', date: '21 Sep, 2021', amount: '20', status: 'Pending' },
];

// Assignment component for dashboard
export default function Assignment() {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle selection from dropdown

  // Handle tab change from FilterTabs
  const handleTabChange = (tab: string) => {
    console.log('Selected Tab:', tab);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format a date string to "Day Month, Weekday" format

  return (
    <div>
      {/* Top summary bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
        {/* Left: Title */}
        <div className="text-[22px] text-black font-poppinssemibold">
          My Assignment
        </div>

        {/* Right: Request Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full sm:w-auto">
          <div>
            <h2 className="text-[14px] sm:text-[16px] font-poppinssemibold text-gray-900">Request New Assignment</h2>
            <p className="text-[11px] font-poppinsregular text-gray-400">Fill the form to request an Assignment</p>
          </div>

          <Button
            className="py-2 px-4 m-0 text-[16px] font-poppinsmedium"
            variant="outline_rounded"
          >
            Request
          </Button>
        </div>
      </div>

      <div></div>
      <FilterTabs
        tabs={['ALL', 'Requested', 'In Progress', 'Completed', 'Rejected']}
        defaultTab="Assignments"
        onTabChange={handleTabChange}
      />

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4  mt-4">
        {/* Left Column - Filter tabs and content */}

        <div className="lg:col-span-5">
          <div className="bg-white md:h-[706px] h-full scrollbar-thin rounded-md  md:overflow-y-scroll overflow-none py-2 mb-2">
            <div className=" px-4 mx-auto">
              <FilterBar />

              <AssignmentCard
                id={61436}
                title="New swift assignment – iOS Programming"
                subtitle="Subject Name Lorem ipsum dolor sit"
                subjectcode="CS1013"
                amount={150}
                deadline="30 Aug 2025"
                tags={[
                  'Python',
                  'Computer Science',
                  'Coding',
                  'Application Development',
                  'React Native',
                ]}
                status="Completed"
                statusLabel={['Completed']}
              />

              <AssignmentCard
                id={61436}
                title="Lorem ipsum dolor sit amet consectetur."
                subtitle="Subject Name Lorem ipsum dolor sit"
                subjectcode="CS1013"
                amount={150}
                deadline="30 Aug 2025"
                tags={[
                  'Python',
                  'Computer Science',
                  'Coding',
                  'Application Development',
                  'React Native',
                ]}
                status="Inprogress"
                // statusLabel="Inprogress • Milestone 1"
                statusLabel={['Inprogress']}
                milestone="Milestone 1"
                rating={4.8}
                ratingCount={451444}
              />
              <AssignmentCard
                id={61436}
                title="Lorem ipsum dolor sit amet consectetur."
                subtitle="Subject Name Lorem ipsum dolor sit"
                subjectcode="CS1013"
                amount={150}
                deadline="30 Aug 2025"
                tags={[
                  'Python',
                  'Computer Science',
                  'Coding',
                  'Application Development',
                  'React Native',
                ]}
                status="Inprogress"
                // statusLabel="Inprogress • Milestone 1"
                statusLabel={['Inprogress']}
                milestone="Milestone 1"
                rating={4.8}
                ratingCount={451444}
              />
              <AssignmentCard
                id={61436}
                title="Lorem ipsum dolor sit amet consectetur."
                subtitle="Subject Name Lorem ipsum dolor sit"
                subjectcode="CS1013"
                amount={150}
                deadline="30 Aug 2025"
                tags={[
                  'Python',
                  'Computer Science',
                  'Coding',
                  'Application Development',
                  'React Native',
                ]}
                status="Inprogress"
                // statusLabel="Inprogress • Milestone 1"
                statusLabel={['Inprogress', 'Milestone 1']}
                milestone="Milestone 1"
                rating={4.8}
                ratingCount={451444}
              />
              <div className="flex font-poppinssemibold text-[13px] justify-center text-primary">
                <Button variant="ghost">See More</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Notifications and Transactions */}
        <div className="lg:col-span-2 ">
          <NotificationList notifications={sampleNotifications} />
          <div className="mt-6">
            <TransactionTable transactions={transaction} />
          </div>
        </div>
      </div>
    </div>
  );
}
