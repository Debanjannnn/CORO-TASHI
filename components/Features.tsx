"use client"
import { cn } from "@/lib/utils"
import { BentoGrid, BentoGridItem } from "./ui/bento-grid"

import { IconClipboardCopy, IconFileBroken, IconSignature, IconTableColumn } from "@tabler/icons-react"
import { motion } from "framer-motion"

export default function Features() {
  return (
    <BentoGrid className="max-w-5xl mx-auto md:auto-rows-[20rem] pb-10">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  )
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  }
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-zinc-800/[0.2] bg-dot-zinc-800/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-zinc-800 p-2 items-center space-x-2 bg-zinc-900 dark:bg-zinc-900"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 shrink-0" />
        <div className="w-full bg-zinc-800 h-4 rounded-full dark:bg-zinc-800" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-zinc-800 p-2 items-center space-x-2 w-3/4 ml-auto bg-zinc-900 dark:bg-zinc-900"
      >
        <div className="w-full bg-zinc-800 h-4 rounded-full dark:bg-zinc-800" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-zinc-800 p-2 items-center space-x-2 bg-zinc-900 dark:bg-zinc-900"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 shrink-0" />
        <div className="w-full bg-zinc-800 h-4 rounded-full dark:bg-zinc-800" />
      </motion.div>
    </motion.div>
  )
}

const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  }
  const arr = new Array(6).fill(0)
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-zinc-800/[0.2] bg-dot-zinc-800/[0.2] flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
          }}
          className="flex flex-row rounded-full border border-zinc-800 p-2 items-center space-x-2 bg-zinc-800 dark:bg-zinc-800 w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  )
}

const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  }
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-zinc-800/[0.2] rounded-lg bg-dot-zinc-800/[0.2] flex-col space-y-2"
      style={{
        background: "linear-gradient(-45deg, #ff7e5f, #feb47b, #ff7e5f, #feb47b)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  )
}

const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  }
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  }
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-zinc-800/[0.2] bg-dot-zinc-800/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-zinc-900 p-4 dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-800 flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 rounded-full bg-orange-900/30 flex items-center justify-center">
          <div className="text-orange-400">C</div>
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-zinc-400 mt-4">Conservative</p>
        <p className="border border-zinc-700 bg-zinc-800/50 text-zinc-400 text-xs rounded-full px-2 py-0.5 mt-4">
          Low Risk
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-zinc-900 p-4 dark:bg-zinc-900 dark:border-zinc-800 border border-orange-500/30 flex flex-col items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-orange-900/30 flex items-center justify-center">
          <div className="text-orange-400">B</div>
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-zinc-400 mt-4">Balanced</p>
        <p className="border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs rounded-full px-2 py-0.5 mt-4">
          Moderate
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-zinc-900 p-4 dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-800 flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 rounded-full bg-orange-900/30 flex items-center justify-center">
          <div className="text-orange-400">A</div>
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-zinc-400 mt-4">Aggressive</p>
        <p className="border border-zinc-700 bg-zinc-800/50 text-zinc-400 text-xs rounded-full px-2 py-0.5 mt-4">
          High Risk
        </p>
      </motion.div>
    </motion.div>
  )
}

const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  }
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-zinc-800/[0.2] bg-dot-zinc-800/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-zinc-800 p-2 items-start space-x-2 bg-zinc-900 dark:bg-zinc-900"
      >
        <div className="rounded-full h-10 w-10 bg-orange-900/30 flex items-center justify-center">
          <div className="text-orange-400">C</div>
        </div>
        <p className="text-xs text-zinc-400">
          CoreDAO offers the highest yield with moderate risk profile and excellent liquidity...
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-zinc-800 p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-zinc-900 dark:bg-zinc-900"
      >
        <p className="text-xs text-zinc-400">Recommended allocation: 64%</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 shrink-0" />
      </motion.div>
    </motion.div>
  )
}

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
    icon: <IconClipboardCopy className="h-4 w-4 text-orange-400" />,
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
    icon: <IconFileBroken className="h-4 w-4 text-orange-400" />,
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
    icon: <IconSignature className="h-4 w-4 text-orange-400" />,
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
    icon: <IconTableColumn className="h-4 w-4 text-orange-400" />,
  },
]

