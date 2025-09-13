import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { CardContent, CardHeader, Card, CardTitle } from '@/components/ui/card';
import TopNavbar from '@/components/navigation/TopNavbar';
import { Link as LinkIcon, Clock, Hash } from 'lucide-react';
import React from 'react';
import { QueryBlockList } from '@/api/Block';
import PaginatedList from '@/components/layout/PaginatedList';

const BlockList = () => {
  const location = useLocation();

  const truncateHash = (hash) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const fetchData = async (page, pageSize, bookmark, location) => {
    const result = await QueryBlockList(pageSize, page);
    return {
      items: result.blocks,
      totalCount: result.total,
      bookmark: null
    };
  };

  const renderItem = (block) => (
    <Card key={block.block_num}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <LinkIcon className="mr-2 h-5 w-5" />
              区块 #{block.block_num}
            </CardTitle>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Hash className="mr-1 h-4 w-4" />
              <span className="font-mono">{truncateHash(block.block_hash)}</span>
            </div>
          </div>
          <Badge variant="outline">
            {block.tx_count} 笔交易
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">区块高度</p>
            <p className="font-medium">{block.block_num}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">交易数量</p>
            <p className="font-medium">{block.tx_count} 笔</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">时间戳</p>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-gray-400" />
              <p className="font-medium">{block.save_time.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">区块哈希</p>
            <div className="text-sm text-gray-600">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded inline-block w-full break-all">
                {block.block_hash}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <PaginatedList
        title="区块列表"
        subtitle="查看Hyperledger Fabric区块链数据"
        icon={LinkIcon}
        fetchData={fetchData}
        renderItem={renderItem}
        noDataDescription="区块链网络中还没有生成区块"
        location={location}
      />
    </div>
  );
};

export default BlockList;
