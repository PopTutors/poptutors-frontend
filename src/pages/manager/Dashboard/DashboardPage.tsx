import React from 'react';
import DashboardLayout from './DashboardLayout';
import Header from './Header';
import StatsCards from './StatsCard';
import RequestCard from './Requests/RequestCard';
import TransactionsTable from './Transactions/TransactionTable';
import ChartSalesProfitThree from './ChartsSalesProfit';
import NotificationList from '../../../components/ui/cards/notificationList';
import Notifications from './Notification';
import RequestCards from './Requests/RequestCard';

const DashboardPage: React.FC = () => {
  const transactions = [
    { id: '#X0001', date: '23 Jul 2025', type: 'Payment', amount: '$50', status: 'Paid' },
    { id: '#X0002', date: '22 Jul 2025', type: 'Payment', amount: '$79', status: 'Refunded' },
  ];

  return (
    <DashboardLayout>
      <Header />
      <StatsCards />
      <div className="grid grid-cols-10 gap-4">
        {/* Left (70%) */}
        <div className="col-span-7">
          <ChartSalesProfitThree />
        </div>

        {/* Right (30%) */}
        <div className="col-span-3">
          <Notifications />
        </div>
      </div>
      {/* Chart & Notifications would go here */}
      <div className="mt-4 mb-4">
        <RequestCards />
      </div>
      <TransactionsTable data={transactions} />
    </DashboardLayout>
  );
};

export default DashboardPage;
