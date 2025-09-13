# 本地部署指南

## NVM 安装

``` 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

## Node.js 16 安装

```
nvm install 18.20.8
nvm use 18.20.8
```

## 下载依赖

```
npm install
```

## 启动开发服务器

```
npm run dev
```

# Docker 部署指南

## Dockerfile 示例

创建 `Dockerfile` 文件：

```dockerfile
# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用源代码
COPY . .

# 构建生产版本
RUN npm run build

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
```

## Docker Compose 示例

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    # 如果需要连接后端服务，可以取消注释以下部分
    # depends_on:
    #   - backend

  # 后端服务示例（如需要）
  # backend:
  #   image: your-backend-image:tag
  #   ports:
  #     - "8081:8081"
  #   environment:
  #     - DATABASE_URL=your-database-url
```

## 构建和运行

1. 构建 Docker 镜像：
```bash
docker build -t hyperealty-frontend .
```

2. 运行容器：
```bash
docker run -p 8080:8080 hyperealty-frontend
```

3. 或者使用 Docker Compose：
```bash
docker-compose up -d
```

## 环境变量配置

在生产环境中，你可能需要配置以下环境变量：

- `VITE_API_URL`: 后端 API 的基础 URL
- `NODE_ENV`: 设置为 `production`

可以通过 Docker 的 `-e` 参数或在 docker-compose.yml 中的 `environment` 部分进行配置。
