import React from 'react';
import TopNavbar from '@/components/navigation/TopNavbar';

const DashboardLayout = ({ title, description, children, role }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;