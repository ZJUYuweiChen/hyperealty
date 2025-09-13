# 文件结构
---
- network：部署区块链网络所需要的脚本
- chaincode：链码
## Appilication
### Server




# 本地部署
---
- 在`/hyperealty`中运行
	- `sudo ./hyperealty.sh up`：启动区块链网络和服务
	- `sudo ./hyperealty.sh down`：关闭网络和服务
- 更细分的
	- 在`/hyperealty`中运行`./hyperealty.sh prep`拉取镜像
	- `cd ./network`
	- `sudo ./network.sh up`：启动网络
	- `sudo ./network.sh down`：关闭网络
	- `cd ../application`
	- `docker compose up -d`：启动服务
- 不加`sudo`很可能报错

## 开发环境与生产环境
- 提供了两种server镜像
	- `hyperealty.server:latest`使用了Dockerfile.dev，通过挂载go编译的二进制文件到容器中运行服务器，方便开发环境下修改
	- `hyperealty.server:x.0.0`使用了Dockerfile，直接将编译的结果固化在镜像中，适合生产环境
	- 可以通过修改Docker-compose.yaml改变选择的镜像



# Log
---
## 2025/9/8
- 修复了chaincode中queryRE和queryCT循环逻辑错误的问题
- 修复了createCT中复合键生成使用空re的STRATUS的问题
- 增加了开发环境server镜像

## 2025/9/9
- 修复了gin中接受参数和api参数不匹配的问题：统一为id
- 补充了路由`/api/contractor/contract/submit/:id`
- 修复了Authenticate中查询CT状态错误
- 修复了submit、createCT、authenticate逻辑错误，应该重新建立新复合键，而不是覆盖旧复合键