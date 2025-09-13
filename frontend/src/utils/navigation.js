/**
 * 根据当前路径获取返回路径
 * @param {string} pathname - 当前路径
 * @returns {string} 返回路径
 */
export const getBackPath = (pathname) => {
  if (pathname.includes('/developer/')) return '/developer';
  if (pathname.includes('/contractor/')) return '/contractor';
  if (pathname.includes('/supervisor/')) return '/supervisor';
  return '/';
};

/**
 * 根据当前路径获取标题
 * @param {string} pathname - 当前路径
 * @returns {string} 标题
 */
export const getTitle = (pathname) => {
  if (pathname.includes('/developer/')) return '开发商工作台';
  if (pathname.includes('/contractor/')) return '承包商工作台';
  if (pathname.includes('/supervisor/')) return '监督者工作台';
  return '工作台';
};