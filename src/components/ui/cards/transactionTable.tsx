import React from 'react';
import type { TransactionType } from '../../../types/course';
import { Button } from '../button';

const TransactionTable: React.FC<{ transactions: TransactionType[] }> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow ">
      <h2 className="text-[16px] font-poppinssemibold p-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm p-4">
          <thead>
            <tr className="text-left  bg-[#f5f7fa] font-poppinsmedium text-[12px] text-gray-500 border-b">
              <th className="py-2 ps-4 pe-2">DATE</th>
              <th className="py-2 px-2">AMT</th>
              <th className="py-2 px-2">STATUS</th>
              <th className="py-2 ps-2 pe-4">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn: TransactionType) => (
              <tr
                key={txn.id}
                className={`border-b hover:bg-[#e6f9ff] `}
              >
                <td className="py-2  text-[#1d2026] font-poppinsmedium text-[12px] whitespace-nowrap ps-4 pe-2">{txn.date}</td>
                <td className="py-2 px-2 font-poppinsemibold text-[14px] text-primary font-bold">${txn.amount}</td>
                <td className="py-2 px-2 font-poppinsmedium text-[12px]">
                  <span
                    className={`font-medium ${
                      txn.status === 'Completed' ? 'text-green-600' : 'text-[#d8a121]'
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="py-2 ps-2 sm:pe-3 pe-1 ">
                  <Button
                     className="mt-0 m-0 px-2 py-[3px] font-poppinsmedium text-[12px] "
                      // onClick={() => onPayNow(index)}
                      variant="outline_rounded"
                    >
                      Pay Now
                    </Button>
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