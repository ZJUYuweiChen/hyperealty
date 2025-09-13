const contracts = [
  {
    ContractID: 'CT2023001',
    RealestateID: 'RE001',
    DeveloperID: 'Org1MSP',
    ContractorID: 'Org2MSP',
    Payment: 500000,
    CreateTime: new Date('2023-12-01T00:00:00Z'),
    DueDate: new Date('2024-06-01T00:00:00Z'),
    UpdateTime: new Date('2023-12-01T00:00:00Z'),
    CTStatus: 'Evaluating'
  },
  {
    ContractID: 'CT2023002',
    RealestateID: 'RE002',
    DeveloperID: 'Org1MSP',
    ContractorID: 'Org2MSP',
    Payment: 380000,
    CreateTime: new Date('2023-11-28T00:00:00Z'),
    DueDate: new Date('2024-05-28T00:00:00Z'),
    UpdateTime: new Date('2023-11-28T00:00:00Z'),
    CTStatus: 'Evaluating'
  },
  {
    ContractID: 'CT2023003',
    RealestateID: 'RE003',
    DeveloperID: 'Org3MSP',
    ContractorID: 'Org4MSP',
    Payment: 600000,
    CreateTime: new Date('2023-11-25T00:00:00Z'),
    DueDate: new Date('2024-05-25T00:00:00Z'),
    UpdateTime: new Date('2023-11-25T00:00:00Z'),
    CTStatus: 'Constructing'
  },
  {
    ContractID: 'CT2023004',
    RealestateID: 'RE004',
    DeveloperID: 'Org1MSP',
    ContractorID: 'Org2MSP',
    Payment: 320000,
    CreateTime: new Date('2023-11-20T00:00:00Z'),
    DueDate: new Date('2024-05-20T00:00:00Z'),
    UpdateTime: new Date('2023-11-20T00:00:00Z'),
    CTStatus: 'Completed'
  },
  {
    ContractID: 'CT2023005',
    RealestateID: 'RE005',
    DeveloperID: 'Org3MSP',
    ContractorID: 'Org4MSP',
    Payment: 450000,
    CreateTime: new Date('2023-11-15T00:00:00Z'),
    DueDate: new Date('2024-05-15T00:00:00Z'),
    UpdateTime: new Date('2023-11-15T00:00:00Z'),
    CTStatus: 'Failed'
  },
  {
    ContractID: 'CT2023006',
    RealestateID: 'RE006',
    DeveloperID: 'Org1MSP',
    ContractorID: 'Org2MSP',
    Payment: 800000,
    CreateTime: new Date('2023-11-10T00:00:00Z'),
    DueDate: new Date('2024-05-10T00:00:00Z'),
    UpdateTime: new Date('2023-11-10T00:00:00Z'),
    CTStatus: 'Evaluating'
  },
  {
    ContractID: 'CT2023007',
    RealestateID: 'RE007',
    DeveloperID: 'Org3MSP',
    ContractorID: 'Org4MSP',
    Payment: 520000,
    CreateTime: new Date('2023-11-05T00:00:00Z'),
    DueDate: new Date('2024-05-05T00:00:00Z'),
    UpdateTime: new Date('2023-11-05T00:00:00Z'),
    CTStatus: 'Evaluating'
  },
  {
    ContractID: 'CT2023008',
    RealestateID: 'RE008',
    DeveloperID: 'Org1MSP',
    ContractorID: 'Org2MSP',
    Payment: 360000,
    CreateTime: new Date('2023-11-01T00:00:00Z'),
    DueDate: new Date('2024-05-01T00:00:00Z'),
    UpdateTime: new Date('2023-11-01T00:00:00Z'),
    CTStatus: 'Evaluating'
  },
  {
    ContractID: 'CT2023009',
    RealestateID: 'RE009',
    DeveloperID: 'Org3MSP',
    ContractorID: 'Org4MSP',
    Payment: 560000,
    CreateTime: new Date('2023-10-28T00:00:00Z'),
    DueDate: new Date('2024-04-28T00:00:00Z'),
    UpdateTime: new Date('2023-10-28T00:00:00Z'),
    CTStatus: 'Failed'
  },
  {
    ContractID: 'CT2023010',
    RealestateID: 'RE010',
    DeveloperID: 'Org1MSP',
    ContractorID: 'Org2MSP',
    Payment: 680000,
    CreateTime: new Date('2023-10-25T00:00:00Z'),
    DueDate: new Date('2024-04-25T00:00:00Z'),
    UpdateTime: new Date('2023-10-25T00:00:00Z'),
    CTStatus: 'Evaluating'
  }
];

// QueryCT: Simulate querying a contract by its ID
export async function QueryCT(ctID) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  return contracts.find(contract => contract.ContractID === ctID) || null;
}

// PageCT: Simulate paginated contract queries with optional status filtering
export async function PageCT(pageSize, bookmark, status) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));

  let filteredContracts = contracts;
  if (status) {
    filteredContracts = contracts.filter(contract => contract.CTStatus === status);
  }

  const startIndex = bookmark ? contracts.findIndex(c => c.ContractID === bookmark) + 1 : 0;
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + pageSize);

  return {
    records: paginatedContracts,
    recordsCount: paginatedContracts.length,
    bookmark: paginatedContracts.length ? paginatedContracts[paginatedContracts.length - 1].ContractID : null,
    fetchedRecordsCount: filteredContracts.length
  };
}

// CreateCT: Simulate creating a new contract
export async function CreateCT(reID) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 生成默认的合同ID
  const ctID = 'CT' + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000);
  const developerID = 'Org1MSP'; // 默认开发商ID
  const contractorID = 'Org2MSP'; // 默认承包商ID
  const payment = 500000; // 默认报酬
  
  const currentTime = new Date();
  const dueDate = new Date(currentTime);
  dueDate.setMonth(dueDate.getMonth() + 6); // 默认6个月后到期
  
  const newContract = {
    ContractID: ctID,
    RealestateID: reID,
    DeveloperID: developerID,
    ContractorID: contractorID,
    Payment: payment,
    CreateTime: currentTime,
    DueDate: dueDate,
    UpdateTime: currentTime,
    CTStatus: 'Pending'
  };
  contracts.push(newContract);
  return newContract;
}



// Authenticate: Simulate authenticating a contract completion
export async function Authenticate(ctID) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const contract = contracts.find(c => c.ContractID === ctID);
  if (contract && contract.CTStatus === 'Evaluating') {
    contract.CTStatus = 'Completed';
    contract.UpdateTime = new Date(); // 使用当前时间作为更新时间
    return contract;
  }
  return null;
}

export default contracts;