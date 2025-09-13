const realestates = [
  {
    REID: 'RE001',
    Address: '北京市朝阳区示例街道123号',
    Area: 120,
    Payment: 500000,
    REStatus: 'Pending',
    CreateTime: new Date('2023-12-01T00:00:00Z'),
    UpdateTime: null
  },
  {
    REID: 'RE002',
    Address: '上海市浦东新区示例路456号',
    Area: 95,
    Payment: 380000,
    REStatus: 'Pending',
    CreateTime: new Date('2023-11-28T00:00:00Z'),
    UpdateTime: null
  },
  {
    REID: 'RE003',
    Address: '广州市天河区示例大道789号',
    Area: 150,
    Payment: 600000,
    REStatus: 'Constructing',
    CreateTime: new Date('2023-11-25T00:00:00Z'),
    UpdateTime: null
  },
  {
    REID: 'RE004',
    Address: '深圳市南山区示例街道101号',
    Area: 80,
    Payment: 320000,
    REStatus: 'Completed',
    CreateTime: new Date('2023-11-20T00:00:00Z'),
    UpdateTime: new Date('2023-11-30T00:00:00Z')
  },
  {
    REID: 'RE005',
    Address: '成都市锦江区示例路102号',
    Area: 110,
    Payment: 450000,
    REStatus: 'Failed',
    CreateTime: new Date('2023-11-15T00:00:00Z'),
    UpdateTime: new Date('2023-11-25T00:00:00Z')
  },
  {
    REID: 'RE006',
    Address: '武汉市武昌区示例街道103号',
    Area: 200,
    Payment: 800000,
    REStatus: 'Pending',
    CreateTime: new Date('2023-11-10T00:00:00Z'),
    UpdateTime: null
  },
  {
    REID: 'RE007',
    Address: '西安市雁塔区示例路104号',
    Area: 130,
    Payment: 520000,
    REStatus: 'Pending',
    CreateTime: new Date('2023-11-05T00:00:00Z'),
    UpdateTime: null
  },
  {
    REID: 'RE008',
    Address: '杭州市西湖区示例街道105号',
    Area: 90,
    Payment: 360000,
    REStatus: 'Constructing',
    CreateTime: new Date('2023-11-01T00:00:00Z'),
    UpdateTime: null
  },
  {
    REID: 'RE009',
    Address: '南京市秦淮区示例路106号',
    Area: 140,
    Payment: 560000,
    REStatus: 'Failed',
    CreateTime: new Date('2023-10-28T00:00:00Z'),
    UpdateTime: new Date('2023-11-05T00:00:00Z')
  },
  {
    REID: 'RE010',
    Address: '重庆市渝中区示例街道107号',
    Area: 170,
    Payment: 680000,
    REStatus: 'Completed',
    CreateTime: new Date('2023-10-25T00:00:00Z'),
    UpdateTime: new Date('2023-11-01T00:00:00Z')
  }
];

// CreateRE: Simulate creating a new real estate
export async function CreateRE(address, area, payment) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 自动生成ID: RE + 当前年份后两位 + 三位随机数
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const randomNum = Math.floor(100 + Math.random() * 900); // 100-999之间的随机数
  const id = `RE${year}${randomNum}`;
  
  const newRealestate = {
    REID: id,
    Address: address,
    Area: area,
    Payment: payment,
    REStatus: 'Pending',
    CreateTime: now, // 使用当前时间作为创建时间
    UpdateTime: null
  };
  realestates.push(newRealestate);
  return newRealestate;
}

// QueryRE: Simulate querying a real estate by its ID
export async function QueryRE(reID) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  return realestates.find(realestate => realestate.REID === reID) || null;
}

// PageRE: Simulate paginated real estate queries with optional status filtering
export async function PageRE(pageSize, bookmark, status) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let filteredRealestates = realestates;
  if (status) {
    filteredRealestates = realestates.filter(realestate => realestate.REStatus === status);
  }

  const startIndex = bookmark ? realestates.findIndex(r => r.REID === bookmark) + 1 : 0;
  const paginatedRealestates = filteredRealestates.slice(startIndex, startIndex + pageSize);

  return {
    records: paginatedRealestates,
    recordsCount: paginatedRealestates.length,
    bookmark: paginatedRealestates.length ? paginatedRealestates[paginatedRealestates.length - 1].REID : null,
    fetchedRecordsCount: filteredRealestates.length
  };
}

export default realestates;
