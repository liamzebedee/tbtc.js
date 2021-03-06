import { DepositFactory } from "./Deposit.js";

const BitcoinNetwork = {
    TESTNET: "testnet",
    MAINNET: "mainnet"
}

/*
export type TBTCConfig = {
    bitcoinNetwork: BitcoinNetwork,
    web3: Web3,
}
*/

const defaultConfig/*: TBTCConfig */ = {
    bitcoinNetwork: BitcoinNetwork.TESTNET,
    web3: global.Web3,
}

function isMainnet(web3/*: Web3*/) {
    return web3.currentProvider['chainId'] == 0x1
}
function isTestnet(web3/*: Web3*/) {
    return ! isMainnet(web3)
}

class TBTC {
    config/*: TBTCConfig*/;

    constructor(config/*: TBTCConfig*/ = defaultConfig, networkMatchCheck = true) {
        if (networkMatchCheck &&
            isMainnet(config.web3) && config.bitcoinNetwork == BitcoinNetwork.TESTNET ||
            isTestnet(config.web3) && config.bitcoinNetwork == BitcoinNetwork.MAINNET) {
                throw new Error(
                    `Ethereum network ${config.web3.currentProvider.chainId} ` +
                    `and Bitcoin network ${config.bitcoinNetwork} are not both ` +
                    `on testnet or both on  mainnet. Quitting while we're ` +
                    `ahead. Developers can also pass false as the ` +
                    `networkMatchCheck parameter to suppress this error.`
                )
        }

        this.config = config
    }

    get DepositFactory()/*: Promise<DepositFactory>*/ {
        return DepositFactory.withConfig(this.config)
    }
}

export default {
    configure: (config/*: TBTCConfig*/, networkMatchCheck = true) => {
        return new TBTC(config, networkMatchCheck)
    }
};
