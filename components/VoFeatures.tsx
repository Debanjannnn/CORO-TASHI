"use client"
import { motion } from "framer-motion"
import { ClipboardCopy, GitBranch, BarChart3, Settings } from "lucide-react"

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
      className: "md:col-span-2",
      icon: <ClipboardCopy className="h-4 w-4 text-orange-400" />,
    },
    {
      title: "Smart Liquidity Routing",
      description: (
        <span className="text-sm">
          Multi-DEX integration with CoreDAO, Uniswap, Curve, and Aave with automatic slippage reduction.
        </span>
      ),
      header: <SkeletonTwo />,
      className: "md:col-span-1",
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
      className: "md:col-span-1",
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
      className: "md:col-span-2",
      icon: <Settings className="h-4 w-4 text-orange-400" />,
    },
  ]

  return (
    <section className="relative py-15 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/3 right-1/5 w-[250px] h-[250px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-orange-500/10 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=2&width=2')] bg-[length:50px_50px] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful <span className="text-orange-500">Features</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cutting-edge technology to maximize your yield and optimize your investments in the CoreDAO ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 ${item.className}`}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {item.header}
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mr-3 border border-orange-500/20">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <div className="text-gray-400 mt-2">{item.description}</div>

                  <div className="mt-auto pt-4 flex items-center text-orange-400 text-sm font-medium">
                    Learn more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
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
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>

        {/* Decorative elements */}
        <svg
          className="absolute top-10 right-10 w-20 h-20 text-orange-500/20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M44.5,-76.3C59.1,-69.9,73.1,-60.1,81.7,-46.2C90.3,-32.3,93.5,-14.3,90.8,2.7C88.2,19.7,79.7,35.8,68.3,48.1C56.9,60.5,42.7,69.2,27.4,74.8C12.1,80.4,-4.3,82.9,-19.6,79.1C-34.9,75.3,-49.1,65.2,-60.1,52.3C-71.1,39.4,-78.9,23.7,-81.3,6.6C-83.7,-10.5,-80.8,-29,-71.9,-43.2C-63,-57.4,-48.1,-67.3,-33.3,-73.8C-18.5,-80.3,-3.7,-83.4,9.8,-80.1C23.3,-76.8,29.9,-82.7,44.5,-76.3Z"
            transform="translate(100 100)"
          />
        </svg>

        <div className="absolute bottom-10 left-10 flex space-x-1">
          <div className="w-2 h-8 bg-orange-500/30 rounded-full"></div>
          <div className="w-2 h-12 bg-orange-500/40 rounded-full"></div>
          <div className="w-2 h-6 bg-orange-500/30 rounded-full"></div>
          <div className="w-2 h-10 bg-orange-500/40 rounded-full"></div>
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
          <svg
            className="absolute top-5 left-5 w-24 h-24 text-orange-500/10"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
          </svg>

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
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-2 border-dashed border-orange-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-2 border-dashed border-orange-500/30 rounded-full animate-spin-slow-reverse"></div>
            <div className="absolute inset-4 border-2 border-dashed border-orange-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-6 border-2 border-dashed border-orange-500/10 rounded-full animate-spin-slow-reverse"></div>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500/40"></div>
          <div className="w-3 h-3 rounded-full bg-orange-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-orange-500/10"></div>
        </div>
      </div>
    </div>
  )
}

function SkeletonFour() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
          <div className="absolute inset-0 border border-orange-500/20 rounded-lg"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-45">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-90">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-135">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent"></div>
          </div>
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

