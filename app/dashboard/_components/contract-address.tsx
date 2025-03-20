"use client"

import { ExternalLink } from "lucide-react"

interface ContractAddressProps {
  address: string
  symbol?: string
}

export default function ContractAddress({ address, symbol }: ContractAddressProps) {
  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getExplorerUrl = () => {
    // This can be expanded to support multiple networks
    return `https://etherscan.io/address/${address}`
  }

  return (
    <span className="ml-1 text-white flex items-center">
      {symbol || formatAddress(address)}
      <a
        href={getExplorerUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="ml-1 text-gray-400 hover:text-white transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
      </a>
    </span>
  )
}

