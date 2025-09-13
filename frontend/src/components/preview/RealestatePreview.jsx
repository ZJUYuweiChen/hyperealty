import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getStatusColor, getStatusText } from '@/utils/status';
import { PageRE } from '@/api/Realestate';

const RealestatePreview = ({ viewAllRoute }) => {
  const [realestates, setRealestates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealestates = async () => {
      try {
        const result = await PageRE(3, null, null); // 获取前3个房产
        setRealestates(result.records);
      } catch (error) {
        console.error('获取房产数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealestates();
  }, []);

  if (loading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {realestates.map((realestate) => (
        <div key={realestate.REID} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">房产 {realestate.REID}</h3>
              <p className="text-sm text-gray-600 truncate">{realestate.Address}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(realestate.REStatus)}`}>
              {getStatusText(realestate.REStatus)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm">
              <span>{realestate.Area} 平方米</span>
              <span className="mx-2">|</span>
              <span>¥{realestate.Payment?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <Button variant="outline" className="w-full" asChild>
          <Link to={viewAllRoute}>
            查看所有房产
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RealestatePreview;