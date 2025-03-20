"use client"

import { Wallet, RefreshCw } from "lucide-react"

interface ConnectWalletProps {
  onConnect: () => Promise<void>
  loading: boolean
  fullWidth?: boolean
}

export default function ConnectWallet({ onConnect, loading, fullWidth = false }: ConnectWalletProps) {
  return fullWidth ? (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 text-center">
      <Wallet className="w-16 h-16 text-orange-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Connect your wallet to view your staking positions, deposit tokens, and claim rewards.
      </p>
      <button
        onClick={onConnect}
        disabled={loading}
        className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-medium py-3 px-8 rounded-full flex items-center mx-auto transition-all duration-300 disabled:opacity-50"
      >
        {loading ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </>
        )}
      </button>
    </div>
  ) : (
    <button
      onClick={onConnect}
      disabled={loading}
      className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-medium py-2 px-6 rounded-full flex items-center transition-all duration-300 disabled:opacity-50"
    >
      {loading ? (
        <>
          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5 mr-2" />
          Connect Wallet
        </>
      )}
    </button>
  )
}

