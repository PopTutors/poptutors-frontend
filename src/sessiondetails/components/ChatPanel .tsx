import React, { useState } from "react";
import { FaPaperclip, FaPaperPlane, FaPen } from "react-icons/fa";

const ChatPanel: React.FC = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col max-w-md h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Jane Cooper"
            className="rounded-full w-10 h-10"
          />
          <div>
            <p className="font-poppinsmedium text-[17px]">Jane Cooper</p>
            <span className="text-xs text-gray-500">Active Now</span>
          </div>
        </div>
        <div>⋮</div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* Date Marker */}
        <div className="text-center text-xs text-gray-500">Today</div>

        {/* Negotiation Info */}
        

        {/* Negotiation Input */}
        <div className="flex flex-col items-start space-y-2">
          <input
            type="text"
            placeholder="Please add your negotiation price here"
            className="border  font-poppinsregular rounded-md px-3 py-2 text-sm w-full"
          />
          <button className="bg-primary font-poppinsregular text-white px-4 py-2 rounded-md text-sm">
            Send Price
          </button>
        </div>

        {/* User Message */}
        <div className="text-right text-xs text-gray-400">10:20 AM</div>
        <div className="flex justify-end">
          <div className="bg-primary font-poppinsregular text-white px-4 py-2 rounded-lg text-sm max-w-[70%]">
            I would like to offer at $130
          </div>
        </div>

        {/* Manager Response */}
        <div className="text-left text-xs text-gray-400">10:25 AM</div>
        <div className="bg-green-100 p-3 font-poppinsmedium rounded-lg text-sm text-green-800 w-fit">
          Manager Accepted Your Offer
          <button className="bg-green-500  font-poppinsregular text-white px-4 py-2 rounded-md text-xs mt-2">
            Pay 50% Advance
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center font-poppinsregular p-4 border-t">
        <div className="flex items-center flex-grow bg-white border rounded-full px-4 py-2 shadow-sm">
        <FaPen className="text-cyan-500 mr-2" />
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow outline-none text-sm text-gray-600 placeholder-gray-400"
        />
        <FaPaperclip className="text-cyan-500 ml-2" />
      </div>
        <button className="ml-2 bg-blue-500 p-3 rounded-full text-white">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
