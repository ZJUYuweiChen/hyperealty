import React from 'react';

const ListLayout = ({ 
  items = [], 
  renderItem,
  page,
  pageSize,
  isLoading,
  isError,
  onReload,
  errorTitle = "数据加载失败",
  errorDescription = "请稍后重试",
  loadingText = "加载中...",
  noDataComponent
}) => {
  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600 mb-2">{errorTitle}</h3>
        <p className="text-gray-600 mb-4">{errorDescription}</p>
        {onReload && (
          <button 
            onClick={onReload}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            重新加载
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">{loadingText}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return noDataComponent || null;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {items.slice(page * pageSize, (page + 1) * pageSize).map((item, index) => (
          <React.Fragment key={item.id || item.key || index}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default ListLayout;