import { ethers } from "ethers";

export function toEth(amount: string | number | bigint, decimals: number = 18): string {
    return ethers.formatUnits(amount, decimals).toString();
}

export function toWei(amount: string | number, decimals: number = 18): bigint {
    return ethers.parseUnits(amount.toString(), decimals);
}
