import React from "react";
import clsx from "clsx";
import { Button } from "../button";

interface Transaction {
  date: string;
  amount: string;
  status: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onPayNow?: (index: number) => void;
  className?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onPayNow = () => {},
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "w-full max-w-full bg-white shadow-sm",
        className
      )}
    >
      {/* Table Header */}
      <div className="p-4 border-b">
        <h2 className="text-base font-poppinsmedium text-gray-800">
          Recent Transactions
        </h2>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[500px]">
          <thead className="bg-[#f5f7fa] text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Amount</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr
                key={index}
                className="border-t font-poppinsregular hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {txn.date}
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {txn.amount}
                </td>
                <td
                  className={clsx(
                    "px-4 py-3 font-medium whitespace-nowrap",
                    txn.status === "Completed"
                      ? "text-green-600"
                      : "text-orange-500"
                  )}
                >
                  {txn.status}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {txn.status === "Pending" && (
                    // <button
                    //   onClick={() => onPayNow(index)}
                    //   className="text-sm border border-accent text-blue-500 px-4 py-1 rounded-full hover:bg-blue-50 transition-all"
                    // >
                    //   Pay Now
                    // </button>
                    <Button
                    
                      onClick={() => onPayNow(index)}
                      variant="outline_rounded"
                    >
                      Pay Now
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
