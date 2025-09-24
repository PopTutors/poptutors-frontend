import React from 'react';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
