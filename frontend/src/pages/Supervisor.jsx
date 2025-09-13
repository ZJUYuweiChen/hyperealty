import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPreview from '@/components/preview/DashboardPreview';
import SupervisorMain from '@/components/role/SupervisorMain';

const Supervisor = () => {
  return (
    <DashboardLayout 
      title="监督者工作台" 
      description="审核建筑任务完成情况"
    >
      <SupervisorMain />
      <DashboardPreview role="supervisor" />
    </DashboardLayout>
  )
};

export default Supervisor;
