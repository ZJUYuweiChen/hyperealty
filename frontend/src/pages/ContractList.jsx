import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TopNavbar from '@/components/navigation/TopNavbar';
import { FileText } from 'lucide-react';
import { PageCT } from '@/api/Contract';
import { getStatusColor, getStatusText } from '@/utils/status';
import PaginatedList from '@/components/layout/PaginatedList';

const ContractList = () => {
  const location = useLocation();

  const fetchData = async (page, pageSize, bookmark, location) => {
    const status = location.pathname.includes('/contractor/list/')
      ? location.pathname.split('/contractor/list/')[1]
      : null;
    const result = await PageCT(pageSize, bookmark, status);
    return {
      items: result.records,
      totalCount: result.fetchedRecordsCount,
      bookmark: result.bookmark
    };
  };

  const renderItem = (contract) => (
    <Card key={contract.ContractID}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          交易 {contract.ContractID}
        </CardTitle>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contract.CTStatus || contract.status)}`}>
          {getStatusText(contract.CTStatus || contract.status)}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">合约ID</p>
            <p className="font-medium">{contract.ContractID}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">房产ID</p>
            <p className="font-medium">{contract.RealestateID}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">开发商ID</p>
            <p className="font-medium">{contract.DeveloperID}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">承包商ID</p>
            <p className="font-medium">{contract.ContractorID}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">总工资</p>
            <p className="font-medium">¥{contract.Payment?.toLocaleString() || 0}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">创建时间</p>
            <p className="font-medium text-sm">{contract.CreateTime ? new Date(contract.CreateTime).toLocaleString() : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">预期完成时间</p>
            <p className="font-medium text-sm">{contract.DueTime || contract.DueDate ? new Date(contract.DueTime || contract.DueDate).toLocaleString() : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">实际完成时间</p>
            <p className="font-medium text-sm">{contract.UpdateTime ? new Date(contract.UpdateTime).toLocaleString() : '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <PaginatedList
        title="交易列表"
        subtitle="审核建筑交易完成情况"
        icon={FileText}
        fetchData={fetchData}
        renderItem={renderItem}
        noDataDescription="当前没有可显示的交易"
        location={location}
      />
    </div>
  );
};

export default ContractList;
