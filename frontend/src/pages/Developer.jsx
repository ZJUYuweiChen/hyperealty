import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPreview from '@/components/preview/DashboardPreview';
import DeveloperMain from '@/components/role/DeveloperMain';

const Developer = () => {
  return (
    <DashboardLayout 
      title="开发商工作台" 
      description="发布房产建筑任务，管理项目进度"
    >
      <DeveloperMain />
      <DashboardPreview role="developer" />
    </DashboardLayout>
  );
};

export default Developer;
