"use client"
import { ContainerScroll } from "./ui/container-scroll-animation"
import YieldCalculator from "./YeildCalulator"
import { motion } from "framer-motion"

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden bg-black">
      <ContainerScroll
        titleComponent={
          <div className="relative z-10">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-orange-500/20 rounded-full blur-[100px]" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-semibold text-white mb-2 tracking-tight">Unleash the power of</div>
              <div className="relative">
                <h1 className="text-5xl md:text-[6rem] font-bold leading-none text-white">
                  CORE <span className="text-orange-500">DAO</span>
                </h1>
                <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 px-5 py-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium"
              >
                Maximize Your Yield
              </motion.div>
            </motion.div>
          </div>
        }
      >
        <YieldCalculator />
      </ContainerScroll>
    </div>
  )
}

