"use client"

import type React from "react"

import { Award, AlertTriangle, Clock, Unlock, RefreshCw } from "lucide-react"
import { useState } from "react"
import ContractAddress from "./contract-address"
import RiskBadge from "./risk-badge" 

interface PoolCardProps {
  pool: any
  isActive: boolean
  onClick: () => void
  tokenSymbols: Record<string, string>
  onClaimRewards: (poolId: number) => Promise<void>
  onEmergencyWithdraw: (poolId: number) => Promise<void>
}

export default function PoolCard({
  pool,
  isActive,
  onClick,
  tokenSymbols,
  onClaimRewards,
  onEmergencyWithdraw,
}: PoolCardProps) {
  const [isClaiming, setIsClaiming] = useState(false)
  const [isEmergencyWithdrawing, setIsEmergencyWithdrawing] = useState(false)

  const handleClaimRewards = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setIsClaiming(true)
      await onClaimRewards(pool.id)
    } finally {
      setIsClaiming(false)
    }
  }

  const handleEmergencyWithdraw = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setIsEmergencyWithdrawing(true)
      await onEmergencyWithdraw(pool.id)
    } finally {
      setIsEmergencyWithdrawing(false)
    }
  }

  return (
    <div
      className={`p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer ${isActive ? "bg-zinc-800/50" : ""}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium flex items-center">
          Pool #{pool.id}
          <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
            {pool.APY}% APY
          </span>
          <RiskBadge risk={pool.riskLevel} className="ml-2" />
        </h3>
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {pool.lockDays} days lock
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="text-gray-400">
          Stake:
          <ContractAddress address={pool.stakedToken} symbol={tokenSymbols[pool.stakedToken]} />
        </div>
        <div className="text-gray-400">
          Reward:
          <ContractAddress address={pool.rewardToken} symbol={tokenSymbols[pool.rewardToken]} />
        </div>
      </div>

      <div className="bg-zinc-800/50 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Your Position</span>
          {pool.isLocked ? (
            <span className="text-xs flex items-center text-orange-400">
              <Clock className="w-3 h-3 mr-1" />
              {pool.lockTimeRemaining}
            </span>
          ) : (
            <span className="text-xs flex items-center text-green-400">
              <Unlock className="w-3 h-3 mr-1" />
              Unlocked
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs text-gray-400">Staked</div>
            <div className="font-medium">
              {Number.parseFloat(pool.userStaked).toFixed(4)} {tokenSymbols[pool.stakedToken]}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Pending Rewards</div>
            <div className="font-medium text-orange-400">
              {Number.parseFloat(pool.pendingReward).toFixed(4)} {tokenSymbols[pool.rewardToken]}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Total Liquidity</span>
          <span className="text-xs">
            {Number.parseFloat(pool.totalStaked).toFixed(4)} {tokenSymbols[pool.stakedToken]}
          </span>
        </div>

        <div className="flex space-x-2 mt-3">
          <button
            onClick={handleClaimRewards}
            disabled={Number.parseFloat(pool.pendingReward) <= 0 || isClaiming}
            className="text-xs bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-3 py-1.5 rounded-lg flex items-center transition-colors flex-1 justify-center"
          >
            {isClaiming ? <RefreshCw className="w-3 h-3 animate-spin mr-1" /> : <Award className="w-3 h-3 mr-1" />}
            Claim Rewards
          </button>

          {Number.parseFloat(pool.userStaked) > 0 && (
            <button
              onClick={handleEmergencyWithdraw}
              disabled={isEmergencyWithdrawing}
              className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-white px-3 py-1.5 rounded-lg flex items-center transition-colors"
            >
              {isEmergencyWithdrawing ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <AlertTriangle className="w-3 h-3 mr-1" />
              )}
              Emergency
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

