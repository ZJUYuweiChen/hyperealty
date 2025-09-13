#! /bin/bash
# 域名配置
DOMAIN="hyperealty.com"
CLI_CONTAINER="cli.${DOMAIN}"
ORG1_DOMAIN="org1.${DOMAIN}"
ORG2_DOMAIN="org2.${DOMAIN}"
ORG3_DOMAIN="org3.${DOMAIN}"

# 基础路径配置
HYPERLEDGER_PATH="/etc/hyperledger"
CONFIG_PATH="${HYPERLEDGER_PATH}/config"
CRYPTO_PATH="${HYPERLEDGER_PATH}/crypto-config"

# 通道和链码配置
ChannelName="mychannel"
ChainCodeName="mychaincode"
Version="1.0.0"
Sequence="1"
CHAINCODE_PATH="/opt/gopath/src/chaincode"
CHAINCODE_PACKAGE="${CHAINCODE_PATH}/chaincode_${Version}.tar.gz"
CLI_CMD="docker exec ${CLI_CONTAINER} bash -c"


# Order 配置
ORDERER1_ADDRESS="orderer1.${DOMAIN}:7050"
ORDERER_CA="${CRYPTO_PATH}/ordererOrganizations/${DOMAIN}/orderers/orderer1.${DOMAIN}/msp/tlscacerts/tlsca.${DOMAIN}-cert.pem"

# Org 配置
PEER_ORGS_MSP_PATH="${CRYPTO_PATH}/peerOrganizations"
CORE_PEER_TLS_ENABLED=true

# 生成节点配置函数
generate_peer_config() {
    local org=$1    # 组织编号
    local peer=$2   # 节点编号
    local org_domain="org${org}.${DOMAIN}"
    local peer_name="peer${peer}.${org_domain}"

    # 设置环境变量
    eval "ORG${org}_PEER${peer}_ADDRESS=\"${peer_name}:7051\""
    eval "ORG${org}_PEER${peer}_LOCALMSPID=\"Org${org}MSP\""
    eval "ORG${org}_PEER${peer}_MSPCONFIGPATH=\"${PEER_ORGS_MSP_PATH}/${org_domain}/users/Admin@${org_domain}/msp\""
    eval "ORG${org}_PEER${peer}_TLS_ROOTCERT_FILE=\"${PEER_ORGS_MSP_PATH}/${org_domain}/peers/${peer_name}/tls/ca.crt\""
    eval "ORG${org}_PEER${peer}_TLS_CERT_FILE=\"${PEER_ORGS_MSP_PATH}/${org_domain}/peers/${peer_name}/tls/server.crt\""
    eval "ORG${org}_PEER${peer}_TLS_KEY_FILE=\"${PEER_ORGS_MSP_PATH}/${org_domain}/peers/${peer_name}/tls/server.key\""
}

# 生成CLI配置函数
generate_cli_config() {
    local org=$1    # 组织编号
    local peer=$2   # 节点编号

    eval "Org${org}Peer${peer}Cli=\"CORE_PEER_ADDRESS=\${ORG${org}_PEER${peer}_ADDRESS} \\
CORE_PEER_LOCALMSPID=\${ORG${org}_PEER${peer}_LOCALMSPID} \\
CORE_PEER_MSPCONFIGPATH=\${ORG${org}_PEER${peer}_MSPCONFIGPATH} \\
CORE_PEER_TLS_ENABLED=\${CORE_PEER_TLS_ENABLED} \\
CORE_PEER_TLS_ROOTCERT_FILE=\${ORG${org}_PEER${peer}_TLS_ROOTCERT_FILE} \\
CORE_PEER_TLS_CERT_FILE=\${ORG${org}_PEER${peer}_TLS_CERT_FILE} \\
CORE_PEER_TLS_KEY_FILE=\${ORG${org}_PEER${peer}_TLS_KEY_FILE}\""
}

# 生成所有节点配置
for org in 1 2 3; do
    for peer in 0 1; do
        generate_peer_config $org $peer
        generate_cli_config $org $peer
    done
done