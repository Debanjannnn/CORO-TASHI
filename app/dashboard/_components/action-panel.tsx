"use client"
import { useState } from "react"

import { Plus, Minus, RefreshCw, Lock } from "lucide-react"
import ContractAddress from "./contract-address"

interface ActionPanelProps {
  pool: any
  tokenBalances: Record<string, any>
  tokenSymbols: Record<string, string>
  onDeposit: (amount: string) => Promise<boolean>
  onWithdraw: (amount: string) => Promise<boolean>
}

export default function ActionPanel({ pool, tokenBalances, tokenSymbols, onDeposit, onWithdraw }: ActionPanelProps) {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsDepositing(true)
      const success = await onDeposit(depositAmount)
      if (success) {
        setDepositAmount("")
      }
    } finally {
      setIsDepositing(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsWithdrawing(true)
      const success = await onWithdraw(withdrawAmount)
      if (success) {
        setWithdrawAmount("")
      }
    } finally {
      setIsWithdrawing(false)
    }
  }

  const setMaxDeposit = () => {
    if (!pool) return

    const stakedToken = pool.stakedToken
    const balance = tokenBalances[stakedToken]

    if (balance) {
      import("ethers").then(({ ethers }) => {
        setDepositAmount(ethers.formatEther(balance))
      })
    }
  }

  const setMaxWithdraw = () => {
    if (!pool) return
    setWithdrawAmount(pool.userStaked)
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden sticky top-4">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xl font-semibold">{pool ? <>Pool #{pool.id} Actions</> : <>Actions</>}</h2>
      </div>

      <div className="p-4">
        {/* Deposit Form */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 flex items-center">
            <Plus className="w-4 h-4 mr-1 text-green-400" />
            Deposit Tokens
          </h3>

          {pool && (
            <div className="mb-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Available Balance:</span>
                <span>
                  {tokenBalances[pool.stakedToken] ? (
                    <>
                      {import("ethers").then(({ ethers }) => ethers.formatEther(tokenBalances[pool.stakedToken]))}{" "}
                      {tokenSymbols[pool.stakedToken]}
                    </>
                  ) : (
                    "Loading..."
                  )}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-gray-400">Staking Token:</span>
                <ContractAddress address={pool.stakedToken} symbol={tokenSymbols[pool.stakedToken]} />
              </div>
            </div>
          )}

          <form onSubmit={handleDeposit}>
            <div className="mb-3">
              <div className="flex">
                <input
                  type="text"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-zinc-800 border border-zinc-700 rounded-l-lg p-2 w-full text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={setMaxDeposit}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 rounded-r-lg transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDepositing || !depositAmount}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isDepositing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Deposit</>
              )}
            </button>
          </form>
        </div>

        {/* Withdraw Form */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <Minus className="w-4 h-4 mr-1 text-red-400" />
            Withdraw Tokens
          </h3>

          {pool && (
            <div className="mb-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Staked Balance:</span>
                <span>
                  {pool.userStaked} {tokenSymbols[pool.stakedToken]}
                </span>
              </div>

              {pool.isLocked && (
                <div className="mt-1 text-orange-400 flex items-center text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  {pool.lockTimeRemaining}
                </div>
              )}

              <div className="mt-2">
                <span className="text-gray-400">Reward Token:</span>
                <ContractAddress address={pool.rewardToken} symbol={tokenSymbols[pool.rewardToken]} />
              </div>
            </div>
          )}

          <form onSubmit={handleWithdraw}>
            <div className="mb-3">
              <div className="flex">
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-zinc-800 border border-zinc-700 rounded-l-lg p-2 w-full text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={setMaxWithdraw}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 rounded-r-lg transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isWithdrawing ||
                !withdrawAmount ||
                (pool && pool.isLocked) ||
                (pool && Number.parseFloat(withdrawAmount) > Number.parseFloat(pool.userStaked))
              }
              className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isWithdrawing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : pool && pool.isLocked ? (
                <>Locked</>
              ) : (
                <>Withdraw</>
              )}
            </button>

            {pool && pool.isLocked && (
              <div className="mt-2 text-xs text-gray-400 text-center">
                You can use Emergency Withdraw with a penalty
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

