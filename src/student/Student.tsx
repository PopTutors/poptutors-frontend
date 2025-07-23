import { useEffect, useRef, useState } from "react";

// Images (adjust path according to where they're stored)
import calendarIcon from "../assets/calendar.svg"; // or use public folder
import DropdownCard from "../components/ui/dropdownCard";
import FilterTabs from "../components/ui/filterTabs";
import NotificationList from "../components/ui/cards/notificationList";
import TransactionTable from "../components/ui/cards/transactionTable";
import { useAssignments } from "../features/assignment/api/getAssignment";
import { MessageIcon, NotificationIcon, RattingIcon } from "../assets";
import Tabs from "./components/Tabs";
import CourseCard from "./components/CourseCard";
import type { CourseType, TransactionType } from "../types/course";
import TabHeader from "./components/Tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown";
import { ChevronDown } from "lucide-react";

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
    course: "2024 ui/ux design with figma",
    time: "6 mins ago",
    icon: NotificationIcon,
    type: "message",
  },

];



const courses: CourseType[] = [
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
  },
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
  },
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
  },
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
  },
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
  },
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
  },
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
  },
  {
    id: '1',
    title: 'Social Media Course Lorem Ipsum Dolor',
    date: '25/10/2024',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    tags: [
      { label: 'Live Question', color: 'text-red-500' },
      { label: 'Milestone 1', color: 'text-green-600' },
    ],
    price: '$50/hr',
    duration: '2 hours',
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

export default function Dashboard() {
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
        <div>
          <span className="text-[12px] font-poppinsregular font-light text-gray-500">
            Welcome back,
          </span>
          <div className="text-[16px]  mb-4 font-poppinssemibold">
            Shubham Gone
          </div>
        </div>
        <div className="w-[280px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full text-left bg-[#007A99] border border-[3px] border-white text-white p-3 rounded-xl shadow-md flex justify-between items-center focus:outline-none">
              <div>
                <p className=" font-poppinssemibold">Request Now</p>
                <p className="text-[11px] text-white/80 font-poppinsregular">Select your request type</p>
              </div>
              <ChevronDown className="w-5 h-5 text-white font-bold" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-full mt-2 rounded-xl border shadow-md bg-white">
            <DropdownMenuItem onSelect={(type) => console.log('Selected request type:', type)}>
              Request 1
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(type) => console.log('Selected request type:', type)}>
               Request 2
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(type) => console.log('Selected request type:', type)}>
               Request 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 ">
        {/* Left Column */}
        <div className="lg:col-span-5 ">
          <TabHeader />
          <div className="bg-white rounded-b-lg p-4  overflow-y-scroll h-[830px] scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-300">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <NotificationList notifications={sampleNotifications} />
          <div className="mt-6">
            <TransactionTable transactions={transaction} />
          </div>
        </div>
      </div>
    </div>
  );
}
