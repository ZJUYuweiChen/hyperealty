#! /bin/bash

. scripts/utils.sh
. scripts/envVar.sh

#! 打包链码
function packageCC(){
    infoln "开始打包链码"
    cli_exec "peer lifecycle chaincode package ${CHAINCODE_PACKAGE} --path ${CHAINCODE_PATH} --lang golang --label chaincode_${Version}"
    ERR "打包链码失败"
    successln "打包链码成功"
}
#! 安装链码
function installCC(){
    infoln "开始安装链码"
    infoln "安装Org1Peer0链码"
    cli_exec "$Org1Peer0Cli peer lifecycle chaincode install ${CHAINCODE_PACKAGE}"
    infoln "安装Org1Peer1链码"
    cli_exec "$Org1Peer1Cli peer lifecycle chaincode install ${CHAINCODE_PACKAGE}"
    infoln "安装Org2Peer0链码"
    cli_exec "$Org2Peer0Cli peer lifecycle chaincode install ${CHAINCODE_PACKAGE}"
    infoln "安装Org2Peer1链码"
    cli_exec "$Org2Peer1Cli peer lifecycle chaincode install ${CHAINCODE_PACKAGE}"
    infoln "安装Org3Peer0链码"
    cli_exec "$Org3Peer0Cli peer lifecycle chaincode install ${CHAINCODE_PACKAGE}"
    infoln "安装Org3Peer1链码"
    cli_exec "$Org3Peer1Cli peer lifecycle chaincode install ${CHAINCODE_PACKAGE}"
    successln "成功安装链码"
}
#! 批准链码
function approveCC(){
    infoln "Approving Chaincode"
    infoln "Getting PackageID"
    PackageID=$(cli_exec "peer lifecycle chaincode calculatepackageid ${CHAINCODE_PACKAGE}")
    successln "PackageID: $PackageID"
    cli_exec "$Org1Peer0Cli peer lifecycle chaincode approveformyorg -o $ORDERER1_ADDRESS --channelID $ChannelName --name $ChainCodeName --version $Version --package-id $PackageID --sequence $Sequence --tls --cafile $ORDERER_CA"
    cli_exec "$Org2Peer0Cli peer lifecycle chaincode approveformyorg -o $ORDERER1_ADDRESS --channelID $ChannelName --name $ChainCodeName --version $Version --package-id $PackageID --sequence $Sequence --tls --cafile $ORDERER_CA"
    cli_exec "$Org3Peer0Cli peer lifecycle chaincode approveformyorg -o $ORDERER1_ADDRESS --channelID $ChannelName --name $ChainCodeName --version $Version --package-id $PackageID --sequence $Sequence --tls --cafile $ORDERER_CA"
    successln "Chaincode approved"
}
#! 提交链码
function commitCC(){
    infoln "Committing Chaincode"
    cli_exec "$Org1Peer0Cli peer lifecycle chaincode commit -o $ORDERER1_ADDRESS --channelID $ChannelName --name $ChainCodeName --version $Version --sequence $Sequence --tls --cafile $ORDERER_CA --peerAddresses $ORG1_PEER0_ADDRESS --tlsRootCertFiles $ORG1_PEER0_TLS_ROOTCERT_FILE --peerAddresses $ORG2_PEER0_ADDRESS --tlsRootCertFiles $ORG2_PEER0_TLS_ROOTCERT_FILE --peerAddresses $ORG3_PEER0_ADDRESS --tlsRootCertFiles $ORG3_PEER0_TLS_ROOTCERT_FILE"
    successln "Chaincode Committed"
}
#! 实例化链码
function invokeCC(){
    infoln "invoking Chaincode"
    eval "$CLI_CMD \"$Org1Peer0Cli peer chaincode invoke -o $ORDERER1_ADDRESS -C $ChannelName -n $ChainCodeName -c '{\\\"function\\\":\\\"InitLedger\\\",\\\"Args\\\":[]}' --tls --cafile $ORDERER_CA --peerAddresses $ORG1_PEER0_ADDRESS --tlsRootCertFiles $ORG1_PEER0_TLS_ROOTCERT_FILE --peerAddresses $ORG2_PEER0_ADDRESS --tlsRootCertFiles $ORG2_PEER0_TLS_ROOTCERT_FILE --peerAddresses $ORG3_PEER0_ADDRESS --tlsRootCertFiles $ORG3_PEER0_TLS_ROOTCERT_FILE\""
    ERR "invoke failed"
    successln "invoked"
}

packageCC
installCC
approveCC
commitCC
invokeCC