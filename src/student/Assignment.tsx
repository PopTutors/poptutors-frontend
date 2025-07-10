import { useEffect, useRef, useState } from "react";
import AssignmentCard from "./components/assignmentCard";
import AssignmentListHeader from "./components/assignmentListHeader";
import { Button } from "../components/ui/button";
import FilterTabs from "../components/ui/filterTabs";
import NotificationList from "../components/ui/cards/notificationList";
import TransactionTable from "../components/ui/cards/transactionTable";
import { MessageIcon, NotificationIcon, RattingIcon } from "../assets";
import FilterBar from "./components/Filterbar";

const sampleNotifications = [
  { user: "Kevin", message: "sent you message", action: "What is ux", course: "2024 ui/ux design with figma", time: "Just now", icon: MessageIcon },
  { user: "John", message: "give a 5 star rating on your assignment", course: "2024 ui/ux design with figma", time: "5 mins ago", icon: RattingIcon },
  { user: "Kevin", message: "sent you message", action: "What is ux", course: "2024 ui/ux design with figma", time: "6 mins ago", icon: NotificationIcon },

];


const transactions = [
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Pending" },
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Pending" },
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Completed" },
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Completed" },
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      <div className="flex wrap justify-between gap-2 my-4 ">
        <div className="text-[21px] text-black mb-4 font-semibold">
          My Assignment
        </div>


        <div className="w-full max-w-xs">
          <div className="relative">
            <span className="absolute -right-1 top-[17px] -bottom-1 w-full h-full border-2 border-[#0099cc] rounded-full z-0"></span>
            <Button variant="outline_rounded_1" className="w-full relative z-10 px-6 py-6 ">
              Submit New Assignment
            </Button>
          </div>
        </div>

      </div>

      <div>
        <FilterBar />
      </div>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
        {/* Left Column - Filter tabs and content */}


        <div className="lg:col-span-3 ">

          <FilterTabs
            tabs={["Requested", "Completed", "On-Going"]}
            defaultTab="Assignments"
            onTabChange={handleTabChange}
          />

          <div className="bg-white px-4 py-2 mt-8 mb-2">
            <AssignmentListHeader completed={8} total={10} filter="This week" />

            <AssignmentCard
              title="New swift assignment - iOS Programming"
              status="Completed"
              price={30}
            />
            <AssignmentCard
              title="Documentation on AI - Robotics"
              status="Negotiate"
              price={56}
              milestone="Milestone stage 1 submitted"
              showIcons
            />
            <AssignmentCard
              title="AI Technology - Digital Data"
              status="Requested"
              price={65}
              milestone="In Review"
            />
            <AssignmentCard
              title="New swift assignment - iOS Programming"
              status="Completed"
              price={30}
            />
          </div>

          <div className="flex justify-center">
            <Button variant="ghost">See More</Button>
          </div>
        </div>


        {/* Right Column - Notifications and Transactions */}
        <div className="lg:col-span-2 mt-16">
          <NotificationList notifications={sampleNotifications} />
          <div className="mt-6">
            <TransactionTable
              transactions={transactions}
              onPayNow={(index) => alert(`Pay now clicked for transaction ${index + 1}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
