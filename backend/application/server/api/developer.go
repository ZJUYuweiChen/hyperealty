package api

import (
	"application/service"
	"application/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DeveloperHandler struct {
	developerService *service.DeveloperService
}

func NewDeveloperHandler() *DeveloperHandler {
	return &DeveloperHandler{
		developerService: &service.DeveloperService{},
	}
}

// CreateRE 创建房产信息
func (h *DeveloperHandler) CreateRE(c *gin.Context) {
	var req struct {
		ID      string  `json:"id"`
		Address string  `json:"address"`
		Area    float64 `json:"area"`
		Payment float64 `json:"payment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "房产信息格式错误")
		return
	}

	err := h.developerService.CreateRE(req.ID, req.Address, req.Area, req.Payment)
	if err != nil {
		utils.ServerError(c, "创建房产信息失败："+err.Error())
		return
	}

	utils.SuccessWithMessage(c, "房产信息创建成功", nil)
}

// QueryRE 查询房产信息
func (h *DeveloperHandler) QueryRE(c *gin.Context) {
	reID := c.Param("id")
	realEstate, err := h.developerService.QueryRE(reID)
	if err != nil {
		utils.ServerError(c, "查询房产信息失败："+err.Error())
		return
	}

	utils.Success(c, realEstate)
}

// PageRE 分页查询房产列表
func (h *DeveloperHandler) PageRE(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	bookmark := c.DefaultQuery("bookmark", "")
	status := c.DefaultQuery("status", "")

	result, err := h.developerService.PageRE(int32(pageSize), bookmark, status)
	if err != nil {
		utils.ServerError(c, err.Error())
		return
	}

	utils.Success(c, result)
}

// QueryBlockList 分页查询区块列表
func (h *DeveloperHandler) QueryBlockList(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	pageNum, _ := strconv.Atoi(c.DefaultQuery("pageNum", "1"))

	result, err := h.developerService.QueryBlockList(pageSize, pageNum)
	if err != nil {
		utils.ServerError(c, err.Error())
		return
	}

	utils.Success(c, result)
}
