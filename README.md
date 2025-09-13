# 重要！！！
先读 `frontend/REQUIREMENTS.md`，完成前后端交互。

---

# 项目概述
---
- 本项目旨在解决开发商、承包商、工人间的交易可信度问题
## 组织
- 项目包括三个组织
	- Org1：开发商（Developer）
	- Org2：承包商（Contractor）
	- Org3：监督者（Supervisor）
- 开发商会发布建筑房产的任务，承包商可以接取任务，在完成后提起完成请求，监督者审核通过后任务完成


## 业务逻辑
- 开发商：
	- 提交房产信息
	- 查询房产信息
	- 查询合同信息
	- 查询区块信息
- 承包商
	- 接取建筑任务
	- 发起完成请求
	- 查询房产信息
	- 查询合同信息
	- 查询区块信息
- 监督者
	- 审核完成请求
	- 查询合同信息
	- 查询区块信息

# 项目架构
---
- 项目从下至上分为网络层、链码层、服务层
## 网络层
- 利用Docker部署区块链网络，网络定义在`/hyperealty/network/docker-compose.yml`中
- 组织定义在`config.yml`和`crypto-config.yml`中

## 链码层
- 链码`/hyperealty/chaincode/chaincode.go`编写了业务逻辑，为服务器层提供SDK
### 结构
- `Realestate`：房产结构体
- `Contract`：合同结构体
- 对于两个结构设计了状态`Status`
	- `Pending`：房产任务待接取
	- `Constructing`：房产正在建筑中/合同正在工作中
	- `Evaluating`：合同正在审核中
	- `Completed`：房产已完成/合同已完成
	- `Failed`：房产建筑失败/合同失败
- 以下来源chaincode.go
```go
// ! 用于创建复合键
const (
	RE string = "RE"
	CT string = "CT"
)

// ! 定义组织枚举
const (
	DEVELOPER_ID  = "Org1MSP"
	CONTRACTOR_ID = "Org2MSP"
	SUPERVISOR_ID = "Org3MSP"
)

// ! 定义合约状态枚举
const (
	PENDING      string = "Pending"      // 待处理
	CONSTRUCTING string = "Constructing" // 正在工作
	COMPLETED    string = "Completed"    // 成功
	FAILED       string = "Failed"       // 失败
	EVALUATING   string = "Evaluating"   //  审核中
)

// ! 定义房产结构
type Realestate struct {
	REID       string    `json:"REID"`
	Area       float64   `json:"Area"`
	Address    string    `json:"Address"`
	Payment    float64   `json:"Payment"`
	CreateTime time.Time `json:"CreateTime"` // 创建时间
	UpdateTime time.Time `json:"UpdateTime"` // 更新时间
	REStatus   string    `json:"REStatus"`
}

// ! 定义交易合同结构：Contract
type Contract struct {
	// 合约信息
	ContractID string `json:"ContractID"` // 合约ID
	// 参与者
	REID         string `json:"RealestateID"` // 房产ID
	DeveloperID  string `json:"DeveloperID"`  // 开发商ID
	ContractorID string `json:"ContractorID"` // 承包商ID
	// 资金信息
	Payment float64 `json:"Payment"` // 总工资
	// 时间信息
	CreateTime time.Time `json:"CreateTime"` // 创建时间
	DueTime    time.Time `json:"DueDate"`    // 预期完成时间
	UpdateTime time.Time `json:"UpdateTime"` // 实际完成时间
	// 交易状态
	CTStatus string `json:"CTStatus"` // 当前状态
}

// ! 定义查询结构
type QueryResult struct {
	Records             []interface{} `json:"records"`             // 记录列表
	RecordsCount        int32         `json:"recordsCount"`        // 本次返回的记录数
	Bookmark            string        `json:"bookmark"`            // 书签，用于下一页查询
	FetchedRecordsCount int32         `json:"fetchedRecordsCount"` // 总共获取的记录数
}

```
### 主要函数
- `CreateRE`：创建房产
- `CreateCT`：创建合同
- `SubmitCompletion`：提交完成请求
- `Authenticate`：同意完成请求
- `QueryRE`：根据ID查询房产信息
- `QueryCT`：根据ID查询合同信息
- `PageRE`：页查询房产信息
- `PageCT`：页查询合同信息

```go
func (s *SmartContract) CreateRE(ctx contractapi.TransactionContextInterface, reid string, address string, area float64, payment float64, CreateTime time.Time) error

func (s *SmartContract) CreateCT(ctx contractapi.TransactionContextInterface, ctID string, reID string, developerID string, contractorID string, payment float64, CreateTime time.Time) error

func (s *SmartContract) SubmitCompletion(ctx contractapi.TransactionContextInterface, ctID string) error

func (s *SmartContract) Authenticate(ctx contractapi.TransactionContextInterface, ctID string, updateTime time.Time) error

func (s *SmartContract) QueryRE(ctx contractapi.TransactionContextInterface, id string) (*Realestate, error)

func (s *SmartContract) QueryCT(ctx contractapi.TransactionContextInterface, id string) (*Contract, error)

func (s *SmartContract) PageRE(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string, status string) (*QueryResult, error)

func (s *SmartContract) PageCT(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string, status string) (*QueryResult, error)
```

### 其他
- 链码层查询使用了`CompositeKey`组合键，通过调用`createCompositeKey`将对象类型、对象状态、对象ID组合成一个key

## 服务层
### 后端
- 使用gin框架
- 将`/hyperealty/application/server`挂载到容器上模拟服务器
- Service负责调用链码，API则调用Service
#### Service
##### Structure Definations
- 以下来源`hyperelaty/server/pkg/block_listner.go`
```go
// BlockData 区块数据结构
type BlockData struct {
	BlockNum  uint64    `json:"block_num"`
	BlockHash string    `json:"block_hash"`
	DataHash  string    `json:"data_hash"`
	PrevHash  string    `json:"prev_hash"`
	TxCount   int       `json:"tx_count"`
	SaveTime  time.Time `json:"save_time"`
}

// BlockQueryResult 区块查询结果
type BlockQueryResult struct {
	Blocks   []*BlockData `json:"blocks"`    // 区块数据列表
	Total    int          `json:"total"`     // 总记录数
	PageSize int          `json:"page_size"` // 每页大小
	PageNum  int          `json:"page_num"`  // 当前页码
	HasMore  bool         `json:"has_more"`  // 是否还有更多数据
}
```
#####  Functions
- `developer_service.go`
```go
// CreateRE 创建房产信息
func (s *DeveloperService) CreateRE(id, address string, area float64, payment float64) error

// QueryRE 查询房产信息
func (s *DeveloperService) QueryRE(id string) (map[string]interface{}, error)

// PageRE 分页查询房产列表
func (s *DeveloperService) PageRE(pageSize int32, bookmark string, status string) (map[string]interface{}, error)

// QueryBlockList 分页查询区块列表
func (s *DeveloperService) QueryBlockList(pageSize int, pageNum int) (*fabric.BlockQueryResult, error)
```
- `contractor_service.go`
```go
// CreateCT 生成交易
func (s *ContractorService) CreateCT(ctID, reID, developerID, contractorID string, payment float64) error

// QueryRE 查询房产信息
func (s *ContractorService) QueryRE(id string) (map[string]interface{}, error)

// QueryCT 查询交易信息
func (s *ContractorService) QueryCT(ctID string) (map[string]interface{}, error)

// PageCT 分页查询交易列表
func (s *ContractorService) PageCT(pageSize int32, bookmark string, status string) (map[string]interface{}, error)

// QueryBlockList 分页查询区块列表
func (s *ContractorService) QueryBlockList(pageSize int, pageNum int) (*fabric.BlockQueryResult, error)
```
- `supervisor_service.go`
```go
// 确认交易完成
func (s *SupervisorService) Authenticate(ctID string) error

// QueryTransaction 查询交易信息
func (s *SupervisorService) QueryCT(ctID string) (map[string]interface{}, error) 

// QueryTransactionList 分页查询交易列表
func (s *SupervisorService) PageCT(pageSize int32, bookmark string, status string) (map[string]interface{}, error)

// QueryBlockList 分页查询区块列表
func (s *SupervisorService) QueryBlockList(pageSize int, pageNum int) (*fabric.BlockQueryResult, error)
```

#### API
- `developer.go`
```go
// CreateRE 创建房产信息
// Args: Json
//  ID      string  `json:"id"`
//	Address string  `json:"address"`
//	Area    float64 `json:"area"`
//	Payment float64 `json:"payment"`
func (h *DeveloperHandler) CreateRE(c *gin.Context)

// QueryRE 查询房产信息
// Args: reID
func (h *DeveloperHandler) QueryRE(c *gin.Context)

// PageRE 分页查询房产列表
func (h *DeveloperHandler) PageRE(c *gin.Context)

// QueryBlockList 分页查询区块列表
func (h *DeveloperHandler) QueryBlockList(c *gin.Context)
```
- `contractor.go`
```go
// CreateCT 生成交易（仅交易平台组织可以调用）
// Args: Json
//  ContractID   string `json:"ContractID"`    
//  REID         string `json:"RealestateID"` 
//	DeveloperID  string `json:"DeveloperID"`  
//	ContractorID string `json:"ContractorID"` 
//	Payment      float64 `json:"Payment"`       
func (h *ContractorHandler) CreateCT(c *gin.Context)

// QueryRE 查询房产信息
// Args: reID string
func (h *ContractorHandler) QueryRE(c *gin.Context)

// QueryCT 查询交易信息
// Args: ctID string
func (h *ContractorHandler) QueryCT(c *gin.Context)

// PageCT 分页查询交易列表
func (h *ContractorHandler) PageCT(c *gin.Context)

// QueryBlockList 分页查询区块列表
func (h *ContractorHandler) QueryBlockList(c *gin.Context)
```
- `supervisor.go`
```go
// 确认交易完成
// Args: ctID string
func (h *SupervisorHandler) Authenticate(c *gin.Context)

// QueryCT 查询交易信息
// Args: ctID string
func (h *SupervisorHandler) QueryCT(c *gin.Context)

// PageCT 分页查询交易列表
func (h *SupervisorHandler) PageCT(c *gin.Context)

// QueryBlockList 分页查询区块列表
func (h *SupervisorHandler) QueryBlockList(c *gin.Context)
```


#### Router
- gin框架下注册的路由
- `main.go`
```go
developer := apiGroup.Group("/developer")
{
	// 创建房产信息
	developer.POST("/realestate/create", developerHandler.CreateRE)
	// 查询房产接口
	developer.GET("/realestate/:id", developerHandler.QueryRE)
	developer.GET("/realestate/list", developerHandler.PageRE)
	// 查询区块接口
	developer.GET("/block/list", developerHandler.QueryBlockList)
}

contractor := apiGroup.Group("/contractor")
{
	// 生成交易
	contractor.POST("/contract/create", contractorHandler.CreateCT)
	// 查询房产接口
	contractor.GET("/realestate/:id", contractorHandler.QueryRE)
	// 查询交易接口
	contractor.GET("/contract/:ctID", contractorHandler.QueryCT)
	contractor.GET("/contract/list", contractorHandler.PageCT)
	// 查询区块接口
	contractor.GET("/block/list", contractorHandler.QueryBlockList)
}

supervisor := apiGroup.Group("/supervisor")
{
	// 完成交易
	supervisor.POST("/contract/complete/:ctID", supervisorHandler.Authenticate)
	// 查询交易接口
	supervisor.GET("/contract/:ctID", supervisorHandler.QueryCT)
	supervisor.GET("/contract/list", supervisorHandler.PageCT)
	// 查询区块接口
	supervisor.GET("/block/list", supervisorHandler.QueryBlockList)
}
```

### 前端

```
frontend/
├── .gitignore
├── .npmrc
├── .nvmrc
├── README.md
├── components.json
├── hmr-client.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   └── images/
│       └── logo.png
├── src/
│   ├── App.jsx
│   ├── api/
│   │   ├── Block.js
│   │   ├── Contract.js
│   │   └── Realestate.js
│   ├── components/
│   │   ├── common/
│   │   ├── form/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── preview/
│   │   ├── role/
│   │   └── ui/
│   ├── index.css
│   ├── main.jsx
│   ├── nav-items.jsx
│   ├── pages/
│   │   ├── BlockList.jsx
│   │   ├── ContractList.jsx
│   │   ├── Contractor.jsx
│   │   ├── Developer.jsx
│   │   ├── Index.jsx
│   │   ├── RealestateList.jsx
│   │   └── Supervisor.jsx
│   └── utils/
│       ├── classname.js
│       ├── navigation.js
│       └── status.js
├── tailwind.config.js
├── vite.config.js
└── yarn.lock
```

#### 根目录文件
- `index.html`: 应用入口HTML文件
- `package.json`: 项目依赖和脚本配置
- `vite.config.js`: Vite构建工具配置
- `tailwind.config.js`: Tailwind CSS框架配置
- `jsconfig.json`: JavaScript项目配置，包含路径别名设置

#### src/ 目录
- `App.jsx`: 主应用组件
- `main.jsx`: 应用入口点
- `index.css`: 全局样式文件

#### src/api/
存放与后端API交互的模块：
- `Block.js`: 区块链区块相关API
- `Contract.js`: 合约相关API
- `Realestate.js`: 房产相关API

#### src/components/
React组件库，按功能分类：
- `ui/`: 通用UI组件（按钮、卡片、表单元素等）
- `layout/`: 页面布局组件
- `navigation/`: 导航相关组件
- `preview/`: 数据预览组件
- `form/`: 表单组件
- `common/`: 通用组件
- `role/`: 角色特定组件

#### src/pages/
页面级组件，每个角色和功能模块都有对应的页面：
- `Index.jsx`: 首页
- `BlockList.jsx`: 区块列表页
- `ContractList.jsx`: 合约列表页
- `RealestateList.jsx`: 房产列表页
- `Developer.jsx`: 开发商角色页面
- `Contractor.jsx`: 承包商角色页面
- `Supervisor`: 监理角色页面

#### src/utils/
工具函数：
- `classname.js`: CSS类名处理工具
- `navigation.js`: 导航相关工具
- `status.js`: 状态处理工具

#### public/
静态资源目录：
- `images/`: 图片资源
