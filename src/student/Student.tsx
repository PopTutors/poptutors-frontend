import { useEffect, useRef, useState } from "react";

// Images (adjust path according to where they're stored)
import calendarIcon from "../assets/calendar.svg"; // or use public folder
import DropdownCard from "../components/ui/dropdownCard";
import FilterTabs from "../components/ui/filterTabs";
import CourseCard from "../components/ui/cards/courseCard";
import NotificationList from "../components/ui/cards/notificationList";
import TransactionTable from "../components/ui/cards/transactionTable";
import { useAssignments } from "../features/assignment/api/getAssignment";
import { MessageIcon, NotificationIcon, RattingIcon } from "../assets";

// courseCardData.ts

export const courseCards = [
  {
    title: "UX Case Study on Mobile Apps",
    topic: ["Design Thinking", "UI/UX"],
    date: "12 July, Friday",
    price: "$45",
    progress: 0,
    label: "Assignment",
    labelColor: "#019ACB",
    labelBackground: "#E6F5F4",
  },
  {
    title: "Data Structures: Trees & Graphs",
    topic: ["Computer Science", "DSA"],
    date: "10 July, Wednesday",
    price: "$35",
    progress: 0,
    label: "Assignment",
    labelColor: "#FF7F50",
    labelBackground: "#FFF4EF",
  },
  {
    title: "Live Math Problem Solving",
    topic: ["Mathematics", "Algebra II"],
    date: "14 July, Sunday",
    price: "$25",
    progress: 0,
    label: "Live Question",
    labelColor: "#F88C3D",
    labelBackground: "#FFF6E9",
  },
  {
    title: "1-on-1 Physics Coaching",
    topic: ["Physics", "Mechanics"],
    date: "15 July, Monday",
    price: "$60",
    progress: 0,
    label: "Session",
    labelColor: "#41BE90",
    labelBackground: "#ECFDF3",
  },
];

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
  {
    user: "Kevin",
    message: "sent you message",
    action: "What is ux",
    course: "2024 ui/ux",
    time: "19 mins ago",
    icon: NotificationIcon,
    type: "message",
  },
];

const transactions = [
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Pending" },
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Pending" },
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Completed" },
  { date: "21 Sep, 2021 at 2:14 AM", amount: "$20", status: "Completed" },
];

export default function Dashboard() {
  const { data, isLoading, isError } = useAssignments(); // Custom hook
  const [selectedOption, setSelectedOption] = useState("Assignments");
  const [openDropdown, setOpenDropdown] = useState<null | "request">(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: string) => {
    setSelectedOption(item);
    setOpenDropdown(null);
  };

  const handleTabChange = (tab: string) => {
    console.log("Selected Tab:", tab);
  };

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
      <div className="flex wrap justify-between gap-2 my-4">
        <div
          style={{ fontWeight: "900" }}
          className="text-[13px] text-[#334d6e] mb-4 font-poppinsmedium"
        >
          3 Recent Assignments, 2 Live Questions & 1 Paid Session are in
          progress
        </div>
        <div className="w-full max-w-xs flex justify-end">
          <DropdownCard
            label="Request New"
            title={selectedOption}
            iconType="arrow"
            menuItems={["Assignment", "Project", "Quiz"]}
            onSelect={handleSelect}
            isOpen={openDropdown === "request"}
            onToggle={() =>
              setOpenDropdown((prev) => (prev === "request" ? null : "request"))
            }
            dropdownRef={dropdownRef}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3">
          <FilterTabs
            tabs={["Assignments", "Sessions", "Live Question"]}
            defaultTab="Assignments"
            onTabChange={handleTabChange}
          />

          <div className="p-5 mt-8  bg-white">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-poppinsregular text-[#1f2442]">
                23 December, Sunday
              </h2>
              <img
                src={calendarIcon}
                alt="Calendar Icon"
                width={20}
                height={20}
              />
            </div>

            {/* Loading and Error State */}
            {isLoading ? (
              <p className="font-poppinsregular">Loading assignments...</p>
            ) : isError ? (
              <p className="text-red-500 font-poppinsregular">
                Failed to load assignments.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {data?.data?.map((assignment: any) => (
                  <CourseCard
                    key={assignment._id}
                    title={assignment.title}
                    topic={[assignment.subject, assignment.course]}
                    date={formatDate(assignment.createdAt)}
                    price={`$${assignment.studentPrice ?? "N/A"}`}
                    progress={0}
                    label="Assignments"
                    labelColor="#019ACB"
                    labelBackground="#E6F5F4"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 mt-16">
          <NotificationList notifications={sampleNotifications} />
          <div className="mt-6">
            <TransactionTable
              transactions={transactions}
              onPayNow={(index) =>
                alert(`Pay now clicked for transaction ${index + 1}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
