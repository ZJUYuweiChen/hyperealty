export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Constructing':
      return 'bg-blue-100 text-blue-800';
    case 'Evaluating':
      return 'bg-orange-100 text-orange-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'Pending':
      return '等待接取';
    case 'Constructing':
      return '建设中';
    case 'Evaluating':
      return '等待审核';
    case 'Completed':
      return '已完成';
    case 'Failed':
      return '已失败';
    default:
      return status;
  }
};
