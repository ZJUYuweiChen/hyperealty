import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QueryBlockList } from '@/api/Block';

const BlockPreview = ({ viewAllRoute }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const result = await QueryBlockList(3, 0); // 获取前3个区块
        setBlocks(result.blocks);
      } catch (error) {
        console.error('获取区块数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const truncateHash = (hash) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  if (loading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <div key={block.block_num} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">区块 #{block.block_num}</h3>
              <p className="text-sm text-gray-600 truncate">哈希: {truncateHash(block.block_hash)}</p>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              {block.tx_count} 笔交易
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm">
              <span>{block.save_time.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <Button variant="outline" className="w-full" asChild>
          <Link to={viewAllRoute}>
            查看所有区块
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BlockPreview;