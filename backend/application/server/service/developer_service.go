package service

import (
	"application/pkg/fabric"
	"encoding/json"
	"fmt"
	"time"
)

type DeveloperService struct{}

const DEVELOPER_ID = "org1"

// CreateRE 创建房产信息
func (s *DeveloperService) CreateRE(id, address string, area float64, payment float64) error {
	contract := fabric.GetContract(DEVELOPER_ID)
	now := time.Now().Format(time.RFC3339)
	_, err := contract.SubmitTransaction("CreateRE", id, address, fmt.Sprintf("%f", area), fmt.Sprintf("%f", payment), now)
	if err != nil {
		return fmt.Errorf("创建房产信息失败：%s", fabric.ExtractErrorMessage(err))
	}
	return nil
}

// QueryRE 查询房产信息
func (s *DeveloperService) QueryRE(id string) (map[string]interface{}, error) {
	contract := fabric.GetContract(DEVELOPER_ID)
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

// PageRE 分页查询房产列表
func (s *DeveloperService) PageRE(pageSize int32, bookmark string, status string) (map[string]interface{}, error) {
	contract := fabric.GetContract(DEVELOPER_ID)
	result, err := contract.EvaluateTransaction("PageRE", fmt.Sprintf("%d", pageSize), bookmark, status)
	if err != nil {
		return nil, fmt.Errorf("查询房产列表失败：%s", fabric.ExtractErrorMessage(err))
	}

	var queryResult map[string]interface{}
	if err := json.Unmarshal(result, &queryResult); err != nil {
		return nil, fmt.Errorf("解析查询结果失败：%v", err)
	}

	return queryResult, nil
}

// QueryBlockList 分页查询区块列表
func (s *DeveloperService) QueryBlockList(pageSize int, pageNum int) (*fabric.BlockQueryResult, error) {
	result, err := fabric.GetBlockListener().GetBlocksByOrg(DEVELOPER_ID, pageSize, pageNum)
	if err != nil {
		return nil, fmt.Errorf("查询区块列表失败：%v", err)
	}
	return result, nil
}
