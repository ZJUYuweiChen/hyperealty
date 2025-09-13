package main

import (
	"application/api"
	"application/config"
	"application/pkg/fabric"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("开始进行Hyperelaty服务器配置")
	// 初始化配置
	if err := config.InitConfig(); err != nil {
		log.Fatalf("初始化配置失败：%v", err)
	}

	// 初始化 Fabric 客户端
	if err := fabric.InitFabric(); err != nil {
		log.Fatalf("初始化客户端失败：%v", err)
	}

	// 创建 Gin 路由
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	apiGroup := r.Group("/api")

	// 注册路由
	developerHandler := api.NewDeveloperHandler()
	contractorHandler := api.NewContractorHandler()
	supervisorHandler := api.NewSupervisorHandler()

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
		// 提交确认请求
		contractor.POST("/contract/submit/:id", contractorHandler.SubmitCompletion)
		// 查询房产接口
		contractor.GET("/realestate/:id", contractorHandler.QueryRE)
		// 查询交易接口
		contractor.GET("/contract/:id", contractorHandler.QueryCT)
		contractor.GET("/contract/list", contractorHandler.PageCT)
		// 查询区块接口
		contractor.GET("/block/list", contractorHandler.QueryBlockList)
	}

	supervisor := apiGroup.Group("/supervisor")
	{
		// 完成交易
		supervisor.POST("/contract/complete/:id", supervisorHandler.Authenticate)
		// 查询交易接口
		supervisor.GET("/contract/:id", supervisorHandler.QueryCT)
		supervisor.GET("/contract/list", supervisorHandler.PageCT)
		// 查询区块接口
		supervisor.GET("/block/list", supervisorHandler.QueryBlockList)
	}

	// 启动服务器
	addr := fmt.Sprintf(":%d", config.GlobalConfig.Server.Port)
	if err := r.Run(addr); err != nil {
		log.Fatalf("启动服务器失败：%v", err)
	}
	log.Println("服务器启动成功")
}
