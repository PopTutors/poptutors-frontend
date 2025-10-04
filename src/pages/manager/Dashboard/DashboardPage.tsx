import React from 'react';
import DashboardLayout from './DashboardLayout';
import Header from './Header';
import StatsCards from './StatsCard';
import TransactionsTable from './Transactions/TransactionTable';
import ChartSalesProfitThree from './ChartsSalesProfit';
import Notifications from './Notification';
import RequestCards from './Requests/RequestCard';
import { useFetch } from '../../../api';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stat, setStat] = React.useState < any > (null);

  // const transactions = [
  //   { id: '#X0001', date: '23 Jul 2025', type: 'Payment', amount: '$50', status: 'Paid' },
  //   { id: '#X0002', date: '22 Jul 2025', type: 'Payment', amount: '$79', status: 'Refunded' },
  // ];

  const { data: bubbleBox = {} } = useFetch < any > (
    ['bubble-box'],
    '/manager-dashboard/bubble-box',
    true,
    { requiresAuth: true }
  );

  const { data: sales = {} } = useFetch < any > (
    ['sales'],
    '/manager-dashboard/analytics',
    true,
    { requiresAuth: true }
  );

  const { data: newRequests = {} } = useFetch < any > (
    ['newRequests'],
    '/manager-dashboard/new-requests',
    true,
    { requiresAuth: true }
  );


  const { data: recentTransactions = {} } = useFetch < any > (
    ['recentTransactions'],
    '/manager-dashboard/recent-transactions',
    true,
    { requiresAuth: true }
  );

  return (
    <DashboardLayout>
      <Header />
      <StatsCards bubbleBox={bubbleBox} setStat={setStat} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
        {/* Left (70%) */}
        <div className="lg:col-span-7 col-span-1">
          <ChartSalesProfitThree sales={sales} stat={stat} />
        </div>

        {/* Right (30%) */}
        <div className="lg:col-span-3 col-span-1">
          <Notifications />
        </div>
      </div>

      <div className="mt-4 mb-4">
        {/* fixed JSX + use navigate from react-router */}
        <RequestCards
          items={newRequests?.items?.reverse()?.slice(0, 6)}
          onViewAll={() => navigate('/manager/job-listing')}
          stat={stat}
        />
      </div>

      <TransactionsTable payments={recentTransactions} />
    </DashboardLayout>
  );
};

export default DashboardPage;
