# 前后端交互需求说明

## 1. 当前限制

由于我的本地Go环境存在问题，目前无法实现真正的前后端交互。前端项目暂时使用模拟数据来展示功能。

## 2. 前端部署

参考 `frontend/README.md`。

## 3. 前后端交互实现指南

要实现真正的前后端交互，开发者需要修改`/src/api/`目录下的函数，将当前的模拟实现替换为实际的HTTP请求。

### 3.1. 基本修改步骤

1. 安装HTTP客户端库（如axios）：
   ```bash
   npm install axios
   ```

2. 在每个API文件中导入HTTP客户端：
   ```javascript
   import axios from 'axios';
   ```

3. 将模拟函数替换为实际的HTTP请求。

### 3.2. 示例修改

以`Contract.js`中的`QueryCT`函数为例，将：

```javascript
// QueryCT: Simulate querying a contract by its ID
export async function QueryCT(ctID) {
  // 添加0.1秒延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  return contracts.find(contract => contract.ContractID === ctID) || null;
}
```

修改为：

```javascript
// QueryCT: Query a contract by its ID
export async function QueryCT(ctID) {
  try {
    const response = await axios.get(`/api/contracts/${ctID}`);
    return response.data;
  } catch (error) {
    console.error('Error querying contract:', error);
    return null;
  }
}
```

## 4. 需要重点关注的函数差异

### 4.1. Contract.js - CreateCT函数

**文件路径**: `/src/api/Contract.js`  
**行号**: 142-170

**当前实现问题**:
1. 生成的合同ID格式为`CT + 当前年份 + 4位随机数`，可能与后端定义的ID生成规则不一致
2. 使用硬编码的默认值：
   - `developerID`: 'Org1MSP'
   - `contractorID`: 'Org2MSP'
   - `payment`: 500000
3. 状态默认为'Pending'，可能与后端默认状态不一致

**建议修改**:
```javascript
export async function CreateCT(reID) {
  try {
    const response = await axios.post('/api/contracts', {
      realestateID: reID
      // 让后端生成其他字段，包括ID、状态等
    });
    return response.data;
  } catch (error) {
    console.error('Error creating contract:', error);
    return null;
  }
}
```

### 4.2. Realestate.js - CreateRE函数

**文件路径**: `/src/api/Realestate.js`  
**行号**: 94-116

**当前实现问题**:
1. 自动生成的房产ID格式为`RE + 年份后两位 + 3位随机数`，可能与后端定义的ID生成规则不一致
2. 创建时间直接使用前端时间，可能与后端时间戳格式不一致
3. 状态默认为'Pending'，可能与后端默认状态不一致

**建议修改**:
```javascript
export async function CreateRE(address, area, payment) {
  try {
    const response = await axios.post('/api/realestates', {
      address: address,
      area: area,
      payment: payment
      // 让后端生成ID、创建时间、状态等字段
    });
    return response.data;
  } catch (error) {
    console.error('Error creating real estate:', error);
    return null;
  }
}
```

## 5. 推荐的API端点结构

建议后端提供以下RESTful API端点：

- `GET /api/blocks` - 获取区块列表（分页）
- `GET /api/contracts` - 获取合约列表（分页，可筛选状态）
- `GET /api/contracts/{id}` - 获取特定合约详情
- `POST /api/contracts` - 创建新合约
- `POST /api/contracts/{id}/authenticate` - 认证合约完成
- `GET /api/realestates` - 获取房产列表（分页，可筛选状态）
- `GET /api/realestates/{id}` - 获取特定房产详情
- `POST /api/realestates` - 创建新房产