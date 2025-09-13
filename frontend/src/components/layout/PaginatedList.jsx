import React, { useState, useEffect } from 'react';
import Pagination from '@/components/common/Pagination';
import ListLayout from '@/components/layout/ListLayout';
import ListHeader from '@/components/navigation/ListHeader';
import NoDataCard from '@/components/common/NoDataCard';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { getBackPath, getTitle } from '@/utils/navigation';

const PaginatedList = ({
  title,
  subtitle,
  icon: Icon,
  fetchData,
  renderItem,
  noDataDescription,
  location,
  pageSize = 5,
}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [bookmark, setBookmark] = useState(null);
  const [totalCount, setTotalCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    if (totalCount >= 0 && (items.length >= pageSize * (page + 1) || items.length >= totalCount)) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await fetchData(page, pageSize, bookmark, location);
      setItems(prevItems => [...prevItems, ...result.items]);
      setBookmark(result.bookmark);
      setTotalCount(result.totalCount);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, location.pathname]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isError) {
    return <ErrorDisplay error={error} onReload={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ListHeader
          title={title}
          subtitle={subtitle}
          backPath={getBackPath(location.pathname)}
          backTitle={getTitle(location.pathname)}
        />

        <ListLayout
          items={items || []}
          page={page}
          pageSize={pageSize}
          isLoading={isLoading}
          isError={isError}
          onReload={() => window.location.reload()}
          noDataComponent={
            <NoDataCard
              icon={Icon}
              title={`暂无${title}`}
              description={noDataDescription}
              backPath={getBackPath(location.pathname)}
            />
          }
          renderItem={renderItem}
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          hasNextPage={(page + 1) * pageSize < totalCount}
        />
      </div>
    </div>
  );
};

export default PaginatedList;