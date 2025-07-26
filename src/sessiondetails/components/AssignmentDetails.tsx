import React from "react";
import { Alarm, BarChart, Checkmark, Clock, Language, Time, UsDollarCircled,User } from "../../assets";

const AssignmentDetails: React.FC = () => {

    const DetailRow = ({
        icon,
        label,
        value,
    }: {
        icon: string;
        label: string;
        value: string;
    }) => (
        <div className="flex font-inter items-center justify-between py-2 text-sm text-gray-700">
            <div className="flex text-[17px] items-center gap-2 ">
                <img src={icon} alt="" />
                <span>{label}</span>
            </div>
            <div className="text-gray-400  font-regular">{value}</div>
        </div>
    );
    return (
        <div className="border rounded-lg p-4 bg-white  mx-auto space-y-4 shadow-sm">
            {/* Top Price Summary */}
            <div className="flex font-inter flex-wrap justify-between items-center gap-4 border-b pb-3">
                <div className="flex  items-center gap-2 text-sm text-primary font-medium">
                    <span className="bg-[#E6F9FF] py-1 px-2 flex items-center gap-2"> 
                    <img src={UsDollarCircled} alt="" />
                        
                         TOTAL PRICE DECIDED</span> 
                    <span className="text-black text-primary bg-[#E6F9FF] py-1 px-2">100$</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                   
                    <span className="bg-[#d1ffdb] flex items-center gap-2 py-1 px-2">
                   <img src={Checkmark} alt="" />
                        
                        AMOUNT PAID</span> 
                    <span className="bg-[#d1ffdb] py-1 px-2">30$</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                    <span className="bg-[#ffefea] flex items-center gap-2 py-1 px-2">
                    <img src={Alarm} alt="" />
                        REMAINING AMOUNT</span> 

     
                    <span className="bg-[#ffefea] py-1 px-2 text-red-500">50$</span>
                </div>
            </div>

            {/* Detail Rows */}
                <div className="grid grid-cols-1 md:grid-cols-2 font-inter  rounded-lg  divide-y md:divide-y-0 md:divide-x">
                    {/* Left Column */}
                    <div className="space-y-4 pr-4">
                        <DetailRow icon={Clock} label="Assignment Duration" value="6 Month" />
                        <DetailRow icon={BarChart} label="Subject Expert" value="Beginner and Intermediate" />
                        <DetailRow icon={Language} label="Teacher Code" value="#239564" />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 pl-4">
                        <DetailRow icon={User} label="Assignment Enrolled" value="69,419,618" />
                        <DetailRow icon={Language} label="Language" value="English" />
                        <DetailRow icon={Time} label="Date of Assignment" value="25 April 2024" />
                    </div>
                </div>
        </div>
    );
};

export default AssignmentDetails;
