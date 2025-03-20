"use client"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import {
  Wallet,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Lock,
  Unlock,
  Plus,
  Minus,
  Award,
} from "lucide-react"
import { CONTRACT_ADDRESS } from "@/utils/constants"
import abi from "@/utils/abi"
import ERC20_ABI from "@/utils/erc20abi"

const UserDashboard = () => {
  const [account, setAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [pools, setPools] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activePool, setActivePool] = useState(0)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isEmergencyWithdrawing, setIsEmergencyWithdrawing] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [tokenBalances, setTokenBalances] = useState({})
  const [tokenAllowances, setTokenAllowances] = useState({})
  const [tokenSymbols, setTokenSymbols] = useState({})

  const connectWallet = async () => {
    try {
      setLoading(true)
      if (typeof window.ethereum !== "undefined") {
        const providerInstance = new ethers.BrowserProvider(window.ethereum)
        setProvider(providerInstance)
        const accounts = await providerInstance.send("eth_requestAccounts", [])
        const signerInstance = await providerInstance.getSigner()
        setAccount(accounts[0])
        setSigner(signerInstance)
        setIsConnected(true)
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signerInstance)
        setContract(contractInstance)
        await fetchData(contractInstance, accounts[0], signerInstance)
      } else {
        setError("Please install MetaMask to use this dApp")
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError("Failed to connect wallet. " + (err.message || ""))
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async (contractInstance, userAccount, signerInstance) => {
    try {
      setLoading(true)
      const poolCount = await contractInstance.poolCount()
      const poolsData = []
      const balances = {}
      const allowances = {}
      const symbols = {}

      for (let i = 0; i < poolCount; i++) {
        const pool = await contractInstance.poolInfo(i)
        const userInfo = await contractInstance.userInfo(i, userAccount)
        const pendingReward = await contractInstance.pendingReward(i, userAccount)

        const stakedTokenContract = new ethers.Contract(pool.stakedToken, ERC20_ABI, signerInstance)
        const rewardTokenContract = new ethers.Contract(pool.rewardToken, ERC20_ABI, signerInstance)

        const stakedTokenBalance = await stakedTokenContract.balanceOf(userAccount)
        balances[pool.stakedToken] = stakedTokenBalance

        const tokenAllowance = await stakedTokenContract.allowance(userAccount, CONTRACT_ADDRESS)
        allowances[pool.stakedToken] = tokenAllowance

        try {
          const stakedSymbol = await stakedTokenContract.symbol()
          const rewardSymbol = await rewardTokenContract.symbol()
          symbols[pool.stakedToken] = stakedSymbol
          symbols[pool.rewardToken] = rewardSymbol
        } catch (err) {
          console.error("Error fetching token symbols:", err)
          symbols[pool.stakedToken] = "???"
          symbols[pool.rewardToken] = "???"
        }

        const lockUntilTimestamp = Number(userInfo.lockUntil)
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const isLocked = lockUntilTimestamp > currentTimestamp
        const timeRemaining = isLocked ? lockUntilTimestamp - currentTimestamp : 0

        let lockTimeRemaining = ""
        if (timeRemaining > 0) {
          const days = Math.floor(timeRemaining / 86400)
          const hours = Math.floor((timeRemaining % 86400) / 3600)
          const minutes = Math.floor((timeRemaining % 3600) / 60)

          if (days > 0) {
            lockTimeRemaining = `${days}d ${hours}h remaining`
          } else if (hours > 0) {
            lockTimeRemaining = `${hours}h ${minutes}m remaining`
          } else {
            lockTimeRemaining = `${minutes}m remaining`
          }
        }

        poolsData.push({
          id: i,
          stakedToken: pool.stakedToken,
          rewardToken: pool.rewardToken,
          totalStaked: ethers.formatEther(pool.totalStaked),
          APY: Number(pool.APY) / 100,
          lockDays: Number(pool.lockDays),
          userStaked: ethers.formatEther(userInfo.amount),
          pendingReward: ethers.formatEther(pendingReward),
          lockUntil: new Date(lockUntilTimestamp * 1000).toLocaleString(),
          isLocked,
          lockTimeRemaining,
        })
      }

      setPools(poolsData)
      setTokenBalances(balances)
      setTokenAllowances(allowances)
      setTokenSymbols(symbols)

      const notificationsData = await contractInstance.getNotifications()
      const formattedNotifications = notificationsData.map((notification) => ({
        poolId: Number(notification.poolId),
        amount: ethers.formatEther(notification.amount),
        sender: notification.sender,
        message: notification.message,
        timestamp: Number(notification.timestamp) * 1000,
      }))

      setNotifications(formattedNotifications)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch data from contract")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    if (contract && account && signer) {
      await fetchData(contract, account, signer)
    }
  }

  const checkApprovalNeeded = (poolId, amount) => {
    if (!pools[poolId]) return true

    const stakedToken = pools[poolId].stakedToken
    const allowance = tokenAllowances[stakedToken]

    if (!amount || amount === "" || isNaN(Number(amount)) || Number(amount) <= 0) {
      return false
    }

    try {
      const amountWei = ethers.parseEther(amount)
      return allowance < amountWei
    } catch (err) {
      console.error("Error parsing amount:", err)
      return true
    }
  }

  const handleApproveAndDeposit = async (e) => {
    e.preventDefault()

    try {
      if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
        setError("Please enter a valid deposit amount")
        return
      }

      setIsDepositing(true)

      const amountWei = ethers.parseEther(depositAmount)

      if (checkApprovalNeeded(activePool, depositAmount)) {
        setIsApproving(true)
        const stakedToken = pools[activePool].stakedToken
        const tokenContract = new ethers.Contract(stakedToken, ERC20_ABI, signer)
        const txApprove = await tokenContract.approve(CONTRACT_ADDRESS, amountWei)
        await txApprove.wait()

        const newAllowance = await tokenContract.allowance(account, CONTRACT_ADDRESS)
        setTokenAllowances((prev) => ({
          ...prev,
          [stakedToken]: newAllowance,
        }))

        setSuccess("Token approval successful, now depositing...")
      }

      const txDeposit = await contract.deposit(activePool, amountWei)
      await txDeposit.wait()

      setSuccess("Deposit successful")
      setDepositAmount("")

      await refreshData()

      generateNotification("deposit", activePool, amountWei)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error depositing tokens:", err)
      setError("Failed to deposit tokens: " + (err.message || ""))
    } finally {
      setIsDepositing(false)
      setIsApproving(false)
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()

    try {
      if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
        setError("Please enter a valid withdrawal amount")
        return
      }

      setIsWithdrawing(true)

      const amountWei = ethers.parseEther(withdrawAmount)
      const tx = await contract.withdraw(activePool, amountWei)
      await tx.wait()

      setSuccess("Withdrawal successful")
      setWithdrawAmount("")

      await refreshData()

      generateNotification("withdraw", activePool, amountWei)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error withdrawing tokens:", err)
      setError("Failed to withdraw tokens. Make sure the lock period has ended.")
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleEmergencyWithdraw = async (poolId) => {
    try {
      setIsEmergencyWithdrawing(true)

      const tx = await contract.emergencyWithdraw(poolId)
      await tx.wait()

      setSuccess("Emergency withdrawal successful. Note: A penalty was applied.")

      await refreshData()

      generateNotification("emergencyWithdraw", poolId)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error emergency withdrawing:", err)
      setError("Failed to perform emergency withdrawal: " + (err.message || ""))
    } finally {
      setIsEmergencyWithdrawing(false)
    }
  }

  const handleClaimRewards = async (poolId) => {
    try {
      setIsClaiming(true)

      const tx = await contract.claimReward(poolId)
      await tx.wait()

      setSuccess("Rewards claimed successfully")

      await refreshData()

      generateNotification("claimReward", poolId)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error claiming rewards:", err)
      setError("Failed to claim rewards: " + (err.message || ""))
    } finally {
      setIsClaiming(false)
    }
  }

  const generateNotification = async (type, poolId, amountWei = 0) => {
    let message = ""
    let amount = 0
    const pool = pools.find((pool) => pool.id === poolId)

    switch (type) {
      case "deposit":
        message = `You have deposited ${ethers.formatEther(amountWei)} ${tokenSymbols[pool.stakedToken]} tokens in Pool #${poolId}.`
        amount = amountWei
        break
      case "withdraw":
        message = `You have withdrawn ${ethers.formatEther(amountWei)} ${tokenSymbols[pool.stakedToken]} tokens from Pool #${poolId}.`
        amount = amountWei
        break
      case "emergencyWithdraw":
        message = `You have performed an emergency withdrawal from Pool #${poolId}. A penalty was applied.`
        break
      case "claimReward":
        message = `You have claimed rewards from Pool #${poolId}.`
        break
      default:
        return
    }

    try {
      setNotifications((prevNotifications) => [
        {
          poolId: poolId,
          amount: ethers.formatEther(amount),
          sender: account,
          message: message,
          timestamp: Date.now(),
        },
        ...prevNotifications,
      ])
    } catch (err) {
      console.error("Error creating notification:", err)
      setError("Failed to create notification: " + (err.message || ""))
    }
  }

  const setMaxDeposit = () => {
    if (!pools[activePool]) return

    const stakedToken = pools[activePool].stakedToken
    const balance = tokenBalances[stakedToken]

    if (balance) {
      setDepositAmount(ethers.formatEther(balance))
    }
  }

  const setMaxWithdraw = () => {
    if (!pools[activePool]) return

    const userStaked = pools[activePool].userStaked
    setWithdrawAmount(userStaked)
  }

  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)

      provider
        .send("eth_accounts", [])
        .then((accounts) => {
          if (accounts.length > 0) {
            connectWallet()
          }
        })
        .catch((err) => console.error("Error checking accounts:", err))

      window.ethereum.on("accountsChanged", () => {
        window.location.reload()
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  useEffect(() => {
    if (contract && account && signer) {
      const interval = setInterval(() => {
        refreshData()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [contract, account, signer])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">
            CORE <span className="text-orange-500">DAO</span> Dashboard
          </h1>

          {!isConnected ? (
            <button
              onClick={connectWallet}
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
          ) : (
            <div className="flex items-center bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-full py-2 px-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">{formatAddress(account)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-400">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/30 border border-green-500/50 rounded-lg p-4 flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-400">Success</h3>
              <p className="text-green-300">{success}</p>
            </div>
          </div>
        )}

        {!isConnected ? (
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 text-center">
            <Wallet className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Connect your wallet to view your staking positions, deposit tokens, and claim rewards.
            </p>
            <button
              onClick={connectWallet}
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Staking Pools</h2>
                    <button
                      onClick={refreshData}
                      className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {pools.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No staking pools available</div>
                  ) : (
                    <div className="divide-y divide-zinc-800">
                      {pools.map((pool) => (
                        <div
                          key={pool.id}
                          className={`p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer ${
                            activePool === pool.id ? "bg-zinc-800/50" : ""
                          }`}
                          onClick={() => setActivePool(pool.id)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium flex items-center">
                              Pool #{pool.id}
                              <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                                {pool.APY}% APY
                              </span>
                            </h3>
                            <div className="flex items-center text-sm text-gray-400">
                              <Lock className="w-3 h-3 mr-1" />
                              {pool.lockDays} days lock
                            </div>
                          </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div>
                                    <div className="text-gray-400">Staked Token Address:</div>
                                    <div className="text-xs text-white">{formatAddress(pool.stakedToken)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Reward Token Address:</div>
                                    <div className="text-xs text-white">{formatAddress(pool.rewardToken)}</div>
                                </div>
                            </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="text-gray-400">
                              Stake:
                              <span className="ml-1 text-white">
                                {tokenSymbols[pool.stakedToken] || formatAddress(pool.stakedToken)}
                              </span>
                            </div>
                            <div className="text-gray-400">
                              Reward:
                              <span className="ml-1 text-white">
                                {tokenSymbols[pool.rewardToken] || formatAddress(pool.rewardToken)}
                              </span>
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

                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleClaimRewards(pool.id)
                                }}
                                disabled={Number.parseFloat(pool.pendingReward) <= 0 || isClaiming}
                                className="text-xs bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-3 py-1.5 rounded-lg flex items-center transition-colors flex-1 justify-center"
                              >
                                {isClaiming && activePool === pool.id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                                ) : (
                                  <Award className="w-3 h-3 mr-1" />
                                )}
                                Claim Rewards
                              </button>

                              {Number.parseFloat(pool.userStaked) > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEmergencyWithdraw(pool.id)
                                  }}
                                  disabled={isEmergencyWithdrawing}
                                  className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-white px-3 py-1.5 rounded-lg flex items-center transition-colors"
                                >
                                  {isEmergencyWithdrawing && activePool === pool.id ? (
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
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden sticky top-4">
                  <div className="p-4 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold">
                      {pools[activePool] ? <>Pool #{activePool} Actions</> : <>Actions</>}
                    </h2>
                  </div>

                  <div className="p-4">
                    <div className="mb-6">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Plus className="w-4 h-4 mr-1 text-green-400" />
                        Deposit Tokens
                      </h3>

                      {pools[activePool] && (
  <div className="mb-3 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-400">Available Balance:</span>
      <span>
        {tokenBalances[pools[activePool].stakedToken] !== undefined ? (
          <>
            {ethers.formatEther(tokenBalances[pools[activePool].stakedToken]) === "0.0"
              ? "0"
              : ethers.formatEther(tokenBalances[pools[activePool].stakedToken])}{" "}
            {tokenSymbols[pools[activePool].stakedToken]}
          </>
        ) : (
          "0"
        )}
      </span>
    </div>
  </div>
)}

                      <form onSubmit={handleApproveAndDeposit}>
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
                          {isApproving && isDepositing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Approving and Depositing...
                            </>
                          ) : isDepositing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Depositing...
                            </>
                          ) : (
                            <>Deposit</>
                          )}
                        </button>
                      </form>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <Minus className="w-4 h-4 mr-1 text-red-400" />
                        Withdraw Tokens
                      </h3>

                      {pools[activePool] && (
                        <div className="mb-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Staked Balance:</span>
                            <span>
                              {pools[activePool].userStaked} {tokenSymbols[pools[activePool].stakedToken]}
                            </span>
                          </div>

                          {pools[activePool].isLocked && (
                            <div className="mt-1 text-orange-400 flex items-center text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              {pools[activePool].lockTimeRemaining}
                            </div>
                          )}
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
                            (pools[activePool] && pools[activePool].isLocked) ||
                            (pools[activePool] &&
                              Number.parseFloat(withdrawAmount) > Number.parseFloat(pools[activePool].userStaked))
                          }
                          className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          {isWithdrawing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Withdrawing...
                            </>
                          ) : pools[activePool] && pools[activePool].isLocked ? (
                            <>Locked</>
                          ) : (
                            <>Withdraw</>
                          )}
                        </button>

                        {pools[activePool] && pools[activePool].isLocked && (
                          <div className="mt-2 text-xs text-gray-400 text-center">
                            You can use Emergency Withdraw with a penalty
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
              {notifications.length === 0 ? (
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center text-gray-400">
                  No notifications available.
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-400">
                          Pool #{notification.poolId} - {formatAddress(notification.sender)}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(notification.timestamp)}</div>
                      </div>
                      <p className="text-white">{notification.message}</p>
                      {notification.amount !== "0.0" && (
                        <div className="text-sm text-orange-400">Amount: {notification.amount}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default UserDashboard