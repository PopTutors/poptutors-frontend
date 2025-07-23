import { useEffect, useRef, useState } from "react";
import AssignmentCard from "./components/AssignmentCard";
import AssignmentListHeader from "./components/AssignmentListHeader";
import { Button } from "../components/ui/button";
import FilterTabs from "../components/ui/filterTabs";
import NotificationList from "../components/ui/cards/notificationList";
import TransactionTable from "../components/ui/cards/transactionTable";
import { MessageIcon, NotificationIcon, RattingIcon } from "../assets";
import FilterBar from "./components/Filterbar";
import type { TransactionType } from "../types/course";

const sampleNotifications = [
  {
    user: "Kevin",
    message: "sent you message",
    action: "What is ux",
    course: "2024 ui/ux design with figma",
    time: "Just now",
    icon: MessageIcon,
    type: "message",
  },
  {
    user: "John",
    message: "give a 5 star rating on your assignment",
    course: "2024 ui/ux design with figma",
    time: "5 mins ago",
    icon: RattingIcon,
    type: "rating",
  },
  {
    user: "Kevin",
    message: "sent you message",
    action: "What is ux",
    course: "2024 ui/ux design with figma",
    time: "6 mins ago",
    icon: NotificationIcon,
    type: "message",
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
  // State for selected date in calendar
  const [selectedDate, setSelectedDate] = useState("");

  // State for currently selected tab (Assignments, Sessions, etc.)
  const [selectedOption, setSelectedOption] = useState("Assignments");

  // State for dropdown visibility
  const [openDropdown, setOpenDropdown] = useState<null | "request">(null);

  // Reference to dropdown element to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle selection from dropdown
  const handleSelect = (item: string) => {
    setSelectedOption(item);
    setOpenDropdown(null);
  };

  // Handle tab change from FilterTabs
  const handleTabChange = (tab: string) => {
    console.log("Selected Tab:", tab);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format a date string to "Day Month, Weekday" format
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = date.toLocaleDateString("en-GB", { month: "long" });
    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
    return `${day} ${month}, ${weekday}`;
  };

  return (
    <div>
      {/* Top summary bar */}
      <div className="flex wrap justify-between gap-2 my-2 ">
        <div className="text-[21px] text-black mb-4 font-semibold">
          My Assignment
        </div>

        <div className="flex items-center justify-between gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div>
            <h2 className="text-lg font-poppinsmedium text-[18px] text-gray-900">Request New Assignment</h2>
            <p className="text-[10px] text-gray-400">Fill the form to request an Assignment</p>
          </div>

          <Button className=" mt-0 py-2 px-4 font-poppinsmedium text-[16px]" variant={"outline_rounded"} onClick={() => setOpenDropdown("request")}>Request</Button>
        </div>
      </div>

      <div>
      </div>
      <FilterTabs
        tabs={["ALL", "Requested", "In Progress", "Completed", "Rejected"]}
        defaultTab="Assignments"
        onTabChange={handleTabChange}
      />

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6  mt-3">
        {/* Left Column - Filter tabs and content */}

        <div className="lg:col-span-4">


          <div className="bg-white h-[706px] overflow-y-scroll  py-2 mb-2">
            <div className="max-w-4xl px-6 mx-auto">
              <FilterBar />

              <AssignmentCard
                id={61436}
                title="New swift assignment – iOS Programming"
                subtitle="Subject Name Lorem ipsum dolor sit"
                amount={150}
                deadline="30 Aug 2025"
                tags={['Python', 'Computer Science', 'Coding', 'Application Development', 'React Native']}
                status="Completed"
                statusLabel="Completed • Under Review"
              />

              <AssignmentCard
                id={61436}
                title="Lorem ipsum dolor sit amet consectetur."
                subtitle="Subject Name Lorem ipsum dolor sit"
                amount={150}
                deadline="30 Aug 2025"
                tags={['Python', 'Computer Science', 'Coding', 'Application Development', 'React Native']}
                status="Inprogress"
                statusLabel="Inprogress"
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
