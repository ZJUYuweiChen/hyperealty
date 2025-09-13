import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPreview from '@/components/preview/DashboardPreview';
import ContractorMain from '@/components/role/ContractorMain';

const Contractor = () => {
  return (
    <DashboardLayout 
      title="承包商工作台" 
      description="接取建筑任务，提交完成请求"
    >
      <ContractorMain />
      <DashboardPreview role="contractor" />
    </DashboardLayout>
  );
};

export default Contractor;
