#! /bin/bash
. scripts/utils.sh
. scripts/envVar.sh

#! 创建创世区块
function createGenesisBlock(){
    infoln "创建创世区块"
    cli_exec "configtxgen -configPath ${HYPERLEDGER_PATH} -profile SampleGenesis -outputBlock ${CONFIG_PATH}/genesis.block -channelID firstchannel"
    ERR "创世区块创建失败"
    successln "成功创建创世区块"
}
#! 生成通道配置
function channelConfig(){
    infoln "生成通道配置"
    cli_exec "configtxgen -configPath ${HYPERLEDGER_PATH} -profile SampleChannel -outputCreateChannelTx ${CONFIG_PATH}/$ChannelName.tx -channelID $ChannelName"
    ERR "生成通道配置失败"
    successln "成功生成通道配置"
}
#! 定义锚节点
function setAnchorPeer(){
    infoln "定义Org1锚节点"
    cli_exec "configtxgen -configPath ${HYPERLEDGER_PATH} -profile SampleChannel -outputAnchorPeersUpdate ${CONFIG_PATH}/Org1Anchor.tx -channelID $ChannelName -asOrg Org1"
    infoln "定义Org2锚节点"
    cli_exec "configtxgen -configPath ${HYPERLEDGER_PATH} -profile SampleChannel -outputAnchorPeersUpdate ${CONFIG_PATH}/Org2Anchor.tx -channelID $ChannelName -asOrg Org2"
    infoln "定义Org3锚节点"
    cli_exec "configtxgen -configPath ${HYPERLEDGER_PATH} -profile SampleChannel -outputAnchorPeersUpdate ${CONFIG_PATH}/Org3Anchor.tx -channelID $ChannelName -asOrg Org3"
}
#! 启动网络
function setNet(){
    infoln "启动结点容器"
    eval "docker compose up -d"
    ERR "启动容器失败"
    successln "结点容器启动"
}
#! 启动通道
function setChannel(){
    infoln "启动通道"
    cli_exec "$Org1Peer0Cli peer channel create --outputBlock ${CONFIG_PATH}/$ChannelName.block -o $ORDERER1_ADDRESS -c $ChannelName -f ${CONFIG_PATH}/$ChannelName.tx --tls --cafile $ORDERER_CA"
    ERR "启动通道失败"
    successln "启动通道成功"
}
#! 加入通道
function joinChannel(){
    infoln "结点加入通道"
    cli_exec "$Org1Peer0Cli peer channel join -b ${CONFIG_PATH}/$ChannelName.block"
    cli_exec "$Org1Peer1Cli peer channel join -b ${CONFIG_PATH}/$ChannelName.block"
    cli_exec "$Org2Peer0Cli peer channel join -b ${CONFIG_PATH}/$ChannelName.block"
    cli_exec "$Org2Peer1Cli peer channel join -b ${CONFIG_PATH}/$ChannelName.block"
    cli_exec "$Org3Peer0Cli peer channel join -b ${CONFIG_PATH}/$ChannelName.block"
    cli_exec "$Org3Peer1Cli peer channel join -b ${CONFIG_PATH}/$ChannelName.block"
}

#! 更新锚节点
function updateAnchorPeer(){
    infoln "更新Org1锚节点"
    cli_exec "$Org1Peer0Cli peer channel update -o $ORDERER1_ADDRESS -c $ChannelName -f ${CONFIG_PATH}/Org1Anchor.tx --tls --cafile $ORDERER_CA"
    infoln "更新Org2锚节点"
    cli_exec "$Org2Peer0Cli peer channel update -o $ORDERER1_ADDRESS -c $ChannelName -f ${CONFIG_PATH}/Org2Anchor.tx --tls --cafile $ORDERER_CA"
    infoln "更新Org3锚节点"
    cli_exec "$Org3Peer0Cli peer channel update -o $ORDERER1_ADDRESS -c $ChannelName -f ${CONFIG_PATH}/Org3Anchor.tx --tls --cafile $ORDERER_CA"
}

createGenesisBlock
channelConfig
setAnchorPeer
sleep 3
setNet
setChannel
joinChannel
updateAnchorPeer