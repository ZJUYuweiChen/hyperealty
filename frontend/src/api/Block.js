const blocks = [
  {
    block_num: 1,
    block_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    data_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    prev_hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    tx_count: 3,
    save_time: new Date('2023-12-05T14:30:25Z')
  },
  {
    block_num: 2,
    block_hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    data_hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    prev_hash: '0x567890abcdef1234567890abcdef1234567890ab',
    tx_count: 1,
    save_time: new Date('2023-12-05T14:25:18Z')
  },
  {
    block_num: 3,
    block_hash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    data_hash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    prev_hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    tx_count: 2,
    save_time: new Date('2023-12-05T14:20:10Z')
  },
  {
    block_num: 4,
    block_hash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    data_hash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
    prev_hash: '0xbcdef1234567890abcdef1234567890abcdef123',
    tx_count: 4,
    save_time: new Date('2023-12-05T14:15:05Z')
  },
  {
    block_num: 5,
    block_hash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcde',
    data_hash: '0x5e6f7890abcdef1234567890abcdef1234567890',
    prev_hash: '0xcdef1234567890abcdef1234567890abcdef1234',
    tx_count: 1,
    save_time: new Date('2023-12-05T14:10:00Z')
  },
  {
    block_num: 6,
    block_hash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef0',
    data_hash: '0x6f7890abcdef1234567890abcdef1234567890ab',
    prev_hash: '0xdef1234567890abcdef1234567890abcdef12345',
    tx_count: 3,
    save_time: new Date('2023-12-05T14:05:55Z')
  },
  {
    block_num: 7,
    block_hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    data_hash: '0x7890abcdef1234567890abcdef1234567890abcd',
    prev_hash: '0xef1234567890abcdef1234567890abcdef123456',
    tx_count: 5,
    save_time: new Date('2023-12-05T14:00:50Z')
  },
  {
    block_num: 8,
    block_hash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    data_hash: '0x890abcdef1234567890abcdef1234567890abcde',
    prev_hash: '0xf1234567890abcdef1234567890abcdef1234567',
    tx_count: 2,
    save_time: new Date('2023-12-05T13:55:45Z')
  },
  {
    block_num: 9,
    block_hash: '0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345',
    data_hash: '0x90abcdef1234567890abcdef1234567890abcdef',
    prev_hash: '0x1234567890abcdef1234567890abcdef12345678',
    tx_count: 6,
    save_time: new Date('2023-12-05T13:50:40Z')
  },
  {
    block_num: 10,
    block_hash: '0x0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    data_hash: '0x0abcdef1234567890abcdef1234567890abcdef1',
    prev_hash: '0x234567890abcdef1234567890abcdef123456789',
    tx_count: 1,
    save_time: new Date('2023-12-05T13:45:35Z')
  }
];

// QueryBlockList: Simulate paginated block queries with 0.1s delay
export async function QueryBlockList(pageSize, pageNum) {
  // Add 0.1s delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const startIndex = pageNum * pageSize; // Adjusted to start from pageNum 0
  const paginatedBlocks = blocks.slice(startIndex, startIndex + pageSize);

  return {
    blocks: paginatedBlocks,
    total: blocks.length,
    pageSize: pageSize,
    pageNum: pageNum,
    hasMore: startIndex + pageSize < blocks.length
  };
}



export default blocks;