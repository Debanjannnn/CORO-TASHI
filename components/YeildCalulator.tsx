import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const YieldCalculator = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("balanced")
  const [btcAmount, setBtcAmount] = useState("1.0")

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Card */}
      <div className="grid md:grid-cols-3 bg-black/90 rounded-xl border border-orange-500/20 overflow-hidden">
        {/* Left Section (2/3) */}
        <div className="md:col-span-2">
          {/* Header Section */}
          <div className="p-3 border-b border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg text-white">BTC Yield Router</h2>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300 flex items-center">
                  <span className="h-1.5 w-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Live
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Active
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2 mb-2">
              <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
                <p className="text-zinc-400 text-xs">Total Value Locked</p>
                <p className="text-lg font-medium text-white flex items-center">
                  <span>1,246.5</span>
                  <span className="text-zinc-400 ml-1">BTC</span>
                </p>
                <div className="flex items-center mt-0.5 text-green-400 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.8% from yesterday
                </div>
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
                <p className="text-zinc-400 text-xs">Current APR</p>
                <p className="text-lg font-medium text-orange-400">8.74%</p>
                <div className="flex items-center mt-0.5 text-green-400 text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +0.3% from last week
                </div>
              </div>
            </div>

            <div className="mb-1">
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full w-[64%]"></div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span className="hover:text-orange-300 cursor-pointer transition-colors">CoreDAO: 64%</span>
              <span className="hover:text-orange-300 cursor-pointer transition-colors">Uniswap: 25%</span>
              <span className="hover:text-orange-300 cursor-pointer transition-colors">Aave: 11%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: <span className="ml-1 text-white">Just now</span>
              </span>
              <button className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-300 rounded hover:bg-orange-500/20 transition-colors flex items-center border border-orange-500/30">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </button>
            </div>
          </div>

          {/* BTC Input Section */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-950/50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white text-sm font-medium">Your BTC Amount</h3>
              <div className="relative">
                <button className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-300 rounded hover:bg-orange-500/20 transition-colors flex items-center border border-orange-500/30">
                  Timeframe: 1 Year
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>

            <div className="flex items-center bg-zinc-900 rounded-lg p-2 border border-zinc-800 mb-2">
              <input
                type="text"
                value={btcAmount}
                onChange={(e) => setBtcAmount(e.target.value)}
                className="bg-transparent text-white text-lg w-full focus:outline-none px-2"
              />
              <div className="text-orange-400 font-medium px-2">BTC</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-900/70 rounded-lg p-2 border border-zinc-800">
                <p className="text-zinc-400 text-xs mb-0.5">Estimated Yield</p>
                <p className="text-lg font-medium text-orange-400">0.0874 BTC</p>
              </div>
              <div className="bg-zinc-900/70 rounded-lg p-2 border border-zinc-800">
                <p className="text-zinc-400 text-xs mb-0.5">Total Value</p>
                <p className="text-lg font-medium text-white">1.0874 BTC</p>
              </div>
            </div>
          </div>

          {/* Strategy Selection */}
          <div className="p-3 border-b border-zinc-800 md:border-b-0">
            <h3 className="text-white text-sm font-medium mb-2">Select Strategy</h3>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all h-14 border",
                  selectedStrategy === "conservative"
                    ? "bg-zinc-800/80 border-zinc-700 text-white"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50",
                )}
                onClick={() => setSelectedStrategy("conservative")}
              >
                <Shield className="h-4 w-4 mb-1" />
                <span className="text-xs">Conservative</span>
              </button>

              <button
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all h-14 border",
                  selectedStrategy === "balanced"
                    ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50",
                )}
                onClick={() => setSelectedStrategy("balanced")}
              >
                <Scale className="h-4 w-4 mb-1" />
                <span className="text-xs">Balanced</span>
              </button>

              <button
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all h-14 border",
                  selectedStrategy === "aggressive"
                    ? "bg-zinc-800/80 border-zinc-700 text-white"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50",
                )}
                onClick={() => setSelectedStrategy("aggressive")}
              >
                <Rocket className="h-4 w-4 mb-1" />
                <span className="text-xs">Aggressive</span>
              </button>
            </div>

            <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
              {selectedStrategy === "conservative" && (
                <p className="text-zinc-400 text-xs">Lower risk strategy with stable returns around 5-6% APR.</p>
              )}
              {selectedStrategy === "balanced" && (
                <p className="text-zinc-400 text-xs">Moderate risk strategy with balanced returns around 8-9% APR.</p>
              )}
              {selectedStrategy === "aggressive" && (
                <p className="text-zinc-400 text-xs">Higher risk strategy with potential returns above 12% APR.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - AI Prediction (1/3) */}
        <div className="md:border-l border-zinc-800 bg-zinc-950/50">
          <div className="p-3">
            <div className="flex items-center mb-2">
              <Target className="h-4 w-4 mr-2 text-orange-400" />
              <h3 className="text-white text-sm font-medium">AI Prediction</h3>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between p-2 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-orange-900/30 flex items-center justify-center">
                    <div className="w-4 h-4 text-orange-400">C</div>
                  </div>
                  <span className="text-xs text-white">CoreDAO</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-green-400 text-xs">+0.26%</span>
                  <span className="text-orange-300 text-xs">9.12% APR</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-orange-900/30 flex items-center justify-center">
                    <div className="w-4 h-4 text-orange-400">U</div>
                  </div>
                  <span className="text-xs text-white">Uniswap</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-green-400 text-xs">+0.18%</span>
                  <span className="text-orange-300 text-xs">7.45% APR</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-orange-900/30 flex items-center justify-center">
                    <div className="w-4 h-4 text-orange-400">A</div>
                  </div>
                  <span className="text-xs text-white">Aave</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-green-400 text-xs">+0.31%</span>
                  <span className="text-orange-300 text-xs">5.86% APR</span>
                </div>
              </div>
            </div>

            <button className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm">
              Apply Optimal Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YieldCalculator