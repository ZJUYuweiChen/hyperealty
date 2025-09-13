package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/v2/pkg/cid"
	"github.com/hyperledger/fabric-chaincode-go/v2/shim"
	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
	"github.com/hyperledger/fabric-protos-go-apiv2/peer"
)

type SmartContract struct {
	contractapi.Contract
}

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

//! 基础方法：简单的封装了一些函数以简化具体实现
//! ------------------------------------------------

// 查询 key 对应的 json 并解析到结构 structure ，确保了返回值不为空
func (s *SmartContract) getState(ctx contractapi.TransactionContextInterface, key string, structure interface{}) error {
	buffer, err := ctx.GetStub().GetState(key)
	if err != nil {
		return fmt.Errorf("failed to getState: %v", err)
	}
	if buffer == nil {
		return fmt.Errorf("invalid key: %s", key)
	}

	err = json.Unmarshal(buffer, structure)
	if err != nil {
		return fmt.Errorf("failed to unmarshal: %v", err)
	}
	return nil
}

// 更新 key-value 对
func (s *SmartContract) putState(ctx contractapi.TransactionContextInterface, key string, value interface{}) error {
	jsonSet, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal: %v", err)
	}

	err = ctx.GetStub().PutState(key, jsonSet)
	if err != nil {
		return fmt.Errorf("failed to putstate(key: %s): %v", key, err)
	}
	return nil
}

// 从对象类型和id创建复合键
func (s *SmartContract) createCompositeKey(ctx contractapi.TransactionContextInterface, objectType string, keys []string) (string, error) {
	key, err := ctx.GetStub().CreateCompositeKey(objectType, keys)
	if err != nil {
		return "", fmt.Errorf("failed to create composite key: %v", err)
	}
	return key, nil
}

// 封装获取身份
func (s *SmartContract) getCID(ctx contractapi.TransactionContextInterface) (string, error) {
	CID, err := cid.New(ctx.GetStub())
	if err != nil {
		return "", fmt.Errorf("failed to get CID: %v", err)
	}
	return CID.GetMSPID()
}

// 删除键值对
func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, key string) error {
	value, err := ctx.GetStub().GetState(key)
	if err != nil {
		return fmt.Errorf("failed to get state: %v", err)
	}
	if value == nil {
		return fmt.Errorf("invalid key: %s", key)
	}
	return ctx.GetStub().DelState(key)
}

//! 工作流
//! ----------------------------------------------------------------------------------------

// ! InitLedger 初始化账本
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	log.Println("Initialization Completed")
	return nil
}

// ! 用于网络部署时验证完成
func (s *SmartContract) Confirm(ctx contractapi.TransactionContextInterface) (string, error) {
	return "Completed", nil
}

// ! 创建房产
func (s *SmartContract) CreateRE(ctx contractapi.TransactionContextInterface, reid string, address string, area float64, payment float64, CreateTime time.Time) error {
	// 身份认证
	CID, err := s.getCID(ctx)
	if err != nil {
		return err
	}
	if CID != DEVELOPER_ID {
		return fmt.Errorf("Access Rejection")
	}

	// 参数验证
	if len(reid) == 0 {
		return fmt.Errorf("require ID")
	}
	if len(address) == 0 {
		return fmt.Errorf("require Address")
	}
	if area <= 0 {
		return fmt.Errorf("unvalid Area")
	}
	if payment <= 0 {
		return fmt.Errorf("unvalid Payment")
	}

	// 检查重复id
	key, err := s.createCompositeKey(ctx, RE, []string{PENDING, reid})
	if err != nil {
		return err
	}
	existing, err := ctx.GetStub().GetState(key)
	if err != nil {
		return fmt.Errorf("failed to varify id: %v", err)
	}
	if existing != nil {
		return fmt.Errorf("ID %s already exists", reid)
	}

	// 创建房产信息
	re := Realestate{
		REID:       reid,
		Address:    address,
		Area:       area,
		Payment:    payment,
		REStatus:   PENDING,
		CreateTime: CreateTime,
		UpdateTime: CreateTime,
	}

	err = s.putState(ctx, key, re)
	return err
}

// ! 创建交易合同  CreateCT
func (s *SmartContract) CreateCT(ctx contractapi.TransactionContextInterface, ctID string, reID string, developerID string, contractorID string, payment float64, CreateTime time.Time) error {
	// 身份认证
	CID, err := s.getCID(ctx)
	if err != nil {
		return err
	}
	if CID != CONTRACTOR_ID {
		return fmt.Errorf("Access Rejection")
	}

	// 参数验证
	if len(ctID) == 0 {
		return fmt.Errorf("require Contract ID")
	}
	if len(developerID) == 0 {
		return fmt.Errorf("require Developer ID")
	}
	if len(contractorID) == 0 {
		return fmt.Errorf("require Contractor ID")
	}
	if len(reID) == 0 {
		return fmt.Errorf("require Realestate ID")
	}
	if payment <= 0 {
		return fmt.Errorf("invalid payment")
	}

	// 查询房产
	var re Realestate
	reKey, err := s.createCompositeKey(ctx, RE, []string{PENDING, reID})
	if err != nil {
		return err
	}
	err = s.getState(ctx, reKey, &re) // 将查询得到的房产解析到 re 中
	if err != nil {
		return err
	}

	// 生成交易信息
	ct := Contract{
		ContractID:   ctID,
		DeveloperID:  developerID,
		ContractorID: contractorID,
		REID:         reID,
		Payment:      payment,
		CreateTime:   CreateTime,
		UpdateTime:   CreateTime,
		CTStatus:     CONSTRUCTING,
	}

	// 更新房产状态
	err = s.DeleteAsset(ctx, reKey)
	if err != nil {
		return err
	}
	reKey, err = s.createCompositeKey(ctx, RE, []string{CONSTRUCTING, reID})
	if err != nil {
		return err
	}
	re.REStatus = CONSTRUCTING
	re.UpdateTime = CreateTime
	err = s.putState(ctx, reKey, re)
	if err != nil {
		return err
	}

	// 保存合约
	ctKey, err := s.createCompositeKey(ctx, CT, []string{CONSTRUCTING, ctID})
	if err != nil {
		return err
	}
	err = s.putState(ctx, ctKey, ct)
	return err
}

// ! 发起交易完成请求
func (s *SmartContract) SubmitCompletion(ctx contractapi.TransactionContextInterface, ctID string, updateTime time.Time) error {
	// 身份认证
	CID, err := s.getCID(ctx)
	if err != nil {
		return err
	}
	if CID != CONTRACTOR_ID {
		return fmt.Errorf("Access Rejection")
	}

	// 查询交易
	var ct Contract
	ctKey, err := s.createCompositeKey(ctx, CT, []string{CONSTRUCTING, ctID})
	if err != nil {
		return err
	}
	err = s.getState(ctx, ctKey, &ct)
	if err != nil {
		return err
	}

	// 修改状态
	// 注意应该创建新CT，而不是覆盖旧CT，因为复合键包含状态
	ct.CTStatus = EVALUATING
	ct.UpdateTime = updateTime
	err = s.DeleteAsset(ctx, ctKey)
	if err != nil {
		return err
	}
	ctKey, err = s.createCompositeKey(ctx, CT, []string{EVALUATING, ctID})
	if err != nil {
		return err
	}
	err = s.putState(ctx, ctKey, ct)
	return err
}

// ! 确认交易完成请求
func (s *SmartContract) Authenticate(ctx contractapi.TransactionContextInterface, ctID string, updateTime time.Time) error {
	// 身份认证
	CID, err := s.getCID(ctx)
	if err != nil {
		return err
	}
	if CID != SUPERVISOR_ID {
		return fmt.Errorf("Access Rejection")
	}

	// 查询交易
	var ct Contract
	ctKey, err := s.createCompositeKey(ctx, CT, []string{EVALUATING, ctID})
	if err != nil {
		return err
	}
	err = s.getState(ctx, ctKey, &ct)
	if err != nil {
		return err
	}

	// 修改合约状态为完成，修改更新时间
	err = s.DeleteAsset(ctx, ctKey)
	if err != nil {
		return err
	}
	ctKey, err = s.createCompositeKey(ctx, CT, []string{COMPLETED, ctID})
	if err != nil {
		return err
	}
	ct.CTStatus = COMPLETED
	ct.UpdateTime = updateTime
	err = s.putState(ctx, ctKey, ct)
	if err != nil {
		return err
	}

	// 获取对应房产
	reid := ct.REID
	reKey, err := s.createCompositeKey(ctx, RE, []string{CONSTRUCTING, reid})
	if err != nil {
		return err
	}
	var re Realestate
	err = s.getState(ctx, reKey, &re)
	if err != nil {
		return err
	}
	// 修改对应房产状态为完成
	err = s.DeleteAsset(ctx, reKey)
	if err != nil {
		return err
	}
	re.REStatus = COMPLETED
	re.UpdateTime = updateTime
	reKey, err = s.createCompositeKey(ctx, RE, []string{COMPLETED, reid})
	if err != nil {
		return err
	}
	err = s.putState(ctx, reKey, re)
	return err
}

//! 查询流
//! ------------------------------------------------------------------------

// 遍历所有可能的状态查询房产
func (s *SmartContract) QueryRE(ctx contractapi.TransactionContextInterface, id string) (*Realestate, error) {
	for _, status := range []string{PENDING, CONSTRUCTING} {
		key, err := s.createCompositeKey(ctx, RE, []string{status, id})
		if err != nil {
			return nil, err
		}

		var re Realestate
		err = s.getState(ctx, key, &re)
		if err == nil {
			return &re, nil
		}
	}
	return nil, fmt.Errorf("ID %s not exist", id)
}

// 遍历所有可能的状态查询交易
func (s *SmartContract) QueryCT(ctx contractapi.TransactionContextInterface, id string) (*Contract, error) {
	for _, status := range []string{CONSTRUCTING, EVALUATING, COMPLETED} {
		key, err := s.createCompositeKey(ctx, CT, []string{string(status), id})
		if err != nil {
			return nil, fmt.Errorf("创建复合键失败：%v", err)
		}

		var ct Contract
		err = s.getState(ctx, key, &ct)
		if err == nil {
			return &ct, nil
		}
	}
	return nil, fmt.Errorf("ID %s not exist", id)
}

// 分页查询房产列表
func (s *SmartContract) PageRE(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string, status string) (*QueryResult, error) {
	var iterator shim.StateQueryIteratorInterface
	var metadata *peer.QueryResponseMetadata
	var err error

	if status != "" {
		iterator, metadata, err = ctx.GetStub().GetStateByPartialCompositeKeyWithPagination(
			RE,
			[]string{status},
			pageSize,
			bookmark,
		)
	} else {
		iterator, metadata, err = ctx.GetStub().GetStateByPartialCompositeKeyWithPagination(
			RE,
			[]string{},
			pageSize,
			bookmark,
		)
	}

	if err != nil {
		return nil, fmt.Errorf("查询列表失败：%v", err)
	}
	defer iterator.Close()

	records := make([]interface{}, 0)
	for iterator.HasNext() {
		queryResponse, err := iterator.Next()
		if err != nil {
			return nil, fmt.Errorf("获取下一条记录失败：%v", err)
		}

		var realEstate Realestate
		err = json.Unmarshal(queryResponse.Value, &realEstate)
		if err != nil {
			return nil, fmt.Errorf("解析房产信息失败：%v", err)
		}

		records = append(records, realEstate)
	}

	return &QueryResult{
		Records:             records,
		RecordsCount:        int32(len(records)),
		Bookmark:            metadata.Bookmark,
		FetchedRecordsCount: metadata.FetchedRecordsCount,
	}, nil
}

// 分页查询交易列表
func (s *SmartContract) PageCT(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string, status string) (*QueryResult, error) {
	var iterator shim.StateQueryIteratorInterface
	var metadata *peer.QueryResponseMetadata
	var err error

	if status != "" {
		iterator, metadata, err = ctx.GetStub().GetStateByPartialCompositeKeyWithPagination(
			CT,
			[]string{status},
			pageSize,
			bookmark,
		)
	} else {
		iterator, metadata, err = ctx.GetStub().GetStateByPartialCompositeKeyWithPagination(
			CT,
			[]string{},
			pageSize,
			bookmark,
		)
	}

	if err != nil {
		return nil, fmt.Errorf("查询列表失败：%v", err)
	}
	defer iterator.Close()

	records := make([]interface{}, 0)
	for iterator.HasNext() {
		queryResponse, err := iterator.Next()
		if err != nil {
			return nil, fmt.Errorf("获取下一条记录失败：%v", err)
		}

		var transaction Contract
		err = json.Unmarshal(queryResponse.Value, &transaction)
		if err != nil {
			return nil, fmt.Errorf("解析交易信息失败：%v", err)
		}

		records = append(records, transaction)
	}

	return &QueryResult{
		Records:             records,
		RecordsCount:        int32(len(records)),
		Bookmark:            metadata.Bookmark,
		FetchedRecordsCount: metadata.FetchedRecordsCount,
	}, nil
}

func main() {
	cc, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("Error creating asset-transfer-basic chaincode: %v", err)
	}

	if err := cc.Start(); err != nil {
		log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
	}
}
