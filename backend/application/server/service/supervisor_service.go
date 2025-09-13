package service

import (
	"application/pkg/fabric"
	"encoding/json"
	"fmt"
	"time"
)

type SupervisorService struct{}

const SUPERVISOR_ID = "org3"

// 确认交易完成
func (s *SupervisorService) Authenticate(ctID string) error {
	contract := fabric.GetContract(SUPERVISOR_ID)
	now := time.Now().Format(time.RFC3339)
	_, err := contract.SubmitTransaction("Authenticate", ctID, now)
	if err != nil {
		return fmt.Errorf("failed to authenticate transaction: %s", fabric.ExtractErrorMessage(err))
	}
	return nil
}

// QueryTransaction 查询交易信息
func (s *SupervisorService) QueryCT(ctID string) (map[string]interface{}, error) {
	contract := fabric.GetContract(SUPERVISOR_ID)
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

// QueryTransactionList 分页查询交易列表
func (s *SupervisorService) PageCT(pageSize int32, bookmark string, status string) (map[string]interface{}, error) {
	contract := fabric.GetContract(SUPERVISOR_ID)
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
func (s *SupervisorService) QueryBlockList(pageSize int, pageNum int) (*fabric.BlockQueryResult, error) {
	result, err := fabric.GetBlockListener().GetBlocksByOrg(SUPERVISOR_ID, pageSize, pageNum)
	if err != nil {
		return nil, fmt.Errorf("查询区块列表失败：%v", err)
	}
	return result, nil
}
