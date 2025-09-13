package api

import (
	"application/service"
	"application/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type SupervisorHandler struct {
	supervisorService *service.SupervisorService
}

func NewSupervisorHandler() *SupervisorHandler {
	return &SupervisorHandler{
		supervisorService: &service.SupervisorService{},
	}
}

// 确认交易完成
func (h *SupervisorHandler) Authenticate(c *gin.Context) {
	ctID := c.Param("id")
	err := h.supervisorService.Authenticate(ctID)
	if err != nil {
		utils.ServerError(c, "完成交易失败："+err.Error())
		return
	}

	utils.SuccessWithMessage(c, "交易完成", nil)
}

// QueryCT 查询交易信息
func (h *SupervisorHandler) QueryCT(c *gin.Context) {
	ctID := c.Param("id")
	transaction, err := h.supervisorService.QueryCT(ctID)
	if err != nil {
		utils.ServerError(c, "查询交易信息失败："+err.Error())
		return
	}

	utils.Success(c, transaction)
}

// PageCT 分页查询交易列表
func (h *SupervisorHandler) PageCT(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	bookmark := c.DefaultQuery("bookmark", "")
	status := c.DefaultQuery("status", "")

	result, err := h.supervisorService.PageCT(int32(pageSize), bookmark, status)
	if err != nil {
		utils.ServerError(c, err.Error())
		return
	}

	utils.Success(c, result)
}

// QueryBlockList 分页查询区块列表
func (h *SupervisorHandler) QueryBlockList(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	pageNum, _ := strconv.Atoi(c.DefaultQuery("pageNum", "1"))

	result, err := h.supervisorService.QueryBlockList(pageSize, pageNum)
	if err != nil {
		utils.ServerError(c, err.Error())
		return
	}

	utils.Success(c, result)
}
