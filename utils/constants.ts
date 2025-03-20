

declare global {
    interface Window {
        ethereum: any;
    }
}

export const CONTRACT_ADDRESS: string = "0xC0262D9752cd958bc0Ae8402E2a4fB19aEE6CCF6";


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


