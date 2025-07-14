import React from "react";
import { FaCalendarAlt, FaRegCalendar } from "react-icons/fa";
import { Button } from "../../components/ui/button";

type AssignmentCardProps = {
  title: string;
  status: string;
  tags: string[];
  price: number;
  deadline: string;
};

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  title,
  status,
  tags,
  price,
  deadline,
}) => {
  const statusStyle = {
    "Milestone 1": "bg-[#d3ffd5] text-[#2fbe4d] ",
    "Under Review": "bg-[#ffedc5] text-[#c5911e]",
    Completed: "bg-[#D4EDFF] text-[#2F86C3]",
  };

  return (
    <div className="flex flex-col mt-6  md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow-lg border border-gray-100 p-[14px]  mb-4">
      <div className="flex-1 w-full md:w-auto">
        <h2 className="font-poppinsmedium text-lg text-gray-800">{title}</h2>
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-sm text-[12px] font-poppinsregular ${statusStyle[status]}`}
        >
          {status}
        </span>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] bg-[#f3fcff] text-primary px-2 py-1 font-poppinsregular rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#e6f9ff] rounded-lg p-4 flex flex-col items-center justify-center mt-4 md:mt-0 md:ml-4 w-full md:w-[134px]">
        <div className="text-[#019ACB] font-popbold text-[16px] bg-white rounded-md  px-2 py-1">{price} $</div>

        

        <div className="flex items-center  gap-1 text-[#0b7db6] font-poppinsregular text-[12px] mt-3">
          <span className="text-[15px]"> <FaRegCalendar /> </span> Deadline
        </div>
        <div>
          <div className="flex items-center gap-1 text-[#019ACB] font-poppinsregular text-[12px] ">
           {deadline}
          </div>
        </div>

        <Button variant={"outline"} className="mt-4 border-[#019ACB] text-[#019ACB] bg-white flex items-center px-[10px] hover:bg-white  py-[7px] text-[10px] font-epilogue">
          View Assignment
        </Button>
      </div>
    </div>
  );
};

export default AssignmentCard;
