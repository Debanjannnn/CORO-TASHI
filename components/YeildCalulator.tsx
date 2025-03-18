import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Rocket,
  RefreshCw,
  TrendingUp,
  Target,
  ArrowUpRight,
  ChevronDown,
  Zap,
  Clock,
  Scale,
  Sparkles,
  ArrowRight,
  BarChart4,
} from "lucide-react"
import { cn } from "@/lib/utils"

const YieldCalculator = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("balanced")
  const [btcAmount, setBtcAmount] = useState("1.0")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate refresh action
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Glass Background Effect */}
      <div className="absolute top-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-orange-500/20 to-transparent -z-10 blur-3xl opacity-50" />
      
      {/* Main Card with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-3 bg-black/90 rounded-2xl border border-orange-500/20 overflow-hidden shadow-xl shadow-orange-900/10"
      >
        {/* Left Section (2/3) */}
        <div className="md:col-span-2 backdrop-blur-sm relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
          
          {/* Header Section */}
          <div className="p-4 border-b border-zinc-800 relative">
            <div className="flex justify-between items-center mb-3">
              <motion.h2 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200"
              >
                BTC Yield Router
              </motion.h2>
              <div className="flex gap-2">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 flex items-center border border-green-500/30"
                >
                  <span className="h-1.5 w-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Live
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 flex items-center border border-orange-500/30"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Active
                </motion.span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 hover:bg-zinc-900/70"
              >
                <p className="text-zinc-400 text-xs">Total Value Locked</p>
                <p className="text-xl font-medium text-white flex items-center">
                  <span>1,246.5</span>
                  <span className="text-zinc-400 ml-1">BTC</span>
                </p>
                <div className="flex items-center mt-1 text-green-400 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.8% from yesterday
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 hover:bg-zinc-900/70"
              >
                <p className="text-zinc-400 text-xs">Current APR</p>
                <p className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">8.74%</p>
                <div className="flex items-center mt-1 text-green-400 text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +0.3% from last week
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-2"
            >
              <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full w-[64%]"></div>
              </div>
            </motion.div>

            <div className="flex justify-between text-xs text-zinc-400 mb-2">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="hover:text-orange-300 cursor-pointer transition-colors flex items-center"
              >
                <span className="h-2 w-2 bg-orange-500 rounded-full mr-1"></span>
                CoreDAO: 64%
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="hover:text-orange-300 cursor-pointer transition-colors flex items-center"
              >
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-1"></span>
                Uniswap: 25%
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="hover:text-orange-300 cursor-pointer transition-colors flex items-center"
              >
                <span className="h-2 w-2 bg-orange-300 rounded-full mr-1"></span>
                Aave: 11%
              </motion.span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: <span className="ml-1 text-white">Just now</span>
              </span>
              <button 
                onClick={handleRefresh}
                className="text-xs px-3 py-1 bg-orange-500/10 text-orange-300 rounded-full hover:bg-orange-500/20 transition-colors flex items-center border border-orange-500/30"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* BTC Input Section */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white text-sm font-medium">Your BTC Amount</h3>
              <div className="relative">
                <button className="text-xs px-3 py-1 bg-orange-500/10 text-orange-300 rounded-full hover:bg-orange-500/20 transition-colors flex items-center border border-orange-500/30 group">
                  Timeframe: 1 Year
                  <ChevronDown className="h-3 w-3 ml-1 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center bg-zinc-900/70 rounded-xl p-3 border border-zinc-800 mb-3 focus-within:border-orange-500/50 transition-colors"
            >
              <input
                type="text"
                value={btcAmount}
                onChange={(e) => setBtcAmount(e.target.value)}
                className="bg-transparent text-white text-xl w-full focus:outline-none px-2"
              />
              <div className="text-orange-400 font-medium px-2 bg-orange-500/10 py-1 rounded-lg border border-orange-500/20">BTC</div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-zinc-900/70 rounded-xl p-3 border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 hover:bg-zinc-900/80"
              >
                <p className="text-zinc-400 text-xs mb-1">Estimated Yield</p>
                <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">0.0874 BTC</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-zinc-900/70 rounded-xl p-3 border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 hover:bg-zinc-900/80"
              >
                <p className="text-zinc-400 text-xs mb-1">Total Value</p>
                <p className="text-lg font-medium text-white">1.0874 BTC</p>
              </motion.div>
            </div>
          </div>

          {/* Strategy Selection */}
          <div className="p-4 border-b border-zinc-800 md:border-b-0 backdrop-blur-sm">
            <h3 className="text-white text-sm font-medium mb-3">Select Strategy</h3>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl transition-all h-20 border",
                  selectedStrategy === "conservative"
                    ? "bg-zinc-800/80 border-zinc-700 text-white shadow-inner"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:border-zinc-700",
                )}
                onClick={() => setSelectedStrategy("conservative")}
              >
                <Shield className={`h-5 w-5 mb-2 ${selectedStrategy === "conservative" ? "text-blue-400" : ""}`} />
                <span className="text-xs">Conservative</span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl transition-all h-20 border",
                  selectedStrategy === "balanced"
                    ? "bg-gradient-to-b from-orange-500/30 to-orange-600/10 border-orange-500/40 text-orange-300 shadow-inner"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:border-zinc-700",
                )}
                onClick={() => setSelectedStrategy("balanced")}
              >
                <Scale className={`h-5 w-5 mb-2 ${selectedStrategy === "balanced" ? "text-orange-400" : ""}`} />
                <span className="text-xs">Balanced</span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl transition-all h-20 border",
                  selectedStrategy === "aggressive"
                    ? "bg-zinc-800/80 border-zinc-700 text-white shadow-inner"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:border-zinc-700",
                )}
                onClick={() => setSelectedStrategy("aggressive")}
              >
                <Rocket className={`h-5 w-5 mb-2 ${selectedStrategy === "aggressive" ? "text-red-400" : ""}`} />
                <span className="text-xs">Aggressive</span>
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-300"></div>
              {selectedStrategy === "conservative" && (
                <p className="text-zinc-400 text-xs">Lower risk strategy with stable returns around 5-6% APR.</p>
              )}
              {selectedStrategy === "balanced" && (
                <p className="text-zinc-400 text-xs">Moderate risk strategy with balanced returns around 8-9% APR.</p>
              )}
              {selectedStrategy === "aggressive" && (
                <p className="text-zinc-400 text-xs">Higher risk strategy with potential returns above 12% APR.</p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Section - AI Prediction (1/3) */}
        <div className="md:border-l border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900/95 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Target className="h-4 w-4 mr-2 text-orange-400" />
              <h3 className="text-white text-sm font-medium">AI Prediction</h3>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2 mb-4"
            >
              <div className="flex items-center justify-between p-3 bg-zinc-900/70 rounded-xl border border-zinc-800 hover:border-orange-500/30 transition-colors hover:transform hover:translate-x-1 duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center border border-orange-500/20">
                    <div className="text-orange-400 text-xs font-bold">C</div>
                  </div>
                  <span className="text-xs text-white">CoreDAO</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-400 text-xs flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" />+0.26%</span>
                  <span className="text-orange-300 text-xs">9.12% APR</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/70 rounded-xl border border-zinc-800 hover:border-orange-500/30 transition-colors hover:transform hover:translate-x-1 duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center border border-orange-500/20">
                    <div className="text-orange-400 text-xs font-bold">U</div>
                  </div>
                  <span className="text-xs text-white">Uniswap</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-400 text-xs flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" />+0.18%</span>
                  <span className="text-orange-300 text-xs">7.45% APR</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/70 rounded-xl border border-zinc-800 hover:border-orange-500/30 transition-colors hover:transform hover:translate-x-1 duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center border border-orange-500/20">
                    <div className="text-orange-400 text-xs font-bold">A</div>
                  </div>
                  <span className="text-xs text-white">Aave</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-400 text-xs flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" />+0.31%</span>
                  <span className="text-orange-300 text-xs">5.86% APR</span>
                </div>
              </div>
            </motion.div>

            <div className="rounded-xl bg-zinc-900/30 p-2 mb-4 border border-zinc-800/50">
              <div className="flex items-center mb-2">
                <BarChart4 className="h-3 w-3 text-orange-400 mr-1" />
                <span className="text-xs text-zinc-400">Performance Metrics</span>
              </div>
              <div className="h-20 w-full flex items-end">
                <div className="h-[40%] w-1/3 bg-gradient-to-t from-orange-500/80 to-orange-500/20 rounded-t-sm mx-0.5"></div>
                <div className="h-[70%] w-1/3 bg-gradient-to-t from-orange-500/80 to-orange-500/20 rounded-t-sm mx-0.5"></div>
                <div className="h-[30%] w-1/3 bg-gradient-to-t from-orange-500/80 to-orange-500/20 rounded-t-sm mx-0.5"></div>
              </div>
            </div>

            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-xl transition-all duration-300 text-sm font-medium flex items-center justify-center group"
            >
              Apply Optimal Strategy
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default YieldCalculator
