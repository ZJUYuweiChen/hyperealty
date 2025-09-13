package api

import (
	"application/service"
	"application/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ContractorHandler struct {
	contractorService *service.ContractorService
}

func NewContractorHandler() *ContractorHandler {
	return &ContractorHandler{
		contractorService: &service.ContractorService{},
	}
}

// CreateCT 生成交易（仅交易平台组织可以调用）
func (h *ContractorHandler) CreateCT(c *gin.Context) {
	var req struct {
		ContractID   string  `json:"ContractID"`   // 合约ID
		REID         string  `json:"RealestateID"` // 房产ID
		DeveloperID  string  `json:"DeveloperID"`  // 开发商ID
		ContractorID string  `json:"ContractorID"` // 承包商ID
		Payment      float64 `json:"Payment"`      // 总工资
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "交易信息格式错误")
		return
	}

	err := h.contractorService.CreateCT(req.ContractID, req.REID, req.DeveloperID, req.ContractorID, req.Payment)
	if err != nil {
		utils.ServerError(c, "生成交易失败："+err.Error())
		return
	}

	utils.SuccessWithMessage(c, "交易创建成功", nil)
}

// SubmitCompletion 提交确认请求
func (h *ContractorHandler) SubmitCompletion(c *gin.Context) {
	ctID := c.Param("id")
	err := h.contractorService.SubmitCompletion(ctID)
	if err != nil {
		utils.ServerError(c, " 提交确认请求失败："+err.Error())
		return
	}

	utils.SuccessWithMessage(c, "提交确认请求成功", nil)
}

// QueryRE 查询房产信息
func (h *ContractorHandler) QueryRE(c *gin.Context) {
	reID := c.Param("id")
	realEstate, err := h.contractorService.QueryRE(reID)
	if err != nil {
		utils.ServerError(c, "查询房产信息失败："+err.Error())
		return
	}

	utils.Success(c, realEstate)
}

// QueryCT 查询交易信息
func (h *ContractorHandler) QueryCT(c *gin.Context) {
	ctID := c.Param("id")
	transaction, err := h.contractorService.QueryCT(ctID)
	if err != nil {
		utils.ServerError(c, "查询交易信息失败："+err.Error())
		return
	}

	utils.Success(c, transaction)
}

// PageCT 分页查询交易列表
func (h *ContractorHandler) PageCT(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	bookmark := c.DefaultQuery("bookmark", "")
	status := c.DefaultQuery("status", "")

	result, err := h.contractorService.PageCT(int32(pageSize), bookmark, status)
	if err != nil {
		utils.ServerError(c, err.Error())
		return
	}

	utils.Success(c, result)
}

// QueryBlockList 分页查询区块列表
func (h *ContractorHandler) QueryBlockList(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	pageNum, _ := strconv.Atoi(c.DefaultQuery("pageNum", "1"))

	result, err := h.contractorService.QueryBlockList(pageSize, pageNum)
	if err != nil {
		utils.ServerError(c, err.Error())
		return
	}

	utils.Success(c, result)
}
