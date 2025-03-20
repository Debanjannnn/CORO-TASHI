"use client"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wallet,
  Plus,
  CoinsIcon,
  UserPlus,
  LayoutDashboard,
  Settings,
  LogOut,
  BarChart3,
  Layers,
  AlertCircle,
  CheckCircle2,
  InfoIcon,
  Shield,
  Clock,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ClipboardCopy,
  Menu,
} from "lucide-react"
import abi from "@/utils/abi"
import ERC20_ABI from "@/utils/erc20abi"
import { CONTRACT_ADDRESS } from "@/utils/constants"

const AdminDashboard = () => {
  const [account, setAccount] = useState("")
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [pools, setPools] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [pageLoading, setPageLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [adminLoading, setAdminLoading] = useState(false)

  // Form states
  const [newPool, setNewPool] = useState({
    stakedToken: "",
    rewardToken: "",
    APY: "",
    lockDays: "",
  })
  const [rewardDeposit, setRewardDeposit] = useState({
    poolId: "0",
    amount: "",
  })
  const [newOwner, setNewOwner] = useState("")

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage({ type: "error", text: "Please install MetaMask!" })
        return
      }

      setLoading(true)
      setAdminLoading(true) // Start admin check loading
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)

      setAccount(accounts[0])
      const owner = await contract.owner()
      setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase())
      await fetchData()
      setLoading(false)
      setAdminLoading(false) // End admin check loading
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setMessage({ type: "error", text: "Failed to connect wallet" })
      setLoading(false)
      setAdminLoading(false) // End admin check loading on error
    }
  }

  // Connect to contract
  const connectContract = async () => {
    if (!window.ethereum) return null
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
  }

  const getTokenContract = async (tokenAddress) => {
    if (!window.ethereum || !tokenAddress) return null
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    return new ethers.Contract(tokenAddress, ERC20_ABI, signer)
  }

  // Initial data fetch
  const fetchData = async () => {
    try {
      const contract = await connectContract()
      if (!contract) return
      await fetchPools()
    } catch (error) {
      console.error("Error fetching data:", error)
      setMessage({ type: "error", text: "Failed to fetch initial data" })
    }
  }

  const fetchPools = async () => {
    try {
      setRefreshing(true)
      const contract = await connectContract()
      if (!contract) return
  
      const count = await contract.poolCount()
      const poolsData = []
  
      for (let i = 0; i < count; i++) {
        // Get all pool info fields from contract
        const pool = await contract.poolInfo(i)
        const [
          stakedToken, 
          rewardToken, 
          totalStakedBN, 
          totalRewardsBN, 
          APY, 
          lockDays
        ] = pool
  
        // Get token contracts
        const stakedTokenContract = await getTokenContract(stakedToken)
        const rewardTokenContract = await getTokenContract(rewardToken)
  
        // Get token symbols
        let stakedTokenSymbol = "Unknown"
        let rewardTokenSymbol = "Unknown"
        
        if (stakedTokenContract) {
          try {
            stakedTokenSymbol = await stakedTokenContract.symbol()
          } catch (error) {
            console.error("Error fetching staked token symbol:", error)
          }
        }
  
        if (rewardTokenContract) {
          try {
            rewardTokenSymbol = await rewardTokenContract.symbol()
          } catch (error) {
            console.error("Error fetching reward token symbol:", error)
          }
        }
  
        // Push formatted pool data
        poolsData.push({
          id: i,
          stakedToken,
          rewardToken,
          stakedTokenSymbol,
          rewardTokenSymbol,
          totalStaked: ethers.formatEther(totalStakedBN),
          APY: APY.toString(),
          lockDays: lockDays.toString(),
          // Use totalRewards from poolInfo instead of token balance
          availableRewards: (ethers.formatEther(totalRewardsBN)),
        })
      }
      
      setPools(poolsData)
      setRefreshing(false)
    } catch (error) {
      console.error("Error fetching pools:", error)
      setMessage({ type: "error", text: "Failed to fetch pools" })
      setRefreshing(false)
    }
  }
  // Add Pool
  const handleAddPool = async () => {
    try {
      setLoading(true)
      const contract = await connectContract()
      if (!contract) return
      const tx = await contract.addPool(newPool.stakedToken, newPool.rewardToken, newPool.APY, newPool.lockDays)
      setMessage({ type: "info", text: "Adding pool... Please wait for confirmation" })
      await tx.wait()
      setMessage({ type: "success", text: "Pool added successfully!" })
      setNewPool({ stakedToken: "", rewardToken: "", APY: "", lockDays: "" })
      await fetchPools()
    } catch (error) {
      console.error("Error adding pool:", error)
      setMessage({ type: "error", text: "Failed to add pool: " + error.message })
    } finally {
      setLoading(false)
    }
  }

  // Deposit Rewards - Fixed implementation using the contract's depositRewards function
  const handleDepositRewards = async () => {
    try {
      setLoading(true)
      const contract = await connectContract()
      if (!contract) return
  
      const poolId = Number.parseInt(rewardDeposit.poolId)
      const amount = ethers.parseEther(rewardDeposit.amount)
  
      // Get reward token address from pool info
      const pool = await contract.poolInfo(poolId)
      const rewardToken = pool[1]
  
      // Get ERC20 contract
      const rewardTokenContract = await getTokenContract(rewardToken)
      if (!rewardTokenContract) {
        setMessage({ type: "error", text: "Could not connect to reward token contract" })
        return
      }
  
      // Approve contract to spend tokens
      setMessage({ type: "info", text: "Approving tokens..." })
      const approveTx = await rewardTokenContract.approve(CONTRACT_ADDRESS, amount)
      await approveTx.wait()
  
      // Deposit rewards
      setMessage({ type: "info", text: "Depositing rewards..." })
      const depositTx = await contract.depositRewards(poolId, amount)
      await depositTx.wait()
  
      setMessage({ type: "success", text: "Rewards deposited!" })
      setRewardDeposit({ poolId: "0", amount: "" })
      await fetchPools() // Refresh pool data
    } catch (error) {
      console.error("Deposit error:", error)
      setMessage({ type: "error", text: error.reason || "Deposit failed" })
    } finally {
      setLoading(false)
    }
  }
  // Transfer Ownership
  const handleTransferOwnership = async () => {
    try {
      setLoading(true)
      const contract = await connectContract()
      if (!contract) return
      const tx = await contract.transferOwnership(newOwner)
      setMessage({ type: "info", text: "Transferring ownership... Please wait for confirmation" })
      await tx.wait()
      setMessage({ type: "success", text: "Ownership transferred successfully!" })
      setIsOwner(false)
    } catch (error) {
      console.error("Error transferring ownership:", error)
      setMessage({ type: "error", text: "Failed to transfer ownership: " + error.message })
    } finally {
      setLoading(false)
    }
  }

  // Form state handlers
  const handleNewPoolChange = (e) => {
    const { name, value } = e.target
    setNewPool((prev) => ({ ...prev, [name]: value }))
  }

  const handleRewardDepositChange = (e) => {
    const { name, value } = e.target
    setRewardDeposit((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewOwnerChange = (e) => {
    setNewOwner(e.target.value)
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount("")
    setIsOwner(false)
    setPools([])
    setMessage({ type: "", text: "" })
  }

  // Effect for wallet changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0])
        fetchData()
      })
    }

    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Calculate total stats
  const totalStaked = pools.reduce((acc, pool) => acc + Number.parseFloat(pool.totalStaked), 0).toFixed(2)
  const totalRewards = pools.reduce((acc, pool) => acc + Number.parseFloat(pool.availableRewards), 0).toFixed(2)
  const avgAPY = pools.length
    ? (pools.reduce((acc, pool) => acc + Number.parseFloat(pool.APY), 0) / pools.length).toFixed(2)
    : "0"

  // Message alert component
  const MessageAlert = ({ message }) => {
    if (!message.text) return null

    const icons = {
      error: <AlertCircle className="w-5 h-5 text-red-400" />,
      success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      info: <InfoIcon className="w-5 h-5 text-orange-400" />,
    }

    const bgColors = {
      error: "bg-red-950/50 border-red-800",
      success: "bg-green-950/50 border-green-800",
      info: "bg-orange-950/50 border-orange-800",
    }

    const textColors = {
      error: "text-red-200",
      success: "text-green-200",
      info: "text-orange-200",
    }

    return (
      <Alert className={`mb-6 ${bgColors[message.type]} ${textColors[message.type]}`}>
        <div className="flex items-center gap-2">
          {icons[message.type]}
          <AlertDescription>{message.text}</AlertDescription>
        </div>
      </Alert>
    )
  }

  // Loading screen component with Core DAO logo
  const LoadingScreen = ({ message = "Loading admin dashboard..." }) => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-500/30"></div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/image.png" alt="CORO TASHI Logo" className="w-28 h-28 object-contain" />
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

  // Data loading overlay
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
            <img src="/image.png" alt="CORO TASHI Logo" className="w-14 h-14 object-contain" />
          </div>
        </div>
        <p className="text-orange-400 font-medium">Loading data...</p>
      </div>
    </div>
  )

  // Sidebar component
  const Sidebar = () => (
    <div
      className={`fixed top-0 left-0 h-full bg-zinc-900/95 backdrop-blur-md border-r border-zinc-800/50 transition-all duration-300 z-20 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-4 border-b border-zinc-800/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden bg-black/40 border border-orange-500/30">
          <img src="/image.png" alt="CORO TASHI Logo" className="w-14 h-14 object-contain " />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              CORO <span className="text-orange-600">TASHI</span>
            </h1>
            <p className="text-xs text-zinc-400">Admin Dashboard</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              {sidebarOpen && <span>Overview</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("pools")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "pools"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
              }`}
            >
              <Layers className="w-5 h-5" />
              {sidebarOpen && <span>Manage Pools</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "rewards"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
              }`}
            >
              <CoinsIcon className="w-5 h-5" />
              {sidebarOpen && <span>Rewards</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "settings"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </li>
        </ul>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-zinc-800/30">
        {!account ? (
          <Button
            onClick={connectWallet}
            className={`w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white flex items-center gap-2 justify-center shadow-lg shadow-orange-500/20 border-0 ${
              !sidebarOpen && "p-2"
            }`}
          >
            <Wallet className="w-4 h-4" />
            {sidebarOpen && <span>Connect Wallet</span>}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm truncate">
                {sidebarOpen
                  ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                  : `${account.substring(0, 4)}...`}
              </span>
            </div>
            {sidebarOpen && (
              <div className="text-xs px-2 py-1 rounded-md bg-orange-500/20 text-orange-400 text-center border border-orange-500/30">
                {isOwner ? "Admin" : "Not Admin"}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800 mt-2"
              onClick={disconnectWallet}
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span className="ml-2">Disconnect</span>}
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
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

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} min-h-screen relative`}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-zinc-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <motion.h1
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-white"
              >
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "pools" && "Manage Staking Pools"}
                {activeTab === "rewards" && "Reward Management"}
                {activeTab === "settings" && "Admin Settings"}
              </motion.h1>
            </div>

            {account && (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-orange-400 flex items-center gap-1"
                  onClick={fetchPools}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <div className="flex items-center px-3 py-2 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white text-sm">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                </div>
                {isOwner ? (
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm border border-orange-500/30">
                    Admin
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm border border-red-500/30">
                    Not Admin
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6 relative">
          {refreshing && <DataLoadingOverlay />}

          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageAlert message={message} />
              </motion.div>
            )}
          </AnimatePresence>

          {!account ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center p-12 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800"
            >
              <div className="w-20 h-20 mb-6">
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
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-zinc-400 mb-6 text-center max-w-md">
                Connect your wallet to access the admin dashboard and manage your staking pools.
              </p>
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white flex items-center gap-2 shadow-lg shadow-orange-500/20 border-0"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            </motion.div>
          ) : adminLoading ? (
            <LoadingScreen message="Checking admin status..." />
          ) : !isOwner ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center p-12 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
              <p className="text-zinc-400 mb-6 text-center max-w-md">
                You are connected but not the owner. Please connect with the owner account to access admin features.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 overflow-hidden hover:border-orange-500/30 transition-colors duration-300">
                          <div className="h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-zinc-400">Total Pools</p>
                                <h3 className="text-3xl font-bold text-white mt-1">{pools.length}</h3>
                              </div>
                              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Layers className="w-6 h-6 text-orange-500" />
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                <span>Active Pools</span>
                                <span>{pools.length} / 10</span>
                              </div>
                              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(pools.length / 10) * 100}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                                ></motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 overflow-hidden hover:border-orange-500/30 transition-colors duration-300">
                          <div className="h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-zinc-400">Total Staked</p>
                                <h3 className="text-3xl font-bold text-white mt-1">{totalStaked} TBTC <small className="font-thin text-sm"> (wBTC)</small></h3>
                              </div>
                              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-orange-500" />
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                <span>Average APY</span>
                                <span className="text-orange-400">{avgAPY}%</span>
                              </div>
                              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((Number.parseFloat(avgAPY) / 100) * 100, 100)}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                                ></motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 overflow-hidden hover:border-orange-500/30 transition-colors duration-300">
                          <div className="h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-zinc-400">Available Rewards</p>
                                <h3 className="text-3xl font-bold text-white mt-1">{totalRewards} TSI <br/>  <small className="font-thin text-sm"> (Tashi Staked Incentives) </small> </h3>
                              </div>
                              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <CoinsIcon className="w-6 h-6 text-orange-500" />
                              </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 mr-2"></div>
                              <span className="text-zinc-400">Across {pools.length} pools</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Layers className="w-5 h-5 text-orange-500" />
                          Pools Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-zinc-800">
                                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Pool ID</th>
                                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Staked Token</th>
                                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Reward Token</th>
                                <th className="text-right py-3 px-4 text-zinc-400 font-medium">Total Staked</th>
                                <th className="text-right py-3 px-4 text-zinc-400 font-medium">APY</th>
                                <th className="text-right py-3 px-4 text-zinc-400 font-medium">Lock Period</th>
                                <th className="text-right py-3 px-4 text-zinc-400 font-medium">Available Rewards</th>
                                <th className="text-center py-3 px-4 text-zinc-400 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pools.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="text-center py-8 text-zinc-400">
                                    <div className="flex flex-col items-center">
                                      <Layers className="w-10 h-10 text-zinc-600 mb-2" />
                                      No pools created yet.
                                      <Button
                                        variant="link"
                                        onClick={() => setActiveTab("pools")}
                                        className="text-orange-400 hover:text-orange-300 mt-2"
                                      >
                                        Create your first pool
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                pools.map((pool) => (
                                  <tr key={pool.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                    <td className="py-3 px-4">
                                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-white">
                                        {pool.id}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mr-2">
                                          <span className="text-xs text-orange-400">
                                            {pool.stakedTokenSymbol.charAt(0)}
                                          </span>
                                        </div>
                                        {pool.stakedTokenSymbol}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mr-2">
                                          <span className="text-xs text-orange-400">
                                            {pool.rewardTokenSymbol.charAt(0)}
                                          </span>
                                        </div>
                                        {pool.rewardTokenSymbol}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      {pool.totalStaked} {pool.stakedTokenSymbol}
                                    </td>
                                    <td className="py-3 px-4 text-right text-orange-400">{pool.APY}%</td>
                                    <td className="py-3 px-4 text-right">{pool.lockDays} days</td>
                                    <td className="py-3 px-4 text-right text-orange-400">
                                      {pool.availableRewards} {pool.rewardTokenSymbol}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                                        Active
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity Card */}
                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {pools.length === 0 ? (
                            <div className="text-center py-8 text-zinc-400">
                              <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                              No recent activity to display
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                  <Plus className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white">Pool #{pools.length - 1} Created</h4>
                                  <p className="text-xs text-zinc-400 mt-1">
                                    New staking pool for {pools[pools.length - 1]?.stakedTokenSymbol || "Unknown"} with{" "}
                                    {pools[pools.length - 1]?.APY || "0"}% APY
                                  </p>
                                  <p className="text-xs text-zinc-500 mt-1">2 hours ago</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                  <CoinsIcon className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white">Rewards Deposited</h4>
                                  <p className="text-xs text-zinc-400 mt-1">
                                    {totalRewards} tokens added to reward pool
                                  </p>
                                  <p className="text-xs text-zinc-500 mt-1">5 hours ago</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                  <BarChart3 className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white">APY Updated</h4>
                                  <p className="text-xs text-zinc-400 mt-1">
                                    Pool #0 APY adjusted to {pools[0]?.APY || "0"}%
                                  </p>
                                  <p className="text-xs text-zinc-500 mt-1">1 day ago</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Pools Tab */}
                {activeTab === "pools" && (
                  <div className="space-y-6">
                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Plus className="w-5 h-5 text-orange-500" />
                          Add New Pool
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="stakedToken" className="text-zinc-400">
                                Staked Token Address
                              </Label>
                              <Input
                                id="stakedToken"
                                name="stakedToken"
                                placeholder="0x..."
                                value={newPool.stakedToken}
                                onChange={handleNewPoolChange}
                                className="bg-zinc-800 border-zinc-700 text-white mt-1 focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="rewardToken" className="text-zinc-400">
                                Reward Token Address
                              </Label>
                              <Input
                                id="rewardToken"
                                name="rewardToken"
                                placeholder="0x..."
                                value={newPool.rewardToken}
                                onChange={handleNewPoolChange}
                                className="bg-zinc-800 border-zinc-700 text-white mt-1 focus:border-orange-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="APY" className="text-zinc-400">
                                APY (%)
                              </Label>
                              <Input
                                id="APY"
                                name="APY"
                                type="number"
                                placeholder="5"
                                value={newPool.APY}
                                onChange={handleNewPoolChange}
                                className="bg-zinc-800 border-zinc-700 text-white mt-1 focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lockDays" className="text-zinc-400">
                                Lock Period (Days)
                              </Label>
                              <Input
                                id="lockDays"
                                name="lockDays"
                                type="number"
                                placeholder="30"
                                value={newPool.lockDays}
                                onChange={handleNewPoolChange}
                                className="bg-zinc-800 border-zinc-700 text-white mt-1 focus:border-orange-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button
                            onClick={handleAddPool}
                            disabled={
                              loading ||
                              !newPool.stakedToken ||
                              !newPool.rewardToken ||
                              !newPool.APY ||
                              !newPool.lockDays
                            }
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 border-0"
                          >
                            {loading ? (
                              <div className="flex items-center">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Pool
                              </div>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Layers className="w-5 h-5 text-orange-500" />
                          Existing Pools
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {pools.length === 0 ? (
                            <div className="col-span-3 text-center py-8 text-zinc-400">
                              <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                              <p className="mb-4">No pools created yet. Add your first pool above.</p>
                              <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg max-w-md mx-auto">
                                <h4 className="text-sm font-medium text-white mb-2">Quick Guide</h4>
                                <ol className="text-xs text-zinc-400 list-decimal list-inside space-y-1">
                                  <li>Enter the staked token contract address</li>
                                  <li>Enter the reward token contract address</li>
                                  <li>Set the APY percentage for stakers</li>
                                  <li>Define the lock period in days</li>
                                  <li>Click "Add Pool" to create your first staking pool</li>
                                </ol>
                              </div>
                            </div>
                          ) : (
                            pools.map((pool, index) => (
                              <motion.div
                                key={pool.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                              >
                                <Card className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700/50 overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
                                  <div className="h-2 bg-gradient-to-r from-orange-600 to-orange-400"></div>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-3">
                                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">
                                          {pool.id}
                                        </span>
                                        Pool #{pool.id}
                                      </h4>
                                      <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs">
                                        {pool.APY}% APY
                                      </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-1">
                                          <Shield className="w-3 h-3" /> Staked Token:
                                        </span>
                                        <span className="text-white">{pool.stakedTokenSymbol}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-1">
                                          <CoinsIcon className="w-3 h-3" /> Reward Token:
                                        </span>
                                        <span className="text-white">{pool.rewardTokenSymbol}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-1">
                                          <BarChart3 className="w-3 h-3" /> Total Staked:
                                        </span>
                                        <span className="text-white">
                                          {pool.totalStaked} {pool.stakedTokenSymbol}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-1">
                                          <CoinsIcon className="w-3 h-3" /> Available Rewards:
                                        </span>
                                        <span className="text-orange-400">
                                          {pool.availableRewards} {pool.rewardTokenSymbol}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-1">
                                          <Clock className="w-3 h-3" /> Lock Period:
                                        </span>
                                        <span className="text-white">{pool.lockDays} days</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-1">
                                          <TrendingUp className="w-3 h-3" /> APY:
                                        </span>
                                        <span className="text-orange-400">{pool.APY}%</span>
                                      </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-zinc-700/50">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-500">Contract Address</span>
                                        <a
                                          href={`https://scan.test2.btcs.network/address/${pool.stakedToken}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-orange-400 hover:text-orange-300 flex items-center"
                                        >
                                          View <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Rewards Tab */}
                {activeTab === "rewards" && (
                  <div className="space-y-6">
                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <CoinsIcon className="w-5 h-5 text-orange-500" />
                          Deposit Rewards
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="poolId" className="text-zinc-400">
                              Select Pool
                            </Label>
                            <select
                              id="poolId"
                              name="poolId"
                              value={rewardDeposit.poolId}
                              onChange={handleRewardDepositChange}
                              className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white mt-1 focus:border-orange-500"
                            >
                              {pools.length === 0 ? (
                                <option value="0">No pools available</option>
                              ) : (
                                pools.map((pool) => (
                                  <option key={pool.id} value={pool.id}>
                                    Pool #{pool.id} - {pool.stakedTokenSymbol} (Rewards: {pool.rewardTokenSymbol})
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="amount" className="text-zinc-400">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="text"
                              placeholder="Amount to deposit"
                              value={rewardDeposit.amount}
                              onChange={handleRewardDepositChange}
                              className="bg-zinc-800 border-zinc-700 text-white mt-1 focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button
                            onClick={handleDepositRewards}
                            disabled={loading || !rewardDeposit.amount || pools.length === 0}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 border-0"
                          >
                            {loading ? (
                              <div className="flex items-center">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <CoinsIcon className="w-4 h-4 mr-2" />
                                Deposit Rewards
                              </div>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-orange-500" />
                          Rewards Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-zinc-800">
                                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Pool ID</th>
                                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Reward Token</th>
                                <th className="text-right py-3 px-4 text-zinc-400 font-medium">Available Rewards</th>
                                <th className="text-right py-3 px-4 text-zinc-400 font-medium">APY</th>
                                <th className="text-center py-3 px-4 text-zinc-400 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pools.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center py-8 text-zinc-400">
                                    <div className="flex flex-col items-center">
                                      <CoinsIcon className="w-10 h-10 text-zinc-600 mb-2" />
                                      No pools created yet.
                                      <Button
                                        variant="link"
                                        onClick={() => setActiveTab("pools")}
                                        className="text-orange-400 hover:text-orange-300 mt-2"
                                      >
                                        Create your first pool
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                pools.map((pool) => (
                                  <tr key={pool.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                    <td className="py-3 px-4">
                                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-white">
                                        {pool.id}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mr-2">
                                          <span className="text-xs text-orange-400">
                                            {pool.rewardTokenSymbol.charAt(0)}
                                          </span>
                                        </div>
                                        {pool.rewardTokenSymbol}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-right text-orange-400">
                                      {pool.availableRewards} {pool.rewardTokenSymbol}
                                    </td>
                                    <td className="py-3 px-4 text-right text-orange-400">{pool.APY}%</td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                                        Active
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rewards Distribution Chart */}
                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-orange-500" />
                          Rewards Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {pools.length === 0 ? (
                          <div className="text-center py-8 text-zinc-400">
                            <BarChart3 className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                            No data to display
                          </div>
                        ) : (
                          <div className="h-60 w-full">
                            <div className="flex h-full items-end gap-2">
                              {pools.map((pool, index) => {
                                const height = `${Math.max(5, (Number.parseFloat(pool.availableRewards) / Number.parseFloat(totalRewards || 1)) * 100)}%`
                                return (
                                  <div key={pool.id} className="flex-1 flex flex-col items-center">
                                    <div className="w-full bg-zinc-800 rounded-t-sm relative group" style={{ height }}>
                                      <div className="absolute inset-0 bg-gradient-to-t from-orange-600 to-orange-400 opacity-70 rounded-t-sm"></div>
                                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {pool.availableRewards} {pool.rewardTokenSymbol}
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-400 mt-2">Pool #{pool.id}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <UserPlus className="w-5 h-5 text-orange-500" />
                          Transfer Ownership
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="newOwner" className="text-zinc-400">
                              New Owner Address
                            </Label>
                            <Input
                              id="newOwner"
                              name="newOwner"
                              placeholder="0x..."
                              value={newOwner}
                              onChange={handleNewOwnerChange}
                              className="bg-zinc-800 border-zinc-700 text-white mt-1 focus:border-orange-500"
                            />
                          </div>
                          <div className="p-4 bg-orange-950/30 border border-orange-800/30 rounded-md">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-orange-400">Warning</h4>
                                <p className="text-xs text-orange-300/80 mt-1">
                                  Transferring ownership will permanently remove your admin access to this contract.
                                  This action cannot be undone.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button
                            onClick={handleTransferOwnership}
                            disabled={loading || !newOwner}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 border-0"
                          >
                            {loading ? (
                              <div className="flex items-center">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Transfer Ownership
                              </div>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Settings className="w-5 h-5 text-orange-500" />
                          Contract Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex flex-col">
                            <span className="text-zinc-400 text-sm">Contract Address</span>
                            <div className="flex items-center mt-1">
                              <span className="text-white font-mono bg-zinc-800 p-2 rounded-md text-sm flex-1 truncate">
                                {CONTRACT_ADDRESS}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 text-zinc-400 hover:text-orange-400"
                                onClick={() => {
                                  navigator.clipboard.writeText(CONTRACT_ADDRESS)
                                  setMessage({ type: "success", text: "Contract address copied to clipboard" })
                                  setTimeout(() => setMessage({ type: "", text: "" }), 3000)
                                }}
                              >
                                <ClipboardCopy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-zinc-400 text-sm">Owner Address</span>
                            <div className="flex items-center mt-1">
                              <span className="text-white font-mono bg-zinc-800 p-2 rounded-md text-sm flex-1 truncate">
                                {account}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 text-zinc-400 hover:text-orange-400"
                                onClick={() => {
                                  navigator.clipboard.writeText(account)
                                  setMessage({ type: "success", text: "Owner address copied to clipboard" })
                                  setTimeout(() => setMessage({ type: "", text: "" }), 3000)
                                }}
                              >
                                <ClipboardCopy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-zinc-400 text-sm">Total Pools</span>
                            <span className="text-white font-mono bg-zinc-800 p-2 rounded-md mt-1 text-sm">
                              {pools.length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Shield className="w-5 h-5 text-orange-500" />
                          Security Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-orange-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-white">Emergency Pause</h4>
                                <p className="text-xs text-zinc-400 mt-1">Temporarily pause all staking operations</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-zinc-700 hover:border-orange-500 hover:text-orange-400"
                            >
                              Pause
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-orange-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-white">Update APY</h4>
                                <p className="text-xs text-zinc-400 mt-1">Modify APY rates for all pools</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-zinc-700 hover:border-orange-500 hover:text-orange-400"
                            >
                              Update
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-white">Modify Lock Periods</h4>
                                <p className="text-xs text-zinc-400 mt-1">Change staking lock periods</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-zinc-700 hover:border-orange-500 hover:text-orange-400"
                            >
                              Modify
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

