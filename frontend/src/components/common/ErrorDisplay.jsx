import React from 'react';
import TopNavbar from '@/components/navigation/TopNavbar';
import { Button } from '@/components/ui/button';

const ErrorDisplay = ({ error, onReload }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">数据加载失败</h3>
          <p className="text-gray-600 mb-4">{error ? error.message : '请稍后重试'}</p>
          <Button onClick={onReload}>
            重新加载
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;