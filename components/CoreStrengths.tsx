"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CoreStrengths() {
  return (
    <section className="relative py-20 overflow-hidden bg-black">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-lg"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 uppercase tracking-tight">
              CORE CHAIN'S STRENGTHS!
            </h2>

            <p className="text-white text-lg leading-relaxed mb-8">
              CORO TASHI  leverages Core Chain, the first Bitcoin-aligned EVM-compatible Layer-1 blockchain. With
              its unique Satoshi Plus consensus, combining DPoW, DPoS, and Non- Custodial Bitcoin Staking, Core offers
              unparalleled security, scalability, and decentralization. This ensures high-performance and reliable
              transactions using CORE, coreBTC, and stCORE tokens, making Corosuke Protocol a robust choice for modern
              financial applications.
            </p>

            <Link
              href="https://coredao.org/"
              className="inline-flex items-center text-orange-500 text-2xl font-bold uppercase hover:text-orange-400 transition-colors"
            >
              EXPLORE CORE DAO
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-zinc-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Logo SVG */}
              <svg viewBox="0 0 240 240" className="w-52 h-52 md:w-64 md:h-64" xmlns="http://www.w3.org/2000/svg">
                {/* Outer hexagon */}
                <path
                  d="M120 20 L210 70 L210 170 L120 220 L30 170 L30 70 Z"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="12"
                />

                {/* Inner hexagon */}
                <path
                  d="M120 60 L180 95 L180 145 L120 180 L60 145 L60 95 Z"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="8"
                />

                {/* Cube - front face */}
                <path d="M120 95 L160 115 L160 155 L120 175 Z" fill="#f97316" />

                {/* Cube - top edge */}
                <path d="M120 95 L80 115 L120 135 L160 115 Z" fill="none" stroke="#f97316" strokeWidth="8" />

                {/* Cube - side edge */}
                <path d="M120 135 L120 175 L80 155 L80 115 Z" fill="none" stroke="#f97316" strokeWidth="8" />
              </svg>

              {/* Background glow */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}