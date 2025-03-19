"use client"
import { motion } from "framer-motion"
import { ClipboardCopy, GitBranch, BarChart3, Settings } from "lucide-react"
import React from "react"

export function FeaturesSection() {
  const items = [
    {
      title: "AI-Powered Yield Optimization",
      description: (
        <span className="text-sm">
          Machine learning models analyze historical staking rewards to predict real-time APR and choose the best pools.
        </span>
      ),
      header: <SkeletonOne />,
      className: "",
      icon: <ClipboardCopy className="h-4 w-4 text-orange-400" />,
    },
    // {
    //   title: "Smart Liquidity Routing",
    //   description: (
    //     <span className="text-sm">
    //       Multi-DEX integration with CoreDAO, Uniswap, Curve, and Aave with automatic slippage reduction.
    //     </span>
    //   ),
    //   header: <SkeletonTwo />,
    //   className: "",
    //   icon: <GitBranch className="h-4 w-4 text-orange-400" />,
    // },

    {
      title: "Multi-Pool Staking System",
      description: (
        <span className="text-sm">
          Support for multiple staking pools with different tokens
          Each pool can have unique APY rates and configurations
          Separate staked and reward tokens per pool.
        </span>
      ),
      header: <SkeletonTwo />,
      className: "",
      icon: <GitBranch className="h-4 w-4 text-orange-400" />,
    },
    {
      title: "Auto-Rebalancing",
      description: (
        <span className="text-sm">
          Automatically shifts liquidity when APR drops, using real-time oracle data from Chainlink and The Graph.
        </span>
      ),
      header: <SkeletonThree />,
      className: "",
      icon: <BarChart3 className="h-4 w-4 text-orange-400" />,
    },
    {
      title: "User Customization",
      description: (
        <span className="text-sm">
          Choose between Conservative, Aggressive, or Custom modes to match your investment strategy.
        </span>
      ),
      header: <SkeletonFour />,
      className: "",
      icon: <Settings className="h-4 w-4 text-orange-400" />,
    },
  ]

  return (
    <section className="relative pt-8 pb-20 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/3 right-1/5 w-[250px] h-[250px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-orange-500/10 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=2&width=2')] bg-[length:50px_50px] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            WHY CHOOSE <span className="text-orange-500">CORO TASHI?</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
          Stake your assets, multiply your power, and reign over DeFi—because the future doesn’t wait, and neither should you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className={`group relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 ${item.className}`}
            >
              <div className="relative h-full min-h-[220px]">
                <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {item.header}
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mr-3 border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                      {React.cloneElement(item.icon as React.ReactElement<any>, { className: "h-5 w-5 text-orange-400" })}
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
                    {item.description}
                  </div>

                  <div className="mt-auto pt-4 flex items-center text-orange-400 text-sm font-medium">
                    Learn more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Skeleton components with visual elements that match the theme
function SkeletonOne() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>

        {/* Animated circuit-like pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10,30 L30,30 L30,10 M70,10 L70,30 L90,30 M90,70 L70,70 L70,90 M30,90 L30,70 L10,70"
              stroke="#f97316"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <path
              d="M40,20 L60,20 M20,40 L20,60 M40,80 L60,80 M80,40 L80,60"
              stroke="#f97316"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="50" cy="50" r="30" stroke="#f97316" strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="50" cy="50" r="20" stroke="#f97316" strokeWidth="0.5" fill="none" opacity="0.5" />
            <circle cx="50" cy="50" r="10" stroke="#f97316" strokeWidth="0.5" fill="none" opacity="0.7" />
          </svg>
        </div>

        <div className="absolute bottom-10 left-10 flex space-x-1">
          <div className="w-2 h-8 bg-orange-500/30 rounded-full animate-pulse"></div>
          <div className="w-2 h-12 bg-orange-500/40 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-6 bg-orange-500/30 rounded-full animate-pulse delay-200"></div>
          <div className="w-2 h-10 bg-orange-500/40 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  )
}

function SkeletonTwo() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full">
          {/* Network nodes visualization */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="2" fill="#f97316" opacity="0.5" />
              <circle cx="80" cy="20" r="2" fill="#f97316" opacity="0.5" />
              <circle cx="20" cy="80" r="2" fill="#f97316" opacity="0.5" />
              <circle cx="80" cy="80" r="2" fill="#f97316" opacity="0.5" />
              <circle cx="50" cy="50" r="3" fill="#f97316" opacity="0.8" />

              <line x1="20" y1="20" x2="50" y2="50" stroke="#f97316" strokeWidth="0.3" opacity="0.3" />
              <line x1="80" y1="20" x2="50" y2="50" stroke="#f97316" strokeWidth="0.3" opacity="0.3" />
              <line x1="20" y1="80" x2="50" y2="50" stroke="#f97316" strokeWidth="0.3" opacity="0.3" />
              <line x1="80" y1="80" x2="50" y2="50" stroke="#f97316" strokeWidth="0.3" opacity="0.3" />

              <circle cx="20" cy="20" r="2" fill="#f97316" opacity="0.5">
                <animate attributeName="r" values="2;3;2" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="20" r="2" fill="#f97316" opacity="0.5">
                <animate attributeName="r" values="2;3;2" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="20" cy="80" r="2" fill="#f97316" opacity="0.5">
                <animate attributeName="r" values="2;3;2" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="80" r="2" fill="#f97316" opacity="0.5">
                <animate attributeName="r" values="2;3;2" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="50" r="3" fill="#f97316" opacity="0.8">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <div className="absolute bottom-5 right-5">
            <div className="w-16 h-1 bg-orange-500/30 rounded-full mb-2"></div>
            <div className="w-12 h-1 bg-orange-500/20 rounded-full mb-2"></div>
            <div className="w-20 h-1 bg-orange-500/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonThree() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated chart-like visualization */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-2 border-dashed border-orange-500/20 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-dashed border-orange-500/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 border-2 border-dashed border-orange-500/20 rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-2 border-dashed border-orange-500/10 rounded-full animate-pulse"></div>

            <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,20 L50,80" stroke="#f97316" strokeWidth="0.5" opacity="0.3" />
              <path d="M20,50 L80,50" stroke="#f97316" strokeWidth="0.5" opacity="0.3" />

              <path d="M30,30 L70,70" stroke="#f97316" strokeWidth="0.5" opacity="0.3" />
              <path d="M30,70 L70,30" stroke="#f97316" strokeWidth="0.5" opacity="0.3" />

              <path d="M50,20 C70,30 70,70 50,80" stroke="#f97316" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M50,20 C30,30 30,70 50,80" stroke="#f97316" strokeWidth="1" fill="none" opacity="0.5" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500/40 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-orange-500/20 animate-pulse delay-300"></div>
          <div className="w-3 h-3 rounded-full bg-orange-500/10 animate-pulse delay-700"></div>
        </div>
      </div>
    </div>
  )
}

function SkeletonFour() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
          {/* Settings/customization visualization */}
          <div className="absolute inset-0 border border-orange-500/20 rounded-lg"></div>

          <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" stroke="#f97316" strokeWidth="0.5" fill="none" opacity="0.2" />

            <g opacity="0.6">
              <circle cx="50" cy="20" r="3" fill="#f97316">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="50" r="3" fill="#f97316">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="0.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="80" r="3" fill="#f97316">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="20" cy="50" r="3" fill="#f97316">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="1.5s" repeatCount="indefinite" />
              </circle>
            </g>

            <path d="M50,20 L50,30" stroke="#f97316" strokeWidth="0.5" />
            <path d="M80,50 L70,50" stroke="#f97316" strokeWidth="0.5" />
            <path d="M50,80 L50,70" stroke="#f97316" strokeWidth="0.5" />
            <path d="M20,50 L30,50" stroke="#f97316" strokeWidth="0.5" />

            <circle cx="50" cy="50" r="10" stroke="#f97316" strokeWidth="1" fill="none">
              <animate attributeName="r" values="10;12;10" dur="3s" repeatCount="indefinite" />
            </circle>

            <path d="M44,44 L56,56 M44,56 L56,44" stroke="#f97316" strokeWidth="1" />
          </svg>
        </div>

        <div className="absolute top-5 right-5 grid grid-cols-2 gap-1">
          <div className="w-2 h-2 bg-orange-500/30 rounded-sm"></div>
          <div className="w-2 h-2 bg-orange-500/20 rounded-sm"></div>
          <div className="w-2 h-2 bg-orange-500/10 rounded-sm"></div>
          <div className="w-2 h-2 bg-orange-500/5 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
}