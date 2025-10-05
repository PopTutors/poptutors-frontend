import React from 'react';

type RequestCardProps = {
  title: string;
  course: string;
  price: string;
  date: string;
  status: string;
};

const RequestCard: React.FC<RequestCardProps> = ({ title, course, price, date, status }) => (
  <div className="border p-4 shadow-sm bg-white">
    <h3 className="font-medium mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-1">{course}</p>
    <p className="text-gray-500 text-xs mb-2">{date}</p>
    <div className="flex justify-between items-center">
      <span className="text-sm font-semibold text-blue-600">{price}</span>
      <span className="text-xs px-2 py-1 rounded bg-gray-100">{status}</span>
    </div>
  </div>
);

export default RequestCard;
