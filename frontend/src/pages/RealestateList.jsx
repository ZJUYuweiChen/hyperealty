import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TopNavbar from '@/components/navigation/TopNavbar';
import { Home } from 'lucide-react';
import { PageRE } from '@/api/Realestate';
import { getStatusColor, getStatusText } from '@/utils/status';
import PaginatedList from '@/components/layout/PaginatedList';

const RealestateList = () => {
  const location = useLocation();

  const fetchData = async (page, pageSize, bookmark, location) => {
    const status = location.pathname.includes('/realestate/list/')
      ? location.pathname.split('/realestate/list/')[1]
      : null;
    const result = await PageRE(pageSize, bookmark, status);
    return {
      items: result.records,
      totalCount: result.fetchedRecordsCount,
      bookmark: result.bookmark
    };
  };

  const renderItem = (realestate) => (
    <Card key={realestate.REID}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <Home className="mr-2 h-5 w-5" />
          房产 {realestate.REID}
        </CardTitle>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(realestate.REStatus)}`}>
          {getStatusText(realestate.REStatus)}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">房产ID</p>
            <p className="font-medium">{realestate.REID}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">地址</p>
            <p className="font-medium">{realestate.Address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">面积</p>
            <p className="font-medium">{realestate.Area} 平方米</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">总价</p>
            <p className="font-medium">¥{realestate.Payment?.toLocaleString() || 0}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">创建时间</p>
            <p className="font-medium text-sm">{realestate.CreateTime ? new Date(realestate.CreateTime).toLocaleString() : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">更新时间</p>
            <p className="font-medium text-sm">{realestate.UpdateTime ? new Date(realestate.UpdateTime).toLocaleString() : '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <PaginatedList
        title="房产列表"
        subtitle="查看和管理房产信息"
        icon={Home}
        fetchData={fetchData}
        renderItem={renderItem}
        noDataDescription="当前没有可显示的房产"
        location={location}
      />
    </div>
  );
};

export default RealestateList;