#! /bin/bash



. ./scripts/utils.sh
. ./scripts/envVar.sh


#! 检查环境
check_prerequisites() {
    local prerequisites=("docker" "docker-compose")

    for cmd in "${prerequisites[@]}"; do
        if ! command -v $cmd &> /dev/null; then
            errorln "命令 '$cmd' 未找到。请确保已安装所有必需的组件。"
            exit 1
        fi
    done

    if ! docker info &> /dev/null; then
        errorln "Docker 服务未运行"
        exit 1
    fi
    successln "环境检查通过"
}

function networkUp(){
    #! 检查环境
    infoln "检查环境"
    check_prerequisites

    warnln "开启网络将清理旧数据"
    read -p "你确定要继续执行吗？输入 y 继续执行：" confirm
    if [[ "$confirm" != "y" ]]; then
        infoln "网络创建被取消"
        exit 2
    fi

    #! 清理环境
    infoln "清理残留的容器、数据"
    networkDown
    mkdir config crypto-config data
    
    #! 启动工具容器
    infoln "启动CLI工具容器"
    docker-compose up -d ${CLI_CONTAINER}
    ERR "启动CLI失败"
    successln "启动工具容器成功"

    #! 生成组织材料
    infoln "生成组织材料"
    cli_exec "cryptogen generate --config=${HYPERLEDGER_PATH}/crypto-config.yaml --output=${CRYPTO_PATH}"
    ERR "生成材料失败"
    successln "成功生成组织材料"

    #! 部署通道
    infoln "开始部署通道"
    scripts/channel.sh
    ERR "部署通道失败"
    successln "成功部署通道"

    #! 部署链码
    infoln "开始部署链码"
    scripts/deployCC.sh
    ERR "部署链码失败"
    successln "成功部署链码"

    if $CLI_CMD "$Org1Peer0Cli peer chaincode query -C $ChannelName -n $ChainCodeName -c '{\"Args\":[\"Confirm\"]}'" 2>&1 | grep "Completed"; then
        successln "Hyperealty network is ready for you, sir"
        exit 0
    fi

    fatalln "failed to deploy network"
}


#! =========================================================
#! 关闭网络
# 清理docker容器
function clean_network() {
    infoln "清理结点容器..."
    docker compose down --volumes --remove-orphans 
    docker rm -f $(docker ps -a | grep "dev-peer*" | awk '{print $1}') 2>/dev/null || true
    successln "结点容器清理完成"
}
# 清理链码容器和镜像
function clean_chaincode() {
    infoln "清理链码相关容器和镜像..."
    docker rmi -f $(docker images -a | grep "dev-peer*" | awk '{print $3}') 2>/dev/null || true
    successln "链码清理完成"
}
# 清理数据文件
function clean_files() {
    infoln "正在清理本地文件..."
    rm -rf config crypto-config data
    successln "数据文件清理完成"
}
function networkDown(){
    infoln "正在关闭Hyperealty网络"
    # 执行清理步骤
    clean_network
    clean_chaincode
    clean_files
    successln "Hyperealty网络已关闭"
}

## Parse mode
if [[ $# -lt 1 ]] ; then
    fatalln "receiving no arguments"
else
    MODE=$1
    shift
fi

if [ "$MODE" == "up" ]; then
    networkUp
elif [ "$MODE" == "down" ]; then
    networkDown
fi

#! 文件结构
# /hyperealty
#   /crypto-config
#       /peerOrganization
#       /ordererOrganization
#   /channel-artifacts



#   config.yaml
#   crypto-config.yaml