package service

import (
	"application/pkg/fabric"
	"encoding/json"
	"fmt"
	"time"
)

type ContractorService struct{}

const CONTRACTOR_ID = "org2"

// CreateCT 生成交易
func (s *ContractorService) CreateCT(ctID, reID, developerID, contractorID string, payment float64) error {
	contract := fabric.GetContract(CONTRACTOR_ID)
	now := time.Now().Format(time.RFC3339)
	_, err := contract.SubmitTransaction("CreateCT", ctID, reID, developerID, contractorID, fmt.Sprintf("%f", payment), now)
	if err != nil {
		return fmt.Errorf("生成交易失败：%s", fabric.ExtractErrorMessage(err))
	}
	return nil
}

// SubmitCompletion
func (s *ContractorService) SubmitCompletion(ctID string) error {
	contract := fabric.GetContract(CONTRACTOR_ID)
	now := time.Now().Format(time.RFC3339)
	_, err := contract.SubmitTransaction("SubmitCompletion", ctID, now)
	if err != nil {
		return fmt.Errorf("failed to submit completion: %s", fabric.ExtractErrorMessage(err))
	}
	return nil
}

// QueryRE 查询房产信息
func (s *ContractorService) QueryRE(id string) (map[string]interface{}, error) {
	contract := fabric.GetContract(CONTRACTOR_ID)
	result, err := contract.EvaluateTransaction("QueryRE", id)
	if err != nil {
		return nil, fmt.Errorf("查询房产信息失败：%s", fabric.ExtractErrorMessage(err))
	}

	var realEstate map[string]interface{}
	if err := json.Unmarshal(result, &realEstate); err != nil {
		return nil, fmt.Errorf("解析房产数据失败：%v", err)
	}

	return realEstate, nil
}

// QueryCT 查询交易信息
func (s *ContractorService) QueryCT(ctID string) (map[string]interface{}, error) {
	contract := fabric.GetContract(CONTRACTOR_ID)
	result, err := contract.EvaluateTransaction("QueryCT", ctID)
	if err != nil {
		return nil, fmt.Errorf("查询交易信息失败：%s", fabric.ExtractErrorMessage(err))
	}

	var transaction map[string]interface{}
	if err := json.Unmarshal(result, &transaction); err != nil {
		return nil, fmt.Errorf("解析交易数据失败：%v", err)
	}

	return transaction, nil
}

// PageCT 分页查询交易列表
func (s *ContractorService) PageCT(pageSize int32, bookmark string, status string) (map[string]interface{}, error) {
	contract := fabric.GetContract(CONTRACTOR_ID)
	result, err := contract.EvaluateTransaction("PageCT", fmt.Sprintf("%d", pageSize), bookmark, status)
	if err != nil {
		return nil, fmt.Errorf("查询交易列表失败：%s", fabric.ExtractErrorMessage(err))
	}

	var queryResult map[string]interface{}
	if err := json.Unmarshal(result, &queryResult); err != nil {
		return nil, fmt.Errorf("解析查询结果失败：%v", err)
	}

	return queryResult, nil
}

// QueryBlockList 分页查询区块列表
func (s *ContractorService) QueryBlockList(pageSize int, pageNum int) (*fabric.BlockQueryResult, error) {
	result, err := fabric.GetBlockListener().GetBlocksByOrg(CONTRACTOR_ID, pageSize, pageNum)
	if err != nil {
		return nil, fmt.Errorf("查询区块列表失败：%v", err)
	}
	return result, nil
}
