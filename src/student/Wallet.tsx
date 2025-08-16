import React, { useRef, useState } from 'react';
import { Arrowright, Wallet } from '../assets';
import { FiArrowDownRight, FiCalendar } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown';
import { MdArrowOutward } from 'react-icons/md';
import { AssignmentIcon } from '../assets/sidebar-icon';
// FiArrowDownRight

type Transaction = {
  type: 'Payment' | 'Refund' | 'Referral';
  service: string;
  transactionId: string;
  note: string;
  dateTime: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  action: string; // e.g., "View" or "Pay Now"
};

const transactions: Transaction[] = [
  {
    type: 'Payment',
    service: 'Assignment',
    transactionId: '#29833984',
    note: 'Note',
    dateTime: 'Feb 15, 2025 06:24 AM',
    amount: '-$542',
    status: 'Completed',
    action: 'View',
  },
  {
    type: 'Referral',
    service: 'Assignment',
    transactionId: '#29833984',
    note: 'Note',
    dateTime: 'Feb 15, 2025 06:24 AM',
    amount: '-$542',
    status: 'Pending',
    action: 'Pay Now',
  },
  {
    type: 'Payment',
    service: 'Assignment',
    transactionId: '#29833984',
    note: 'Note',
    dateTime: 'Feb 15, 2025 06:24 AM',
    amount: '-$542',
    status: 'Completed',
    action: 'View',
  },
  {
    type: 'Payment',
    service: 'Session',
    transactionId: '#29833984',
    note: 'Note',
    dateTime: 'Feb 15, 2025 06:24 AM',
    amount: '-$542',
    status: 'Failed',
    action: 'View',
  },
  {
    type: 'Payment',
    service: 'Assignment',
    transactionId: '#29833984',
    note: 'Note',
    dateTime: 'Feb 15, 2025 06:24 AM',
    amount: '-$542',
    status: 'Completed',
    action: 'View',
  },
  {
    type: 'Refund',
    service: 'Assignment',
    transactionId: '#29833984',
    note: 'Note',
    dateTime: 'Feb 15, 2025 06:24 AM',
    amount: '-$542',
    status: 'Completed',
    action: 'View',
  },
];

// Hides the default calendar icon on date input
const hideDefaultDateIcon = 'appearance-none [&::-webkit-calendar-picker-indicator]:hidden';

const statusClasses = {
  Completed: 'text-[#229126] font-poppinsmedium',
  Pending: 'text-yellow-500 font-poppinsmedium',
  Failed: 'text-[#D22525] font-poppinsmedium',
};

const DATE_FILTERS = ['Today', 'Yesterday', 'This Week', 'This Month'];
const SORT_OPTIONS = ['All', 'Newest', 'Oldest', 'Highest Amount', 'Lowest Amount'];

const TransactionDashboard: React.FC = () => {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  // 1. State for the dropdown
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('This Week');

  // 2. Handler
  function handleFilterChange(option: string) {
    setSelectedDateFilter(option);
    // ...you can hook your filtering logic here
  }

  const [sortBy, setSortBy] = React.useState<string>('Newest');

  function handleSortChange(option: string) {
    setSortBy(option);
    // You can add sorting logic here!
  }

  const tabs = [{ label: 'All' }, { label: 'Refund' }, { label: 'Payment' }, { label: 'Referral' }];

  const cardData = [
    {
      title: 'Referral Earnings',
      value: '$742',
      color: 'bg-[#B0DAB3]',
      textColor: 'text-[#229126]',
      icon: '📝', // Replace with your SVG if needed
    },
    {
      title: 'Assignment',
      value: '$742',
      color: 'bg-[#B4DDEA]',
      textColor: 'text-[#197B9B]',
      icon: '📝',
    },
    {
      title: 'Live Sessions',
      value: '$742',
      color: 'bg-[#F7ECD3]',
      textColor: 'text-[#DDA31E]',
      icon: '📷',
    },
    {
      title: 'Live Question Help',
      value: '$742',
      color: 'bg-[#FFB7B7]',
      textColor: 'text-[#D22525]',
      icon: '🗓️',
    },
  ];

  return (
    <div className="">
      <div className="text-[22px] text-black font-poppinssemibold">Wallet Data</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Left: 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {cardData.map((item) => (
            <div
              key={item.title}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[8px] shadow-sm  min-h-[112px] w-full ${item.color}`}
            >
              {/* Left: Value and Title */}
              <div className="mb-3 sm:mb-0">
                <div className={`text-[18px] md:text-[24px] font-semibold ${item.textColor}`}>
                  {item.value}
                </div>
                <div className="text-[14px] md:text-[16px] font-medium mt-1 md:mt-2">
                  {item.title}
                </div>
              </div>

              {/* Right: Icon box */}
              <span className="p-3 bg-white rounded-full flex items-center justify-center h-[48px] w-[48px] shrink-0">
                <img src={AssignmentIcon} alt="" className="object-contain h-6 w-6" />
              </span>
            </div>
          ))}
        </div>

        {/* Right: Tall Card */}
        <div className=" rounded-[8px] flex flex-col justify-between border border-[#e5e5e5] bg-white border-[1px] px-6 py-[30px] col-span-1  shadow-sm">
          {/* Title and Description */}
          <div className="flex justify-between">
            <div className="mb-4">
              <div className="text-[20px] font-poppinssemibold  text-gray-900">Total Spent</div>
              <div className="text-sm font-poppinsregular text-gray-400">Lorem ipsum dolor vae</div>
            </div>

            {/* Main Amount (Left Aligned) */}
            <div className="  text-gray-900 mb-6">
              <span className="font-poppinssemibold text-[24px] sm:text-[30px]">$11,742</span>
              <span className="text-gray-400 font-poppinsregular text-[18px] sm:text-[24px]">
                .00
              </span>
            </div>
          </div>

          {/* Earned and Other */}
          <div className="flex flex-col sm:flex-row gap-4 mt-[46px]">
            {/* Earned */}
            <div className="flex items-center gap-3">
              <span className="bg-orange-100 text-orange-500 p-2 rounded-md">
                {/* Down arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </span>
              <div>
                <div>
                  <span className="font-poppinssemibold text-[14px] sm:text-[18px]">$1,742.</span>
                  <span className="font-poppinssregular text-[10px] sm:text-[14px]">00</span>
                </div>
                <div className="text-[10px] sm:text-[12px] text-gray-500">Earned</div>
              </div>
            </div>

            {/* Other */}
            <div className="flex items-center gap-3">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-md">
                {/* Up-right arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7m0 0H9m8 0v8"
                  />
                </svg>
              </span>
              <div>
                <div>
                  <span className="font-poppinssemibold text-[14px] sm:text-[18px]">$742.</span>
                  <span className="font-poppinssregular text-[10px] sm:text-[14px]">00</span>
                </div>
                <div className="text-[10px] sm:text-[12px] text-gray-500">Other</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F7F8FA] flex flex-col sm:flex-row justify-between items-center  py-3  sm:py-4 mt-6">
        <h2 className="font-poppinssemibold text-[18px] mb-2 sm:mb-0">Transactions</h2>
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`
          px-4 py-1.5 rounded-md border transition 
          ${
            activeTab === tab.label
              ? 'bg-[#07B5EC] font-poppinssemibold text-[16px] text-white border-white border-2 '
              : 'bg-white font-poppinssregular text-[16px] border-[#C3E5F6]'
          }
          w-full sm:w-auto
        `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className=" bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-[13px] sm:text-[14px] font-poppinsregular text-[#262626]">
              Sort By:
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="
        border border-gray-200 
        rounded-lg 
        px-2 py-2 sm:px-3 sm:py-[9px]
        bg-white 
        text-[13px] sm:text-[14px]
        font-poppinsregular 
        flex items-center 
        gap-1.5 sm:gap-2
        shadow-none 
        hover:bg-gray-50
        transition
        min-w-[120px]
      "
              >
                {sortBy}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 ml-1 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.7a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[8rem] text-[13px] sm:text-[14px] font-poppinsregular">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={sortBy === option ? 'bg-gray-100 font-poppinsregular' : ''}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col md:flex-row md:justify-end gap-3 md:gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-[13px] sm:text-[14px] font-poppinsregular text-[#262626]">
                Date:
              </label>
              {/* Start Date */}
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                  onClick={() => startDateRef.current?.showPicker()}
                  tabIndex={-1}
                >
                  <FiCalendar />
                </button>
                <input
                  ref={startDateRef}
                  type="date"
                  className={`pl-10 pr-3 py-2 border rounded-lg text-[13px] sm:text-[14px] font-poppinsregular bg-white w-full sm:w-auto ${hideDefaultDateIcon}`}
                />
              </div>
              {/* Arrow */}
              <span className="flex items-center justify-center px-2 py-2">
                <img src={Arrowright} alt="Arrow" className="w-4 h-4" />
              </span>
              {/* End Date */}
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                  onClick={() => endDateRef.current?.showPicker()}
                  tabIndex={-1}
                >
                  <FiCalendar />
                </button>
                <input
                  ref={endDateRef}
                  type="date"
                  className={`pl-10 pr-3 py-2 border rounded-lg text-[13px] sm:text-[14px] font-poppinsregular bg-white w-full sm:w-auto ${hideDefaultDateIcon}`}
                />
              </div>
            </div>
            {/* DropdownMenu filter */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center mt-2 md:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="
          border border-gray-200 
          rounded-lg 
          px-2 py-2 sm:px-3 sm:py-[9px]
          bg-white 
          text-[13px] sm:text-[14px]
          font-poppinsregular 
          flex items-center 
          gap-1.5 sm:gap-2
          shadow-none 
          hover:bg-gray-50
          transition
          min-w-[120px]
        "
                >
                  {selectedDateFilter}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 ml-1 text-gray-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.7a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[8rem] text-[13px] sm:text-[14px] font-poppinsregular">
                  {DATE_FILTERS.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => handleFilterChange(option)}
                      className={selectedDateFilter === option ? 'bg-gray-100 font-semibold' : ''}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-[600px] w-full text-sm text-left">
            <thead>
              <tr className="bg-[#F5F7FA]">
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">TYPE</th>
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">SERVICE</th>
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">TRANSACTION ID</th>
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">NOTE</th>
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">DATE & TIME</th>
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">AMOUNT</th>
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">STATUS</th>
                <th className="py-5 px-4 font-poppinssemibold text-[15px]">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr
                  key={idx}
                  className={`border-b last:border-b-0 ${idx % 2 === 0 ? '' : 'bg-[#F5F5F5]'}  transition`}
                >
                  <td className="py-3 px-3 md:py-5 md:px-4 font-poppinsmedium md:text-[14px] text-[12px] ">
                    <span
                      className={`
                                                inline-flex items-center gap-2
                                                rounded-[4px]
                                                sm:p-1
                                                max-w-max
                                                text-base
                                                whitespace-nowrap
                                                shadow-none
                                                me-3
                                            ${
                                              tx.type === 'Referral' || tx.type === 'Refund'
                                                ? 'bg-[#FCE2CB] text-[#FD7409]'
                                                : 'bg-[#F1F4FF] text-[#2435A1]'
                                            }
                                            `}
                    >
                      {tx.type === 'Referral' || tx.type === 'Refund' ? (
                        <FiArrowDownRight className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <MdArrowOutward className="w-4 h-4" aria-hidden="true" />
                      )}
                    </span>
                    <span className="inline-flex items-center font-poppinsmedium md:text-[14px] text-[12px]">
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-5 px-4 font-poppinsregular md:text-[14px] text-[12px] ">
                    {tx.service}
                  </td>
                  <td className="py-5 px-4 font-poppinsregular md:text-[14px] text-[12px]">
                    {tx.transactionId}
                  </td>
                  <td className="py-5 px-4 font-poppinsregular md:text-[14px] text-[12px]">
                    {tx.note}
                  </td>
                  <td className="py-5 px-4 font-poppinsregular md:text-[14px] text-[12px]">
                    {tx.dateTime}
                  </td>
                  <td className="py-5 px-4 font-poppinsmedium md:text-[14px] text-[12px]">
                    {tx.amount}
                  </td>
                  <td
                    className={`py-5 px-4 font-poppinsmedium md:text-[14px] text-[12px] ${statusClasses[tx.status]}`}
                  >
                    {tx.status}
                  </td>
                  <td className="py-5 px-4 font-poppinsmedium md:text-[14px] text-[12px]">
                    {tx.action === 'Pay Now' ? (
                      <button
                        className="
        w-full 
        font-semibold 
        border border-[#00bcd4] 
        text-white 
        py-2 md:text-[14px] text-[12px]
        rounded-full
        bg-[#00bcd4] 
        transition-all
        text-xs md:text-sm
      "
                      >
                        Pay Now
                      </button>
                    ) : (
                      <div
                        className="
        flex items-center
        flex-col md:flex-row
        gap-2 md:gap-2
        w-full
      "
                      >
                        <button
                          className="
          font-semibold border
          border-[#00bcd4]
          text-[#00bcd4]
          py- md:py-2
          rounded-full
          text-xs md:text-sm
          w-full md:max-w-[72px]
          hover:bg-[#00bcd4] hover:text-white
          transition-all
        "
                        >
                          View
                        </button>
                        <img src={Wallet} alt="Wallet" className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
