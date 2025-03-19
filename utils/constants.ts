import { ethers } from "ethers";

export const CONTRACT_ADDRESS: string = "0x802F663D2Ab061a479dA4F3F95ae5cB3871539A4";
export const REWARD_TOKEN_ADDRESS: string = "";


export async function ERC20(){
    const provider = new ethers.BrowserProvider(window.ethereum);

}