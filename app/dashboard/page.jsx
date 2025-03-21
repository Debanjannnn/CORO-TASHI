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
  Bell,
  ChevronRight,
  Info,
  BarChart3,
  Layers,
  ArrowDownRightFromCircle,
} from "lucide-react"
import { CONTRACT_ADDRESS, CORE_TESTNET_CHAIN_ID, CORE_TESTNET_PARAMS } from "@/utils/constants"
import abi from "@/utils/abi"
import ERC20_ABI from "@/utils/erc20abi"
import { motion, AnimatePresence } from "framer-motion"

const UserDashboard = () => {
  // First, add a pageLoading state at the top with the other state variables
  const [pageLoading, setPageLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
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
  const [showNotifications, setShowNotifications] = useState(false)

  // Update the connectWallet function to handle page loading
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

        // CHAIN SWITCHING LOGIC HERE
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: CORE_TESTNET_CHAIN_ID }],
          })
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [CORE_TESTNET_PARAMS],
              })
            } catch (addError) {
              console.error("Error adding chain:", addError)
              setError("Failed to add Core Testnet to MetaMask. Please add it manually.")
              setLoading(false)
              setPageLoading(false)
              return
            }
          } else {
            console.error("Error switching chain:", switchError)
            setError("Failed to switch to Core Testnet. " + (switchError.message || ""))
            setLoading(false)
            setPageLoading(false)
            return
          }
        }

        await fetchData(contractInstance, accounts[0], signerInstance)
      } else {
        setError("Please install MetaMask to use this dApp")
        setPageLoading(false)
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError("Failed to connect wallet. " + (err.message || ""))
      setPageLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Update the fetchData function to show loading overlay
  const fetchData = async (contractInstance, userAccount, signerInstance) => {
    try {
      setLoading(true)
      setRefreshing(true)
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
          liquidity: ethers.formatEther(pool[3]),
          APY: Number(pool.APY),
          lockDays: Number(pool.lockDays),
          userStaked: ethers.formatEther(userInfo.amount),
          pendingReward: ethers.formatEther(pendingReward),
          lockUntil: new Date(lockUntilTimestamp * 1000).toLocaleString(),
          isLocked,
          lockTimeRemaining,
        })
      }

      // At the end, update the state
      setPools(poolsData)
      setTokenBalances(balances)
      setTokenAllowances(allowances)
      setTokenSymbols(symbols)

      // Set notifications
      const notificationsData = await contractInstance.getNotifications()
      const formattedNotifications = notificationsData.map((notification) => ({
        poolId: Number(notification.poolId),
        amount: ethers.formatEther(notification.amount),
        sender: notification.sender,
        message: notification.message,
        timestamp: Number(notification.timestamp) * 1000,
      }))
      setNotifications(formattedNotifications)

      // Hide loading screens
      setPageLoading(false)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch data from contract")
      setPageLoading(false)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Update the refreshData function to show loading overlay
  const refreshData = async () => {
    if (contract && account && signer) {
      setRefreshing(true)
      await fetchData(contract, account, signer)
      setRefreshing(false)
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

  // Loading screen component with CORO TASHI logo
  const LoadingScreen = ({ message = "Loading dashboard..." }) => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-500/30"></div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/image.png" alt="CORO TASHI Logo" className="w-28 h-28 object-contain rounded-full" />
        </div>
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent"
      >
        CORO <span className="text-orange-600">TASHI</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-zinc-400 mt-2"
      >
        {message}
      </motion.p>
    </div>
  )

  // Add a data loading overlay component
  const DataLoadingOverlay = () => (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 relative mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-orange-500/20"></div>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/image.png" alt="CORO TASHI Logo" className="w-14 h-14 object-contain rounded-full" />
          </div>
        </div>
        <p className="text-orange-400 font-medium">Loading data...</p>
      </div>
    </div>
  )

  // Update the useEffect to handle page loading
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum)

      provider
        .send("eth_accounts", [])
        .then((accounts) => {
          if (accounts.length > 0) {
            connectWallet()
          } else {
            // If no accounts, still hide the loading screen after a delay
            setTimeout(() => setPageLoading(false), 1500)
          }
        })
        .catch((err) => {
          console.error("Error checking accounts:", err)
          setTimeout(() => setPageLoading(false), 1500)
        })

      window.ethereum.on("accountsChanged", () => {
        window.location.reload()
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    } else {
      // If no ethereum provider, hide loading screen after a delay
      setTimeout(() => setPageLoading(false), 1500)
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
      }, 55000)

      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Loading Screen */}
      <AnimatePresence>{pageLoading && <LoadingScreen />}</AnimatePresence>

      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[160px]"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=2&width=2')] bg-[length:50px_50px] opacity-[0.025]"></div>

        {/* Circuit-like pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal and vertical lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#f97316" strokeWidth="0.2" strokeDasharray="1,3" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="#f97316" strokeWidth="0.2" strokeDasharray="1,3" />
            <line x1="20" y1="0" x2="20" y2="100" stroke="#f97316" strokeWidth="0.2" strokeDasharray="1,3" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="#f97316" strokeWidth="0.2" strokeDasharray="1,3" />

            {/* Diagonal lines */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="#f97316" strokeWidth="0.2" strokeDasharray="1,5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#f97316" strokeWidth="0.2" strokeDasharray="1,5" />

            {/* Circles */}
            <circle cx="50" cy="50" r="30" stroke="#f97316" strokeWidth="0.3" fill="none" opacity="0.3" />
            <circle cx="50" cy="50" r="20" stroke="#f97316" strokeWidth="0.3" fill="none" opacity="0.5" />
            <circle cx="50" cy="50" r="10" stroke="#f97316" strokeWidth="0.3" fill="none" opacity="0.7" />
          </svg>
        </div>

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Show loading overlay when refreshing data */}
        {refreshing && <DataLoadingOverlay />}

        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-zinc-800/50 pb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-14 h-14 mr-4 relative flex items-center justify-center rounded-full bg-zinc-900/80 border border-orange-500/30 shadow-lg shadow-orange-500/10">
              <img src="/image.png" alt="CORO TASHI Logo" className="w-10 h-10 object-contain rounded-full" />
              <div className="absolute -inset-1 bg-orange-500/20 rounded-full blur-xl -z-10"></div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                CORO <span className="text-white">TASHI</span>
              </h1>
              <p className="text-zinc-400 text-sm">Staking Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-zinc-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="p-2">
                      {notifications.slice(0, 5).map((notification, index) => (
                        <div key={index} className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors mb-1 text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-orange-400">Pool #{notification.poolId}</span>
                            <span className="text-xs text-zinc-500">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-zinc-300">{notification.message}</p>
                        </div>
                      ))}
                      {notifications.length > 5 && (
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="w-full text-center text-xs text-orange-400 hover:text-orange-300 py-2 transition-colors"
                        >
                          View all notifications
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isConnected ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectWallet}
                disabled={loading}
                className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-medium py-2 px-6 rounded-full flex items-center transition-all duration-300 disabled:opacity-50 shadow-lg shadow-orange-500/20"
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
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-full py-2 px-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">{formatAddress(account)}</span>
                </div>
                <button
                  onClick={refreshData}
                  className="p-2 rounded-full bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 text-zinc-400 ${loading ? "animate-spin text-orange-400" : ""}`} />
                </button>
              </div>
            )}
          </div>
        </header>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-start"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-400">Error</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-green-900/30 border border-green-500/50 rounded-xl p-4 flex items-start"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-400">Success</h3>
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Outer hexagon */}
                <path d="M50 5 L95 30 L95 70 L50 95 L5 70 L5 30 Z" fill="none" stroke="#f97316" strokeWidth="4" />
                {/* Inner hexagon */}
                <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" fill="none" stroke="#f97316" strokeWidth="3" />
                {/* Cube - front face */}
                <path d="M50 40 L70 50 L70 70 L50 80 Z" fill="#f97316" opacity="0.7" />
                {/* Cube - top edge */}
                <path d="M50 40 L30 50 L50 60 L70 50 Z" fill="none" stroke="#f97316" strokeWidth="3" />
                {/* Cube - side edge */}
                <path d="M50 60 L50 80 L30 70 L30 50 Z" fill="none" stroke="#f97316" strokeWidth="3" />
              </svg>
              <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl -z-10"></div>
            </div>
            <h2 className="text-3xl font-bold mb-3">Welcome to CORO TASHI</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Connect your wallet to view your staking positions, deposit tokens, and claim rewards.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={connectWallet}
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold py-3 px-8 rounded-full flex items-center mx-auto transition-all duration-300 disabled:opacity-50 shadow-lg shadow-orange-500/20"
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
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 text-orange-500 mr-2" />
                      <h2 className="text-xl font-semibold">Staking Pools</h2>
                    </div>
                    <div className="flex items-center text-sm text-zinc-400">
                      <span className="mr-2">Total Pools: {pools.length}</span>
                      <button
                        onClick={refreshData}
                        className="text-zinc-400 hover:text-orange-400 p-1 rounded-full transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {pools.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400">
                      <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                      <p className="mb-2">No staking pools available</p>
                      <p className="text-sm text-zinc-500">Check back later or refresh to update</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-800/50">
                      {pools.map((pool) => (
                        <motion.div
                          key={pool.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`p-3 hover:bg-zinc-800/30 transition-colors cursor-pointer ${
                            activePool === pool.id ? "bg-zinc-800/50 border-l-2 border-orange-500" : ""
                          }`}
                          onClick={() => setActivePool(pool.id)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium flex items-center">
                              <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mr-2 text-xs text-orange-400">
                                {pool.id}
                              </div>
                              <span className="mr-2">Pool #{pool.id}</span>
                              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                                {pool.APY}% APY
                              </span>
                            </h3>
                            <div className="flex items-center text-xs text-zinc-400">
                              <Lock className="w-3 h-3 mr-1" />
                              {pool.lockDays} days lock
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div>
                              <div className="text-zinc-400 flex items-center mb-1">
                                <span className="w-1.5 h-1.5 bg-orange-500/50 rounded-full mr-1"></span>
                                Staked: {tokenSymbols[pool.stakedToken] || "???"}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-400 flex items-center mb-1">
                                <span className="w-1.5 h-1.5 bg-orange-500/50 rounded-full mr-1"></span>
                                Reward: {tokenSymbols[pool.rewardToken] || "???"}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-400 flex items-center mb-1">
                                <span className="w-1.5 h-1.5 bg-green-500/50 rounded-full mr-1"></span>
                                Liquidity: {Number(pool.liquidity).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/30">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-zinc-400">Your Position</span>
                              {pool.isLocked ? (
                                <span className="text-xs flex items-center text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                                  <Clock className="w-2.5 h-2.5 mr-1" />
                                  {pool.lockTimeRemaining}
                                </span>
                              ) : (
                                <span className="text-xs flex items-center text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                  <Unlock className="w-2.5 h-2.5 mr-1" />
                                  Unlocked
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                              <div>
                                <div className="text-zinc-400 mb-1 text-xs">Staked</div>
                                <div className="font-medium flex items-center">
                                  <BarChart3 className="w-3 h-3 text-orange-500 mr-1" />
                                  {Number.parseFloat(pool.userStaked).toFixed(4)}
                                </div>
                              </div>
                              <div>
                                <div className="text-zinc-400 mb-1 text-xs">Pending Rewards</div>
                                <div className="font-medium flex items-center text-orange-400">
                                  <Award className="w-3 h-3 mr-1" />
                                  {Number.parseFloat(pool.pendingReward).toFixed(4)}
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleClaimRewards(pool.id)
                                }}
                                disabled={Number.parseFloat(pool.pendingReward) <= 0 || isClaiming}
                                className="text-xs bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 disabled:from-zinc-700 disabled:to-zinc-600 disabled:text-zinc-400 text-white px-3 py-1.5 rounded-lg flex items-center transition-colors flex-1 justify-center shadow-md shadow-orange-500/10"
                              >
                                {isClaiming && activePool === pool.id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                                ) : (
                                  <Award className="w-3 h-3 mr-1" />
                                )}
                                Claim
                              </motion.button>

                              {Number.parseFloat(pool.userStaked) > 0 && (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
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
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden sticky top-4 shadow-xl">
                  <div className="p-4 border-b border-zinc-800 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-2 text-orange-400">
                      {activePool}
                    </div>
                    <h2 className="text-xl font-semibold">
                      {pools[activePool] ? <>Pool #{activePool} Actions</> : <>Actions</>}
                    </h2>
                  </div>

                  <div className="p-4">
                    <div className="mb-6">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Plus className="w-4 h-4 mr-2 text-green-400" />
                        Deposit Tokens
                      </h3>

                      {pools[activePool] && (
                        <div className="mb-3 text-sm bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/30">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 flex items-center">
                              <Info className="w-3 h-3 mr-1" /> Available Balance:
                            </span>
                            <span className="font-medium">
                              {tokenBalances[pools[activePool].stakedToken] !== undefined ? (
                                <>
                                  {ethers.formatEther(tokenBalances[pools[activePool].stakedToken]) === "0.0"
                                    ? "0"
                                    : Number(ethers.formatEther(tokenBalances[pools[activePool].stakedToken])).toFixed(
                                        4,
                                      )}{" "}
                                  <span className="text-zinc-400">{tokenSymbols[pools[activePool].stakedToken]}</span>
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
                              className="bg-zinc-800 border border-zinc-700 rounded-l-lg p-3 w-full text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                            />
                            <button
                              type="button"
                              onClick={setMaxDeposit}
                              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 rounded-r-lg transition-colors font-medium"
                            >
                              MAX
                            </button>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isDepositing || !depositAmount}
                          className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 disabled:from-zinc-700 disabled:to-zinc-600 disabled:text-zinc-400 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors font-medium shadow-lg shadow-orange-500/10"
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
                          ) : checkApprovalNeeded(activePool, depositAmount) ? (
                            <>Approve & Deposit</>
                          ) : (
                            <>Deposit</>
                          )}
                        </motion.button>
                      </form>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/50">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Minus className="w-4 h-4 mr-2 text-red-400" />
                        Withdraw Tokens
                      </h3>

                      {pools[activePool] && (
                        <div className="mb-3 text-sm bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/30">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400 flex items-center">
                              <Info className="w-3 h-3 mr-1" /> Staked Balance:
                            </span>
                            <span className="font-medium">
                              {Number(pools[activePool].userStaked).toFixed(4)}{" "}
                              <span className="text-zinc-400">{tokenSymbols[pools[activePool].stakedToken]}</span>
                            </span>
                          </div>

                          {pools[activePool].isLocked && (
                            <div className="mt-2 text-orange-400 flex items-center text-xs bg-orange-500/10 p-2 rounded-lg">
                              <Lock className="w-3 h-3 mr-1" />
                              {pools[activePool].lockTimeRemaining} - Emergency withdrawal available with penalty
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
                              className="bg-zinc-800 border border-zinc-700 rounded-l-lg p-3 w-full text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                            />
                            <button
                              type="button"
                              onClick={setMaxWithdraw}
                              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 rounded-r-lg transition-colors font-medium"
                            >
                              MAX
                            </button>
                          </div>
                        </div>

                        <motion.button
                          whileHover={
                            !(
                              isWithdrawing ||
                              !withdrawAmount ||
                              (pools[activePool] && pools[activePool].isLocked) ||
                              (pools[activePool] &&
                                Number.parseFloat(withdrawAmount) > Number.parseFloat(pools[activePool].userStaked))
                            )
                              ? { scale: 1.02 }
                              : {}
                          }
                          whileTap={
                            !(
                              isWithdrawing ||
                              !withdrawAmount ||
                              (pools[activePool] && pools[activePool].isLocked) ||
                              (pools[activePool] &&
                                Number.parseFloat(withdrawAmount) > Number.parseFloat(pools[activePool].userStaked))
                            )
                              ? { scale: 0.98 }
                              : {}
                          }
                          type="submit"
                          disabled={
                            isWithdrawing ||
                            !withdrawAmount ||
                            (pools[activePool] && pools[activePool].isLocked) ||
                            (pools[activePool] &&
                              Number.parseFloat(withdrawAmount) > Number.parseFloat(pools[activePool].userStaked))
                          }
                          className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 disabled:from-zinc-700 disabled:to-zinc-600 disabled:text-zinc-400 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors font-medium shadow-lg shadow-orange-500/10"
                        >
                          {isWithdrawing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Withdrawing...
                            </>
                          ) : pools[activePool] && pools[activePool].isLocked ? (
                            <div className="flex items-center">
                              <Lock className="w-4 h-4 mr-2" />
                              Locked
                            </div>
                          ) : (
                            <>Withdraw</>
                          )}
                        </motion.button>

                        {pools[activePool] && pools[activePool].isLocked && (
                          <div className="mt-2 text-xs text-zinc-400 text-center">
                            You can use Emergency Withdraw with a penalty
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold flex items-center">
                  <ArrowDownRightFromCircle className="w-5 h-5 text-orange-500 mr-2" />
                  Transactions
                </h2>
                {notifications.length > 0 && (
                  <span className="text-sm text-zinc-400">{notifications.length} transactions</span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
                  <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="mb-2">No transaction history available</p>
                  <p className="text-sm text-zinc-500">Your activity will appear here</p>
                </div>
              ) : (
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                      <h3 className="text-lg font-semibold">Recent Activity</h3>
                    </div>
                    <div className="text-sm text-zinc-400">
                      Showing {Math.min(10, notifications.length)} of {notifications.length}
                    </div>
                  </div>

                  <div className="divide-y divide-zinc-800/50">
                    {notifications.slice(0, 10).map((notification, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={index}
                        className="p-4 hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                            <div className="text-sm font-medium text-orange-400">#{notification.poolId}</div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-white font-medium truncate pr-2">{notification.message}</h4>
                              <span className="text-xs text-zinc-500 whitespace-nowrap">
                                {new Date(notification.timestamp).toLocaleString()}
                              </span>
                            </div>

                            {notification.amount !== "0.0" && (
                              <div className="flex items-center text-sm text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md w-fit">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span>{notification.amount}</span>
                              </div>
                            )}

                            <div className="mt-2 flex items-center text-xs text-zinc-500">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(notification.timestamp).toLocaleDateString()} at{" "}
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {notifications.length > 10 && (
                    <div className="p-3 border-t border-zinc-800 text-center">
                      <button className="text-orange-400 hover:text-orange-300 transition-colors text-sm flex items-center mx-auto justify-center">
                        View all transactions
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {loading && <DataLoadingOverlay />}
    </main>
  )
}

export default UserDashboard