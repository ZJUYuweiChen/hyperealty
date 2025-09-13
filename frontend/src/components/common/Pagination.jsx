import React from 'react';
import { Button } from '@/components/ui/button';

const Pagination = ({ 
  page, 
  pageSize, 
  totalCount, 
  totalPages, 
  onPageChange,
  hasNextPage = true
}) => {
  const handlePrevPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(page + 1);
    }
  };

  const startIndex = page * pageSize + 1;
  const endIndex = Math.min((page + 1) * pageSize, totalCount);
  
  // 计算总页数（如果未提供）
  const calculatedTotalPages = totalPages !== undefined ? totalPages : Math.ceil(totalCount / pageSize);

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        显示第 {startIndex} 到 {endIndex} 条，共 {totalCount} 条记录
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={page === 0}
        >
          上一页
        </Button>
        <span className="flex items-center px-3 py-2 text-sm">
          第 {page + 1} 页{calculatedTotalPages > 0 ? `，共 ${calculatedTotalPages} 页` : ''}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={!hasNextPage || (totalPages !== undefined && page >= totalPages - 1) || (totalPages === undefined && (page + 1) * pageSize >= totalCount)}
        >
          下一页
        </Button>
      </div>
    </div>
  );
};

export default Pagination;