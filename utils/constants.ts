

declare global {
    interface Window {
        ethereum: any;
    }
}

export const CONTRACT_ADDRESS: string = "0x0C335161438bb1D0bb7957E9160Fc7759B72eAC8";


export enum TabType {
  POOLS = "pools",
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  NOTIFICATIONS = "notifications"
}

export const REFRESH_INTERVAL = 30000;

export const CORE_TESTNET_CHAIN_ID = "0x45a";
export const CORE_TESTNET_PARAMS = {
  chainId: CORE_TESTNET_CHAIN_ID,
  chainName: 'Core Testnet',
  nativeCurrency: {
    name: 'CORE',
    symbol: 'tCORE',
    decimals: 18
  },
  rpcUrls: ['https://rpc.test2.btcs.network'],
  blockExplorerUrls: ['https://scan.test2.btcs.network']
};


