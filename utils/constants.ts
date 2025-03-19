import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum: any;
    }
}

export const CONTRACT_ADDRESS: string = "0xae55C3E2727259b688aE03c23d7cE2D559De7102";
export const REWARD_TOKEN_ADDRESS: string = "";

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


export async function ERC20(){
    const provider = new ethers.BrowserProvider(window.ethereum);

}