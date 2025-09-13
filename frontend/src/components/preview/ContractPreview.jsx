import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getStatusColor, getStatusText } from '@/utils/status';
import { PageCT } from '@/api/Contract';

const ContractPreview = ({ viewAllRoute }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const result = await PageCT(3, null, null); // 获取前3个交易
        setContracts(result.records);
      } catch (error) {
        console.error('获取交易数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div key={contract.ContractID} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">交易 {contract.ContractID}</h3>
              <p className="text-sm text-gray-600 truncate">房产: {contract.RealestateID}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contract.CTStatus)}`}>
              {getStatusText(contract.CTStatus)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm">
              <span>¥{contract.Payment.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <Button variant="outline" className="w-full" asChild>
          <Link to={viewAllRoute}>
            查看所有交易
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ContractPreview;